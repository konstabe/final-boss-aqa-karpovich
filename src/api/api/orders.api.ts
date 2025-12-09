import { IApiClient, IRequestOptions } from "api/core/types";
import { apiConfig } from "config/apiConfig";
import { IOrderResponse, IOrder } from "data/types/order.types";

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
}
