import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";

test.describe("Delete customer", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.describe("positive", () => {
		let customerId: string;

		test.beforeEach(async ({ customersApiService }) => {
			const customer = await customersApiService.create(token);
			customerId = customer._id;
		});

		test("success", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.delete(token, customerId);

			expect(response.status).toBe(STATUS_CODES.DELETED);
			expect(response.body).toBeNull();
		});

		test("customer already deleted", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			await customersApiService.delete(token, customerId);

			const response = await customersApiService.delete(token, customerId);
			expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
		});
	});

	test.describe("negative", () => {
		test("invalid token", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.delete("invalid_token", "whatever");
			expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
		});

		test("invalid id", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.delete(token, "invalid_id");
			expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
		});
	});
});
