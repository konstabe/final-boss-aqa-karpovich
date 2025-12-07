import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
	test(
		"Delete Product",
		{
			tag: [TAGS.PRODUCTS],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			const token = await loginApiService.loginAsAdmin();
			const createdProduct = await productsApiService.create(token);
			const id = createdProduct._id;

			const response = await productsApi.delete(id, token);

			expect(response.status).toBe(STATUS_CODES.DELETED);
		},
	);

	test(
		"Delete a deleted Product",
		{
			tag: [TAGS.PRODUCTS],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			const token = await loginApiService.loginAsAdmin();

			const createdProduct = await productsApiService.create(token);
			const id = createdProduct._id;

			const responsefirst = await productsApi.delete(id, token);
			expect(responsefirst.status).toBe(STATUS_CODES.DELETED);

			const response = await productsApi.delete(id, token);
			expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
		},
	);

	test(
		"Delete a not existing Product",
		{
			tag: [TAGS.PRODUCTS],
		},
		async ({ loginApiService, productsApi }) => {
			const token = await loginApiService.loginAsAdmin();

			const id = "15hkjh546465";

			const responsefirst = await productsApi.delete(id, token);
			expect(responsefirst.status).toBe(STATUS_CODES.NOT_FOUND);
		},
	);
});
