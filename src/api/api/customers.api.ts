import { IApiClient, IRequestOptions } from "api/core/types";
import { apiConfig } from "config/apiConfig";
import {
	ICustomer,
	ICustomerResponse,
	ICustomersResponse,
	ICustomersSortedResponse,
	IGetCustomersParams,
} from "data/types/customer.types";
import { ICustomerOrdersResponse } from "data/types/order.types";
import { convertRequestParams } from "utils/queryParams.utils";

export class CustomersApi {
	constructor(private apiClient: IApiClient) {}

	async create(customer: ICustomer, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customers,
			method: "post",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: customer,
		};

		return await this.apiClient.send<ICustomerResponse>(options);
	}

	async getWithFilters(token: string, params?: Partial<IGetCustomersParams>) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customers + (params ? convertRequestParams(params) : ""),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<ICustomersSortedResponse>(options);
	}

	async getAll(token: string, params?: Partial<IGetCustomersParams>) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customers + (params ? convertRequestParams(params) : ""),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<ICustomersResponse>(options);
	}

	async getById(id: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customerById(id),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<ICustomerResponse>(options);
	}

	async getOrdersForCustomer(id: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customerOrders(id),
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<ICustomerOrdersResponse>(options);
	}

	async update(_id: string, newCustomer: ICustomer, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customerById(_id),
			method: "put",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			data: newCustomer,
		};

		return await this.apiClient.send<ICustomerResponse>(options);
	}

	async delete(id: string, token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.customerById(id),
			method: "delete",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<null>(options);
	}
}
