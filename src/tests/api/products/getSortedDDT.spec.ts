import { test, expect } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { searchForProduct, sortedForProductAsc } from "api/api/sortedProductsDDT.api";
import { sortFunctionsForProducts } from "utils/sortFunctionsForProducts.utils";

test.describe("[Sorting Product] [Search Product]", () => {
	test.describe("Search", () => {
		let id = "";
		let token = "";

		test.beforeEach(async ({ loginApiService }) => {
			token = await loginApiService.loginAsAdmin();
		});
		test.afterEach(async ({ productsApiService }) => {
			if (id) await productsApiService.delete(token, id);
			id = "";
		});

		for (const { title, sortField, errorMessage, statusCode } of searchForProduct) {
			test(
				title,
				{
					tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
				},
				async ({ productsApiService, productsApi }) => {
					const product = await productsApiService.create(token);
					id = product._id;

					const searchValue = product[sortField];

					const response = await productsApi.getSorted(token, { search: searchValue.toString() });

					validateResponse(response, {
						status: statusCode,
						IsSuccess: true,
						ErrorMessage: errorMessage,
					});
					const { limit, search, manufacturer, total, page, sorting } = response.body;
					const found = response.body.Products.find((el) => el._id === product._id);
					expect.soft(found, `Created product should be in response`).toBeTruthy();
					expect.soft(limit, `Limit should be ${limit}`).toBe(10);
					expect.soft(search).toBe(searchValue.toString());
					expect.soft(manufacturer).toEqual([]);
					expect.soft(page).toBe(1);
					expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
					expect.soft(total).toBeGreaterThanOrEqual(1);
				},
			);
		}
	});

	test.describe("Sorting", () => {
		const ids: string[] = [];
		let token = "";

		test.beforeEach(async ({ loginApiService }) => {
			token = await loginApiService.loginAsAdmin();
		});
		test.afterEach(async ({ productsApiService }) => {
			if (ids.length) {
				for (const id of ids) {
					await productsApiService.delete(token, id);
				}
				ids.length = 0;
			}
		});

		for (const { title, sortField, sortOrder, errorMessage, statusCode } of sortedForProductAsc) {
			test(
				title,
				{
					tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
				},
				async ({ productsApiService, productsApi, page }) => {
					for (let i = 1; i <= 10; i++) {
						const products = await productsApiService.create(token);
						ids.push(products._id);
						await page.waitForTimeout(1000);
					}

					const sortValue = sortField;
					const sortOrderValue = sortOrder;

					const response = await productsApi.getSorted(token, {
						sortField: sortValue,
						sortOrder: sortOrderValue,
					});
					const allProducts = await productsApi.getAll(token);

					validateResponse(response, {
						status: statusCode,
						IsSuccess: true,
						ErrorMessage: errorMessage,
					});

					const actualProducts = response.body.Products;

					const sorted = allProducts.body.Products.slice()
						.sort((a, b) => sortFunctionsForProducts[sortField](a, b, sortOrder))
						.slice(0, 10);

					actualProducts.forEach((actual, index) => {
						expect.soft(actual).toEqual(sorted[index]);
					});

					const { limit, search, manufacturer, total, page: pageParam, sorting } = response.body;
					expect.soft(limit, `Limit should be ${limit}`).toBe(10);
					expect.soft(search).toBe("");
					expect.soft(manufacturer).toEqual([]);
					expect.soft(pageParam).toBe(1);
					expect.soft(sorting).toEqual({ sortField: sortValue, sortOrder: sortOrderValue });
					expect.soft(total).toBeGreaterThanOrEqual(2);
				},
			);
		}
	});
});
