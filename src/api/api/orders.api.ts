import { IApiClient, IRequestOptions } from "api/core/types";
import { apiConfig } from "config/apiConfig";
import { IOrderResponse } from "data/types/order.type";
import { logStep } from "utils/report/logStep.utils";

export class OrdersApi {
	constructor(private apiClient: IApiClient) {}

	@logStep("POST /api/orders")
	async create(customer: string, products: string[], token: string) {
		const productArray = Array.isArray(products) ? products : [products];
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl, //backend url
			url: apiConfig.endpoints.orders, //endpoint address
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: { customer, products: productArray },
		};
		return await this.apiClient.send<IOrderResponse>(options);
	}
}
