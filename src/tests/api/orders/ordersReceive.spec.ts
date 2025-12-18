import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { ERROR_MESSAGES } from "data/notifications";
import { errorSchema } from "data/schemas/core.schema";
import { errorOrderSchema } from "data/schemas/orders/orderError.schema";
import { ORDER_STATUS } from "data/orders/orderStatus";

test.describe("[API] [Sales Portal] [Products]", () => {
	let id = "";
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});
	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});
	test(
		"Receive Product from order",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;
			const productIDs = [...orderInProcess.products];
			const ids = productIDs.map((p) => p._id);
			const receivedOrder = await ordersApi.markOrdersAsReceived(id, ids, token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.OK,
				schema: orderResponseSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			expect(receivedOrder.body.Order.status).toBe(ORDER_STATUS.RECEIVED);
		},
	);
	test(
		"Receive few Products from order",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 3);
			id = orderInProcess._id;

			const productIDs = [...orderInProcess.products];
			const ids = productIDs.map((p) => p._id);

			const receivedOrder = await ordersApi.markOrdersAsReceived(id, ids, token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.OK,
				schema: orderResponseSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			expect(receivedOrder.body.Order.status).toBe(ORDER_STATUS.RECEIVED);
		},
	);
	test(
		"Receive Products from order without token",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.NEGATIVE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;

			const productIDs = [...orderInProcess.products];
			const ids = productIDs.map((p) => p._id);

			const receivedOrder = await ordersApi.markOrdersAsReceived(id, ids, "");

			validateResponse(receivedOrder, {
				status: STATUS_CODES.UNAUTHORIZED,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
			});
		},
	);
	test(
		"Receive Product with invalid order ID argument",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.NEGATIVE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;

			const productIDs = [...orderInProcess.products];
			const ids = productIDs.map((p) => p._id);

			const receivedOrder = await ordersApi.markOrdersAsReceived("1234435fsdfsdfsdfs", ids, token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.SERVER_ERROR,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.INVALID_ARGUMENT,
			});
		},
	);
	test(
		"Receive Product with unexisted order ID",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.NEGATIVE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;
			const invalid_id = "222265661c508c5d5ec11111";

			const productIDs = [...orderInProcess.products];
			const ids = productIDs.map((p) => p._id);

			const receivedOrder = await ordersApi.markOrdersAsReceived(invalid_id, ids, token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.NOT_FOUND,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.ORDERID_NOT_FOUND, // undefined. Kostyl from backend
			});
		},
	);
	test(
		"Receive Product with no product ID",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.NEGATIVE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;

			const receivedOrder = await ordersApi.markOrdersAsReceived(id, "", token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.BAD_REQUEST,
				schema: errorOrderSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.INCORRECT_REQUEST_BODY,
			});
		},
	);
	test(
		"Receive Product with invalid product ID",
		{ tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.NEGATIVE] },
		async ({ ordersApiService, ordersApi }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 1);
			id = orderInProcess._id;

			const receivedOrder = await ordersApi.markOrdersAsReceived(id, "1", token);

			validateResponse(receivedOrder, {
				status: STATUS_CODES.BAD_REQUEST,
				schema: errorOrderSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.INCORRECT_REQUEST_BODY,
			});
		},
	);
});
