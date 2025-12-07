import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/product/create.schema";
import { getAllProductSchema } from "data/schemas/product/getAll.shema";

test.describe("[API] [Sales Portal] [Products]", () => {
	let token = "";
	let id = "";

	test.afterEach(async ({ productsApiService }) => {
		if (id) await productsApiService.delete(token, id);
	});

	test(
		"Smoke for all products (without filter parameters)",
		{
			tag: [TAGS.PRODUCTS, TAGS.SMOKE],
		},
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

			//TODO: Получить все продукты
			const getProductResponse = await productsApi.getAll(token);
			validateResponse(getProductResponse, {
				status: STATUS_CODES.OK,
				schema: getAllProductSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			//проверить, что в массиве тела респонса есть созданный продукт
			const allproduct = JSON.stringify(getProductResponse.body.Products);
			const product = JSON.parse(allproduct).find((product: { _id: string }) => product._id === id);
			expect(product).toMatchObject({ ...productData });
		},
	);
});
