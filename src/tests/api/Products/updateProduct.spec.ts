import { test } from "fixtures/api.fixture";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/product/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { ERROR_MESSAGES } from "data/notifications";
import { errorSchema } from "data/schemas/core.schema";
import { IProduct } from "data/types/product.types";
import { negativeCasesProductCreate } from "data/products/createProductNegative.data";
import { positiveCasesProductCreate } from "data/products/createProductPositive.data";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
	let id = "";
	let token = "";

	test.afterEach(async ({ productsApiService }) => {
		await productsApiService.delete(token, id);
	});

	test(
		"Update product without token",
		{
			tag: [TAGS.API, TAGS.NEGATIVE],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdProduct = await productsApiService.create(token);
			id = createdProduct._id;

			const updatedProductData = generateProductData();
			const updatedProductResponse = await productsApi.update(id, updatedProductData, "");
			console.log("updatedProductResponse", updatedProductResponse);

			validateResponse(updatedProductResponse, {
				status: STATUS_CODES.UNAUTHORIZED,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
			});
		},
	);

	test(
		"Update product with existed name",
		{ tag: [TAGS.API, TAGS.NEGATIVE] },
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdProduct = await productsApiService.create(token);
			const secondProduct = await productsApiService.create(token);
			id = createdProduct._id;
			const id2 = secondProduct._id;

			const updatedProductData = generateProductData({ name: secondProduct.name });

			const updatedProductResponse = await productsApi.update(id, updatedProductData, token);

			validateResponse(updatedProductResponse, {
				status: STATUS_CODES.CONFLICT,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: `Product with name '${secondProduct.name}' already exists`,
			});
			productsApiService.delete(token, id2);
		},
	);

	for (let i = 0; i < negativeCasesProductCreate.length; i++) {
		const { description, testData } = negativeCasesProductCreate[i]!;

		test(
			`Update product with invalid data: ${description}`,
			{ tag: [TAGS.API, TAGS.NEGATIVE] },
			async ({ loginApiService, productsApiService, productsApi }) => {
				token = await loginApiService.loginAsAdmin();
				const createdProduct = await productsApiService.create(token);
				id = createdProduct._id;

				const productData = { ...generateProductData(), ...testData };

				const response = await productsApi.update(id, productData as unknown as IProduct, token);

				validateResponse(response, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: "Incorrect request body",
				});
			},
		);
	}

	for (let i = 0; i < positiveCasesProductCreate.length; i++) {
		const { description, testData } = positiveCasesProductCreate[i]!;

		test(
			`Update product with valid data: ${description}`,
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ loginApiService, productsApiService, productsApi }) => {
				token = await loginApiService.loginAsAdmin();
				const createdProduct = await productsApiService.create(token);
				id = createdProduct._id;

				const productData = { ...generateProductData(), ...testData };

				const response = await productsApi.update(id, productData as unknown as IProduct, token);

				validateResponse(response, {
					status: STATUS_CODES.OK,
					schema: createProductSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});
			},
		);
	}
});
