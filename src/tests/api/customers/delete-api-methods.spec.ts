import { ERROR_MESSAGES } from "data/notifications";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("Delete customer", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.describe("positive", () => {
		test("success", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const createdCustomer = await customersApiService.create(token);
			const customerId = createdCustomer._id;

			const response = await customersApiService.delete(customerId, token);

			expect(response.status).toBe(STATUS_CODES.DELETED);
		});

		test("customer already deleted", { tag: TAGS.CUSTOMERS }, async ({ customersApiService, customersApi }) => {
			const createdCustomer = await customersApiService.create(token);
			const customerId = createdCustomer._id;
			await customersApiService.delete(customerId, token);

			const response = await customersApi.delete(customerId, token);
			validateResponse(response, {
				status: STATUS_CODES.NOT_FOUND,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND(customerId),
			});
		});
	});

	test.describe("negative", () => {
		test("invalid token", { tag: TAGS.CUSTOMERS }, async ({ customersApi }) => {
			const response = await customersApi.delete("693f15631d508c5e5ebdf616", "");
			expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
		});

		test("invalid id", { tag: TAGS.CUSTOMERS }, async ({ customersApi }) => {
			const response = await customersApi.delete("693f15631d508c5e5ebdf616", token);
			validateResponse(response, {
				status: STATUS_CODES.NOT_FOUND,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND("693f15631d508c5e5ebdf616"),
			});
		});
	});
});
