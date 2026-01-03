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
	let ids: string[] = [];
	let token = "";

	test.afterEach(async ({ productsApiService }) => {
		if (ids.length) {
			for (const id of ids) {
				await productsApiService.delete(token, id);
			}
			ids = [];
		}
	});

	test(
		"Update product without token",
		{
			tag: [TAGS.API, TAGS.NEGATIVE],
		},
		async ({ loginApiService, productsApiService, productsApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdProduct = await productsApiService.create(token);
			ids.push(createdProduct._id);

			const updatedProductData = generateProductData();
			const updatedProductResponse = await productsApi.update(createdProduct._id, updatedProductData, "");
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
			ids.push(createdProduct._id, secondProduct._id);

			const updatedProductData = generateProductData({ name: secondProduct.name });

			const updatedProductResponse = await productsApi.update(createdProduct._id, updatedProductData, token);

			validateResponse(updatedProductResponse, {
				status: STATUS_CODES.CONFLICT,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: `Product with name '${secondProduct.name}' already exists`,
			});
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
				ids.push(createdProduct._id);

				const productData = { ...generateProductData(), ...testData };

				const response = await productsApi.update(
					createdProduct._id,
					productData as unknown as IProduct,
					token,
				);

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
				ids.push(createdProduct._id);

				const productData = { ...generateProductData(), ...testData };

				const response = await productsApi.update(
					createdProduct._id,
					productData as unknown as IProduct,
					token,
				);

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
