import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { test, expect } from "tests/api/customers/common/fixtures";

test.describe("Delete customer", () => {
	test(`success`, { tag: TAGS.CUSTOMERS }, async ({ prepareAndDeleteCustomer }) => {
		const { deletedCustomerResponse } = await prepareAndDeleteCustomer();

		expect(deletedCustomerResponse.status).toBe(STATUS_CODES.DELETED);
		expect(deletedCustomerResponse.body).toBeNull();
	});

	test(`fail: invalid token`, { tag: TAGS.CUSTOMERS }, async ({ prepareAndDeleteCustomer }) => {
		const { deletedCustomerResponse } = await prepareAndDeleteCustomer({ token: `invalid_token` });
		expect(deletedCustomerResponse.status).toBe(STATUS_CODES.UNAUTHORIZED);
	});

	test(`fail: invalid id`, { tag: TAGS.CUSTOMERS }, async ({ prepareAndDeleteCustomer }) => {
		const { deletedCustomerResponse } = await prepareAndDeleteCustomer({ id: `invalid_id` });
		expect(deletedCustomerResponse.status).toBe(STATUS_CODES.NOT_FOUND);
	});

	test(
		`fail: customer already deleted`,
		{ tag: TAGS.CUSTOMERS },
		async ({ prepareAndDeleteCustomer, customersApiService, token }) => {
			const { customerId } = await prepareAndDeleteCustomer();
			const response = await customersApiService.delete(customerId, token);

			expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
		},
	);
});
