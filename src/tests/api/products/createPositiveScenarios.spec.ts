import { test, expect } from "fixtures/api.fixture";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { createProductSchema } from "data/schemas/product/create.schema";
import { validTestDataForProduct } from "api/api/creatProductsDDT.api";

test.describe("[API] [Sales Portal] [Products]", () => {
	let id = "";
	let token = "";

	test.beforeEach(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ productsApiService }) => {
		if (id) await productsApiService.delete(token, id);
	});

	for (const { title, productData, successMessage, statusCode } of validTestDataForProduct) {
		test(
			`${title}`,
			{
				tag: [TAGS.PRODUCTS, TAGS.SMOKE],
			},
			async ({ productsApi }) => {
				const createdProduct = await productsApi.create(productData, token);
				validateResponse(createdProduct, {
					status: statusCode,
					schema: createProductSchema,
					IsSuccess: true,
					ErrorMessage: successMessage,
				});

				id = createdProduct.body.Product._id;

				const actualProductData = createdProduct.body.Product;
				expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(productData);
			},
		);
	}
});
