import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils.js";
import { STATUS_CODES } from "data/statusCodes.js";
import { IOrder } from "data/types/order.types.js";

test.describe("Create order", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test("create order successfully", { tag: TAGS.API }, async ({ ordersApiService }) => {
		const order = await ordersApiService.createDraft(token, 1);
		expect(order).toBeDefined();
	});

	test("create order with multiple products", { tag: TAGS.API }, async ({ ordersApiService }) => {
		const order = await ordersApiService.createDraft(token, 3);
		expect(order.products.length).toBe(3);
	});

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
		const invalidBody = {} as unknown as IOrder;
		const response = await ordersApi.create(invalidBody, token);

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
