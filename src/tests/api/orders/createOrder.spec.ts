import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { Flow } from "flows/flows.js";
import { validateResponse } from "utils/validation/validateResponse.utils.js";
import { STATUS_CODES } from "data/statusCodes.js";

test.describe("Create order", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test(
		"create order successfully",
		{ tag: TAGS.API },
		async ({ customersApiService, productsApiService, ordersApiService }) => {
			const ordersFlow = new Flow(customersApiService, productsApiService, ordersApiService);

			const { order } = await ordersFlow.createOrder(token);
			expect(order).toBeDefined();
		},
	);

	test(
		"create order with multiple products",
		{ tag: TAGS.API },
		async ({ customersApiService, productsApiService, ordersApiService }) => {
			const ordersFlow = new Flow(customersApiService, productsApiService, ordersApiService);

			const { order } = await ordersFlow.createOrder(token, 3);

			expect(order.products.length).toBe(3);
		},
	);

	test("create order without token", { tag: TAGS.API }, async ({ ordersApi }) => {
		const response = await ordersApi.create(
			{
				customer: "fakeCustomerId",
				products: ["fakeProductId"],
			},
			"",
		);

		validateResponse(response, {
			status: STATUS_CODES.UNAUTHORIZED,
		});
	});

	test("create order with empty body", { tag: TAGS.API }, async ({ ordersApi }) => {
		const response = await ordersApi.create({}, token);

		validateResponse(response, {
			status: STATUS_CODES.BAD_REQUEST,
		});
	});

	test("create order with invalid customer id", { tag: TAGS.API }, async ({ ordersApi, productsApiService }) => {
		const product = await productsApiService.create(token);

		const response = await ordersApi.create(
			{
				customer: "invalid_customer_id",
				products: [product._id],
			},
			token,
		);

		validateResponse(response, {
			status: STATUS_CODES.SERVER_ERROR,
		});
	});

	test("create order with empty products list", { tag: TAGS.API }, async ({ customersApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);

		const response = await ordersApi.create(
			{
				customer: customer._id,
				products: [],
			},
			token,
		);

		validateResponse(response, {
			status: STATUS_CODES.BAD_REQUEST,
		});
	});
});
