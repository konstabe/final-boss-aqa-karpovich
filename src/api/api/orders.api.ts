import { IApiClient, IRequestOptions } from "api/core/types";
import { apiConfig } from "config/apiConfig";
import {
	IOrderResponse,
	IOrder,
	IOrderDelivery,
	OrderStatus,
	ICustomerOrdersResponse,
	IGetOrdersQuery,
} from "data/types/order.types";
import { convertRequestParams } from "utils/queryParams.utils";

export class OrdersApi {
	constructor(private apiClient: IApiClient) {}

	async create(order: IOrder, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.orders,
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: order,
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async getById(id: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.orderById(id),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async get(token: string, params?: IGetOrdersQuery) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.orders + (params ? convertRequestParams(params) : ""),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<ICustomerOrdersResponse>(options);
	}

	async update(id: string, newOrder: IOrder, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.orderById(id),
			method: "put",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: newOrder,
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async delete(id: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.orderById(id),
			method: "delete",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<null>(options);
	}

	async assignManagerToOrder(orderId: string, managerId: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.assignManagerToOrder(orderId, managerId),
			method: "put",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async unAssignManagerToOrder(orderId: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.unAssignManagerToOrder(orderId),
			method: "put",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async addCommentToOrder(orderId: string, newComment: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.addCommentToOrder(orderId),
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: { comment: newComment },
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async deleteCommentFromOrder(orderId: string, commentId: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.deleteCommentFromOrder(orderId, commentId),
			method: "delete",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<null>(options);
	}

	async updateDeliveryDetails(orderId: string, deliveryDetails: IOrderDelivery, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.updateDelivery(orderId),
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: deliveryDetails,
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async markOrdersAsReceived(orderId: string, products: string[], token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.markOrdersAsReceived(orderId),
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: {
				products: products,
			},
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}

	async updateOrderStatus(orderId: string, status: OrderStatus, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.updateStatus(orderId),
			method: "put",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: {
				status: status,
			},
		};

		return await this.apiClient.send<IOrderResponse>(options);
	}
}
