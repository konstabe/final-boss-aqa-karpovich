import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/customers/generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer, IGetCustomersParams } from "data/types/customer.types";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class CustomersApiService {
	constructor(private customersApi: CustomersApi) {}

	async create(token: string, customerData?: ICustomer) {
		const customer = generateCustomerData(customerData);
		const response = await this.customersApi.create(customer, token);
		validateResponse(response, {
			status: STATUS_CODES.CREATED,
			IsSuccess: true,
			ErrorMessage: null,
			schema: createCustomerSchema,
		});

		return response.body.Customer;
	}

	async delete(id: string, token: string) {
		const response = await this.customersApi.delete(id, token);
		validateResponse(response, {
			status: STATUS_CODES.DELETED,
		});

		return response;
	}

	async getAll(token: string, params?: Partial<IGetCustomersParams>) {
		const response = await this.customersApi.getAll(token, params);
		validateResponse(response, {
			status: STATUS_CODES.OK,
		});

		return response;
	}
}
