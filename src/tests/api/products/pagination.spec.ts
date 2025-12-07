import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products] Pagination", () => {
	test.describe("pagination", () => {
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

		test(
			"Pagination",
			{
				tag: [TAGS.PRODUCTS],
			},
			async ({ productsApiService, productsApi, page }) => {
				for (let i = 1; i <= 12; i++) {
					const products = await productsApiService.create(token);
					ids.push(products._id);
					await page.waitForTimeout(1000);
					console.log(products);
				}

				const responsePage1 = await productsApi.getSorted(token, {
					sortField: "createdOn",
					sortOrder: "desc",
					page: 1,
					limit: 10,
				});
				validateResponse(responsePage1, {
					status: STATUS_CODES.OK,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const idsFromPage1 = responsePage1.body.Products.map((product) => product._id);

				const responsePage2 = await productsApi.getSorted(token, {
					sortField: "createdOn",
					sortOrder: "desc",
					page: 2,
					limit: 10,
				});
				validateResponse(responsePage2, {
					status: STATUS_CODES.OK,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const idsFromPage2 = responsePage2.body.Products.map((product) => product._id);

				const { limit, search, total, page: pageParam, sorting } = responsePage2.body;
				expect.soft(limit, `Limit should be ${limit}`).toBe(10);
				expect.soft(search).toBe("");
				expect.soft(pageParam).toBe(2);
				expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
				expect.soft(total).toBeGreaterThanOrEqual(12);

				expect(idsFromPage2).not.toContainEqual(idsFromPage1);
			},
		);

		test(
			"Pagination for not existed page",
			{
				tag: [TAGS.PRODUCTS],
			},
			async ({ productsApiService, productsApi, page }) => {
				for (let i = 1; i <= 3; i++) {
					const products = await productsApiService.create(token);
					ids.push(products._id);
					await page.waitForTimeout(1000);
					console.log(products);
				}

				const responsePage150 = await productsApi.getSorted(token, {
					sortField: "createdOn",
					sortOrder: "desc",
					page: 150,
				});
				validateResponse(responsePage150, {
					status: STATUS_CODES.OK,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const { Products, limit, search, total, page: pageParam, sorting } = responsePage150.body;
				expect.soft(Products.length, "Products array should be empty").toBe(0);
				expect.soft(limit, `Limit should be ${limit}`).toBe(10);
				expect.soft(search).toBe("");
				expect.soft(pageParam).toBe(150);
				expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
				expect.soft(total).toBeGreaterThanOrEqual(3);
			},
		);
	});
});
