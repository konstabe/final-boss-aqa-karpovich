import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/product.types";
import { TAGS } from "data/tags";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/product/create.schema";

test.describe("[API] [Sales Portal] [Products]", () => {
	let id = "";
	let token = "";

	test.afterEach(async ({ productsApiService }) => {
		if (id) await productsApiService.delete(token, id);
	});

	test(
		"Create Product",
		{ tag: [TAGS.PRODUCTS, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ loginApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
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
		},
	);

	test(
		"NOT create product with invalid data",
		{
			tag: [TAGS.PRODUCTS, TAGS.REGRESSION],
		},
		async ({ loginApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const productData = generateProductData();
			const createdProduct = await productsApi.create(
				{ ...productData, name: 123 } as unknown as IProduct,
				token,
			);
			validateResponse(createdProduct, {
				status: STATUS_CODES.BAD_REQUEST,
				IsSuccess: false,
				ErrorMessage: "Incorrect request body",
			});
		},
	);
});
