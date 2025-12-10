import { OrdersApi } from "api/api/orders.api";
import { IAddress, IOrder, IOrderDelivery, IOrderFromResponse } from "data/types/order.types";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { CustomersApiService } from "./customers.service";
import { ProductsApiService } from "./products.service";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { getRandomFutureDate } from "utils/generateData.utils";
import { expect } from "fixtures/api.fixture";
import { getRandomItemsFromArray } from "utils/getRandom.utils";
import { orderSchema } from "data/schemas/orders/order.schema";

export class OrdersApiService {
	constructor(
		private ordersApi: OrdersApi,
		private customersApiService: CustomersApiService,
		private productsApiService: ProductsApiService,
	) {}

	async createDraft(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order: IOrder = {
			customer: "",
			products: [],
		};
		const customer = await this.customersApiService.create(token);
		order.customer = customer._id;
		for (let i = 1; i <= numberOfProducts; i++) {
			const product = await this.productsApiService.create(token);
			order.products.push(product._id);
		}

		const createdOrder = await this.ordersApi.create(order, token);
		validateResponse(createdOrder, {
			status: STATUS_CODES.CREATED,
			schema: orderSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return createdOrder.body.Order;
	}

	async createDraftWithDelivery(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraft(token, numberOfProducts);
		const address: IAddress = _.pick(order.customer, ["country", "city", "house", "flat", "street"]);
		const deliveryDetails: IOrderDelivery = {
			finalDate: getRandomFutureDate(),
			condition: "Pickup",
			address: address,
		};
		const orderWithDelivery = await this.ordersApi.updateDeliveryDetails(order._id, deliveryDetails, token);
		validateResponse(orderWithDelivery, {
			status: STATUS_CODES.OK,
			schema: orderSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return orderWithDelivery.body.Order;
	}

	async processOrder(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraftWithDelivery(token, numberOfProducts);
		const orderInProcess = await this.ordersApi.updateOrderStatus(order._id, "In Process", token);
		validateResponse(orderInProcess, {
			status: STATUS_CODES.OK,
			schema: orderSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(orderInProcess.body.Order.status).toBe("In Process");

		return orderInProcess.body.Order;
	}

	async allReceived(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.processOrder(token, numberOfProducts);
		const productsId = order.products.map((product) => product._id);
		const received = await this.ordersApi.markOrdersAsReceived(order._id, productsId, token);
		validateResponse(received, {
			status: STATUS_CODES.OK,
			schema: orderSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(received.body.Order.status).toBe("Received");
		const productsArray = received.body.Order.products;
		const allReceived = productsArray.every((product) => product.received === true);
		if (!allReceived) {
			throw new Error("Not all products were marked as received");
		}

		return received.body.Order;
	}

	async partiallyReceived(
		token: string,
		numberOfProducts: number,
		numberOfReceivedProducts: number,
	): Promise<IOrderFromResponse> {
		if (numberOfProducts <= numberOfReceivedProducts) {
			throw new Error("Number of received products must be less than total products");
		}
		const order = await this.processOrder(token, numberOfProducts);
		const productsId = order.products.map((product) => product._id);

		const randomProductsId = getRandomItemsFromArray(productsId, numberOfReceivedProducts);
		const partiallyReceived = await this.ordersApi.markOrdersAsReceived(order._id, randomProductsId, token);
		validateResponse(partiallyReceived, {
			status: STATUS_CODES.OK,
			schema: orderSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
		expect(partiallyReceived.body.Order.status).toBe("Partially Received");

		return partiallyReceived.body.Order;
	}

	async deleteOrder(token: string, orderId: string) {
		const deleted = await this.ordersApi.delete(orderId, token);
		validateResponse(deleted, {
			status: STATUS_CODES.DELETED,
		});

		return deleted;
	}
}
