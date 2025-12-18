import { ERROR_MESSAGES } from "data/notifications";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { errorSchema } from "data/schemas/core.schema";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Orders]", () => {
	let token = "";
	const ordersIds: string[] = [];
	const customersIds: string[] = [];
	const productsIds: string[] = [];

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, ordersIds, customersIds, productsIds);
	});

	test.describe("[Create Positive]", () => {
		test(
			"Create a draft order with existing customer and existing products",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const newOrderData = await ordersApiService.createOrderData(token, 1);
				const newOrder = await ordersApi.create(newOrderData, token);

				validateResponse(newOrder, {
					status: STATUS_CODES.CREATED,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(newOrder.body.Order.customer).toEqual(newOrderData.customerData);
				const actualIds = newOrder.body.Order.products.map((p) => p._id);
				expect(actualIds).toEqual(newOrderData.products);

				expect(newOrder.body.Order.status).toBe(ORDER_STATUS.DRAFT);
				expect(newOrder.body.Order._id).toBeTruthy();
			},
		);
		test(
			"Create a draft order with existing customer and existing 3 products",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const newOrderData = await ordersApiService.createOrderData(token, 3);
				const newOrder = await ordersApi.create(newOrderData, token);

				validateResponse(newOrder, {
					status: STATUS_CODES.CREATED,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(newOrder.body.Order.customer).toEqual(newOrderData.customerData);
				const actualIds = newOrder.body.Order.products.map((p) => p._id);
				expect(actualIds).toEqual(newOrderData.products);

				expect(newOrder.body.Order.status).toBe(ORDER_STATUS.DRAFT);
				expect(newOrder.body.Order._id).toBeTruthy();
			},
		);
	});

	test.describe("[Create Negative]", () => {
		test(
			"Create a draft order without existing customer",
			{ tag: [TAGS.API, TAGS.NEGATIVE, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const newOrderData = await ordersApiService.createOrderData(token, 1);
				newOrderData.customer = "64b64c4f4f4f4f4f4f4f4f4f"; //fake client id
				const newOrder = await ordersApi.create(newOrderData, token);

				validateResponse(newOrder, {
					status: STATUS_CODES.NOT_FOUND,
					schema: errorSchema,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND(newOrderData.customer),
				});
			},
		);
		test(
			"Create a draft order without existing products",
			{ tag: [TAGS.API, TAGS.NEGATIVE, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const newOrderData = await ordersApiService.createOrderData(token, 1);
				console.log(newOrderData.products);
				newOrderData.products = ["693da524fsd08c5d5ec4dd7d"]; //fake client id
				console.log(newOrderData.products);
				const newOrder = await ordersApi.create(newOrderData, token);

				validateResponse(newOrder, {
					status: STATUS_CODES.SERVER_ERROR,
					schema: errorSchema,
					IsSuccess: false,
				});
			},
		);
	});
});
