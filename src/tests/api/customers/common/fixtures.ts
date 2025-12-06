import { IResponse } from "api/core/types";
import { test as base, expect } from "fixtures/api.fixture";

type Fixtures = {
	token: string;
	prepareAndDeleteCustomer: (args?: {
		token?: string;
		id?: string;
	}) => Promise<{ customerId: string; deletedCustomerResponse: IResponse<null> }>;
};

const test = base.extend<Fixtures>({
	token: async ({ loginApiService }, use) => {
		const token = (await loginApiService.loginAsAdmin()) || "";
		use(token);
	},
	prepareAndDeleteCustomer: async ({ customersApiService, loginApiService }, use) => {
		const func = async (args?: { token?: string; id?: string }) => {
			let token = args?.token;
			let id = args?.id;

			if (!token) {
				token = await loginApiService.loginAsAdmin();
			}

			if (!id) {
				const customer = await customersApiService.create(token);
				id = customer._id;
			}

			const deletedCustomer = await customersApiService.delete(token, id);
			return { customerId: id, deletedCustomerResponse: deletedCustomer };
		};

		await use(func);
	},
});

export { test, expect };
