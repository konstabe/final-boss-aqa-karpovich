import { OrdersApi } from "api/api/orders.api";
import {
	IAddress,
	ICreatedCustomerForOrder,
	ICreatedProductsForOrder,
	IOrderDelivery,
	IOrderFromResponse,
	IOrderWithCustomerAndProducts,
} from "data/types/order.types";
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
import { getOrdersSchema } from "data/schemas/orders/getOrder.schema";

export class OrdersApiService {
	ordersIds: string[] = [];
	customersIds: string[] = [];
	productsIds: string[] = [];
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
		this.collectIdsForDeletion(createdOrder.body.Order);

		validateResponse(createdOrder, {
			status: STATUS_CODES.CREATED,
			schema: getOrdersSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return createdOrder.body.Order;
	}

	async createDraftWithDelivery(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraft(token, numberOfProducts);
		const deliveryDetails = this.createDeliveryDetails(order);
		const response = await this.ordersApi.updateDeliveryDetails(order._id, deliveryDetails, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		const orderWithDelivery = response.body.Order;

		if (!orderWithDelivery.delivery) {
			throw new Error(`createDraftWithDelivery failed: delivery was not set for order ${order._id}`);
		}

		return orderWithDelivery;
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

		if (numberOfReceivedProducts < 1 || numberOfReceivedProducts > 5) {
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
			schema: orderResponseSchema,
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

	async fullDelete(token: string) {
		if (this.ordersIds.length > 0) {
			await Promise.all(this.ordersIds.map((id) => this.deleteOrder(token, id)));
		}

		if (this.productsIds.length > 0) {
			await Promise.all(this.productsIds.map((id) => this.productsApiService.delete(token, id)));
		}

		if (this.customersIds.length > 0) {
			await Promise.all(this.customersIds.map((id) => this.customersApiService.delete(id, token)));
		}

		this.ordersIds.length = 0;
		this.productsIds.length = 0;
		this.customersIds.length = 0;
	}

	collectIdsForDeletion(order: IOrderFromResponse) {
		this.ordersIds.push(order._id);
		this.customersIds.push(order.customer._id);
		order.products.forEach((product) => this.productsIds.push(product._id));
	}

	async deleteComment(token: string, commentId: string, orderId: string) {
		const deleted = await this.ordersApi.deleteCommentFromOrder(orderId, commentId, token);
		validateResponse(deleted, {
			status: STATUS_CODES.DELETED,
		});

		return deleted;
	}

	async addComment(token: string, commentId: string, orderId: string) {
		const created = await this.ordersApi.addCommentToOrder(orderId, commentId, token);
		validateResponse(created, {
			status: STATUS_CODES.OK,
		});

		return created;
	}

	async createProducts(token: string, numberOfProducts: number): Promise<ICreatedProductsForOrder> {
		const productsIds: string[] = [];
		const productNames: string[] = [];
		for (let i = 0; i < numberOfProducts; i++) {
			const products = await this.productsApiService.create(token);
			productsIds.push(products._id);
			productNames.push(products.name);
		}

		return {
			productsIds,
			productNames,
		};
	}

	async createCustomer(token: string): Promise<ICreatedCustomerForOrder> {
		const customer = await this.customersApiService.create(token);

		return {
			customerId: customer._id,
			customerName: customer.name,
			customerEmail: customer.email,
		};
	}
}
