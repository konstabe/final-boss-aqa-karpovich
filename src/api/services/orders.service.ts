import { OrdersApi } from "api/api/orders.api";
import { IAddress, IOrderDelivery, IOrderFromResponse, IOrderWithCustomerAndProducts } from "data/types/order.types";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { CustomersApiService } from "./customers.service";
import { ProductsApiService } from "./products.service";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { getRandomFutureDate } from "utils/generateData.utils";
import { expect } from "fixtures/api.fixture";
import { getRandomItemsFromArray } from "utils/getRandom.utils";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { IProductFromResponse } from "data/types/product.types";
import { ORDER_STATUS } from "data/orders/orderStatus";

export class OrdersApiService {
	constructor(
		private ordersApi: OrdersApi,
		private customersApiService: CustomersApiService,
		private productsApiService: ProductsApiService,
	) {}

	async createOrderData(token: string, numberOfProducts: number): Promise<IOrderWithCustomerAndProducts> {
		const customer = await this.customersApiService.create(token);

		const productsIds: string[] = [];
		const productsData: IProductFromResponse[] = [];

		for (let i = 1; i <= numberOfProducts; i++) {
			const product = await this.productsApiService.create(token);
			productsIds.push(product._id);
			productsData.push(product);
		}

		return {
			customer: customer._id,
			products: productsIds,
			customerData: customer,
			productsData: productsData,
		};
	}

	async createDraft(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const { customer, products } = await this.createOrderData(token, numberOfProducts);

		const createdOrder = await this.ordersApi.create({ customer, products }, token);
		validateResponse(createdOrder, {
			status: STATUS_CODES.CREATED,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return createdOrder.body.Order;
	}

	async createDraftWithDelivery(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraft(token, numberOfProducts);
		const deliveryDetails = this.createDeliveryDetails(order);
		const orderWithDelivery = await this.ordersApi.updateDeliveryDetails(order._id, deliveryDetails, token);
		validateResponse(orderWithDelivery, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});

		return orderWithDelivery.body.Order;
	}

	private createDeliveryDetails(order: IOrderFromResponse): IOrderDelivery {
		const address: IAddress = _.pick(order.customer, ["country", "city", "house", "flat", "street"]);
		return {
			finalDate: getRandomFutureDate(),
			condition: "Pickup",
			address: address,
		};
	}

	async processOrder(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraftWithDelivery(token, numberOfProducts);
		const orderInProcess = await this.ordersApi.updateOrderStatus(order._id, ORDER_STATUS.IN_PROGRESS, token);
		validateResponse(orderInProcess, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(orderInProcess.body.Order.status).toBe(ORDER_STATUS.IN_PROGRESS);

		return orderInProcess.body.Order;
	}

	async allReceived(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.processOrder(token, numberOfProducts);
		const productsId = order.products.map((product) => product._id);
		const received = await this.ordersApi.markOrdersAsReceived(order._id, productsId, token);
		validateResponse(received, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(received.body.Order.status).toBe(ORDER_STATUS.RECEIVED);
		const productsArray = received.body.Order.products;
		const allReceived = productsArray.every((product) => product.received === true);
		if (!allReceived) {
			throw new Error("Not all products were marked as received");
		}

		return received.body.Order;
	}

	private getNotReceivedProducts(order: IOrderFromResponse) {
		return order.products.filter((product) => !product.received);
	}

	async partiallyReceived(
		token: string,
		order: IOrderFromResponse,
		numberOfReceivedProducts: number,
	): Promise<IOrderFromResponse> {
		const notReceived = this.getNotReceivedProducts(order);

		if (numberOfReceivedProducts < 1 && numberOfReceivedProducts > 5) {
			throw new Error(
				`Incorrect amount of products to receive is passed '${numberOfReceivedProducts}', min - 1, max - 5`,
			);
		}

		if (numberOfReceivedProducts > notReceived.length) {
			throw new Error(
				`Cannot receive ${numberOfReceivedProducts} products. Only ${notReceived.length} products are not received yet.`,
			);
		}

		const randomProductsId = getRandomItemsFromArray(
			notReceived.map((p) => p._id),
			numberOfReceivedProducts,
		);

		const partiallyReceived = await this.ordersApi.markOrdersAsReceived(order._id, randomProductsId, token);
		validateResponse(partiallyReceived, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(partiallyReceived.body.Order.status).toBe(ORDER_STATUS.PARTIALLY_RECEIVED);

		return partiallyReceived.body.Order;
	}

	async orderWithAssignedManager(
		token: string,
		numberOfProducts: number,
		managerId: string,
	): Promise<IOrderFromResponse> {
		const order = await this.createDraftWithDelivery(token, numberOfProducts);
		const assigned = await this.ordersApi.assignManagerToOrder(order._id, managerId, token);
		validateResponse(assigned, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});

		return assigned.body.Order;
	}

	async cancelOrderInProgress(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.processOrder(token, numberOfProducts);
		const changedStatus = await this.ordersApi.updateOrderStatus(order._id, ORDER_STATUS.CANCELED, token);
		validateResponse(changedStatus, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(changedStatus.body.Order.status).toBe(ORDER_STATUS.CANCELED);

		return changedStatus.body.Order;
	}

	async reopenOrderInProgress(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const canceled = await this.cancelOrderInProgress(token, numberOfProducts);
		const changedStatus = await this.ordersApi.updateOrderStatus(canceled._id, ORDER_STATUS.DRAFT, token);
		validateResponse(changedStatus, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema, //подставить нужную схему
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(changedStatus.body.Order.status).toBe(ORDER_STATUS.DRAFT);

		return changedStatus.body.Order;
	}

	async deleteOrder(token: string, orderId: string) {
		const deleted = await this.ordersApi.delete(orderId, token);
		validateResponse(deleted, {
			status: STATUS_CODES.DELETED,
		});

		return deleted;
	}

	async fullDelete(token: string, ordersId: string[], customersId: string[], productsId: string[]) {
		if (ordersId.length > 0) {
			await Promise.all(ordersId.map((id) => this.deleteOrder(token, id)));
		}

		if (productsId.length > 0) {
			await Promise.all(productsId.map((id) => this.productsApiService.delete(token, id)));
		}

		if (customersId.length > 0) {
			await Promise.all(customersId.map((id) => this.customersApiService.delete(id, token)));
		}
	}

	async collectIdsForDeletion(
		order: IOrderFromResponse,
		ordersArray: string[],
		customersArray: string[],
		productsArray: string[],
	) {
		ordersArray.push(order._id);
		customersArray.push(order.customer._id);
		order.products.forEach((product) => productsArray.push(product._id));
	}
}
