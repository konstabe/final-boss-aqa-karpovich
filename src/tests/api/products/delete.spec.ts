import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
	let token = "";
	let productId = "";

	test.afterEach(async ({ productsApi }) => {
		if (!token || !productId) return;

		const response = await productsApi.delete(productId, token);
		if (![STATUS_CODES.DELETED, STATUS_CODES.NOT_FOUND].includes(response.status)) {
			throw new Error(`Cleanup failed for product ${productId}: ${response.status}`);
		}
		productId = "";
	});

	test(
		"Delete Product",
		{
			tag: [TAGS.PRODUCTS, TAGS.SMOKE],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdProduct = await productsApiService.create(token);
			productId = createdProduct._id;

			const response = await productsApi.delete(productId, token);

			expect(response.status).toBe(STATUS_CODES.DELETED);
		},
	);

	test(
		"Delete a deleted Product",
		{
			tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();

			const createdProduct = await productsApiService.create(token);
			productId = createdProduct._id;

			const responsefirst = await productsApi.delete(productId, token);
			expect(responsefirst.status).toBe(STATUS_CODES.DELETED);

			const response = await productsApi.delete(productId, token);
			expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
		},
	);

	test(
		"Delete Product without TOKEN",
		{
			tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();

			const createdProduct = await productsApiService.create(token);
			productId = createdProduct._id;

			const responsefirst = await productsApi.delete(productId, "");
			expect(responsefirst.status).toBe(STATUS_CODES.UNAUTHORIZED);
		},
	);
});
