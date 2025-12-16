import { OrdersApi } from "api/api/orders.api";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IOrder, IOrderDelivery, IOrderFromResponse, OrderStatus } from "data/types/order.types.js";
import { expect } from "fixtures/api.fixture";
import { getRandomItemsFromArray } from "utils/getRandom.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class OrdersApiService {
	constructor(private ordersApi: OrdersApi) {}

	async createDraftNew(token: string, order: IOrder): Promise<IOrderFromResponse> {
		const response = await this.ordersApi.create(order, token);

		validateResponse(response, {
			status: STATUS_CODES.CREATED,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Order;
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

	async deleteOrder(token: string, orderId: string) {
		const deleted = await this.ordersApi.delete(orderId, token);
		validateResponse(deleted, {
			status: STATUS_CODES.DELETED,
		});

		return deleted;
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

	async updateDeliveryDetails(
		orderId: string,
		deliveryDetails: IOrderDelivery,
		token: string,
	): Promise<IOrderFromResponse> {
		const response = await this.ordersApi.updateDeliveryDetails(orderId, deliveryDetails, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Order;
	}

	async updateOrderStatus(orderId: string, status: OrderStatus, token: string): Promise<IOrderFromResponse> {
		const response = await this.ordersApi.updateOrderStatus(orderId, status, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Order;
	}

	async markOrdersAsReceived(orderId: string, products: string[], token: string): Promise<IOrderFromResponse> {
		const response = await this.ordersApi.markOrdersAsReceived(orderId, products, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Order;
	}

	async assignManagerToOrder(orderId: string, managerId: string, token: string): Promise<IOrderFromResponse> {
		const response = await this.ordersApi.assignManagerToOrder(orderId, managerId, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: orderResponseSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Order;
	}
}
