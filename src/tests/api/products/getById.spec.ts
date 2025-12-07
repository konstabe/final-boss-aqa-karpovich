import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { getProductSchema } from "data/schemas/product/get.schema";

test.describe("[API] [Sales Portal] [Products]", () => {
	let id = "";
	let token = "";

	test.afterEach(async ({ productsApiService }) => {
		await productsApiService.delete(token, id);
	});

	test(
		"Get Product By Id",
		{
			tag: [TAGS.PRODUCTS],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const product = await productsApiService.create(token);
			id = product._id;

			const getProductResponse = await productsApi.getById(id, token);
			validateResponse(getProductResponse, {
				status: STATUS_CODES.OK,
				schema: getProductSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			expect(getProductResponse.body.Product).toEqual(product);
		},
	);
});
