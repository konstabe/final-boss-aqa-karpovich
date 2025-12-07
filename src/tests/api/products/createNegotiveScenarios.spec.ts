import { invalidTestDataForProduct } from "api/api/creatProductsDDT.api";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/product/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Products Negative test]", () => {
	let token = "";
	let id = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ productsApiService }) => {
		if (id) await productsApiService.delete(token, id);
	});

	for (const { title, productData, successMessage, statusCode } of invalidTestDataForProduct) {
		test(
			title,
			{
				tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
			},
			async ({ productsApi }) => {
				const createdProduct = await productsApi.create(productData, token);
				validateResponse(createdProduct, {
					status: statusCode,
					IsSuccess: false,
					ErrorMessage: successMessage,
				});
			},
		);
	}

	test(
		"Create Product with same name",
		{
			tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
		},
		async ({ productsApi }) => {
			const productData = generateProductData();
			const createdProduct = await productsApi.create(productData, token);
			validateResponse(createdProduct, {
				status: STATUS_CODES.CREATED,
				schema: createProductSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			id = createdProduct.body.Product._id;

			const actualProductData = createdProduct.body.Product;
			expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(productData);

			const createdProductWithSameName = await productsApi.create(productData, token);
			validateResponse(createdProductWithSameName, {
				status: STATUS_CODES.CONFLICT,
				IsSuccess: false,
				ErrorMessage: `Product with name '${productData.name}' already exists`,
			});
		},
	);
});
