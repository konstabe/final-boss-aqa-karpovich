import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { IOrder } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders]", () => {
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

	test.describe("[Update Positive]", () => {
		test(
			"Update a draft order with existing customer and existing products",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const order = await ordersApiService.createDraft(token, 5);
				ordersApiService.collectIdsForDeletion(order, ordersIds, customersIds, productsIds);

				const newOrder = await ordersApiService.createOrderData(token, 3);
				customersIds.push(newOrder.customer);
				productsIds.push(...newOrder.products);

				const updatedOrder = await ordersApi.update(order._id, newOrder, token);
				validateResponse(updatedOrder, {
					status: STATUS_CODES.OK,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(updatedOrder.body.Order.customer).toEqual(newOrder.customerData);

				const { products, status, _id: orderId } = updatedOrder.body.Order;
				const actualProducts = products.map((product) => _.omit(product, ["received", "createdOn"]));
				const expectedProducts = newOrder.productsData.map((product) => _.omit(product, ["createdOn"]));

				expect(actualProducts).toEqual(expectedProducts);
				expect(status).toBe(ORDER_STATUS.DRAFT);
				expect(orderId).toBe(updatedOrder.body.Order._id);
			},
		);
	});

	test.describe("[Update Negative]", () => {
		test(
			"Update an order without authorization token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const order = await ordersApiService.createDraft(token, 2);
				ordersApiService.collectIdsForDeletion(order, ordersIds, customersIds, productsIds);

				const newOrder = await ordersApiService.createOrderData(token, 5);
				customersIds.push(newOrder.customer);
				productsIds.push(...newOrder.products);

				const updatedOrder = await ordersApi.update(order._id, newOrder, "");
				validateResponse(updatedOrder, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);

		test(
			"Update an order with invalid token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const order = await ordersApiService.createDraft(token, 3);
				ordersApiService.collectIdsForDeletion(order, ordersIds, customersIds, productsIds);

				const newOrder = await ordersApiService.createOrderData(token, 2);
				customersIds.push(newOrder.customer);
				productsIds.push(...newOrder.products);

				const updatedOrder = await ordersApi.update(order._id, newOrder, token + "1");
				validateResponse(updatedOrder, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_TOKEN,
				});
			},
		);

		test(
			"Update an order with empty request body",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ ordersApiService, ordersApi }) => {
				const order = await ordersApiService.createDraft(token, 3);
				ordersApiService.collectIdsForDeletion(order, ordersIds, customersIds, productsIds);

				const updatedOrder = await ordersApi.update(order._id, {} as unknown as IOrder, token);
				validateResponse(updatedOrder, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
				});
			},
		);

		test(
			"Update an order in process",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ ordersApi, ordersApiService }) => {
				const orderInProcess = await ordersApiService.processOrder(token, 5);
				ordersApiService.collectIdsForDeletion(orderInProcess, ordersIds, customersIds, productsIds);

				const newOrder = await ordersApiService.createOrderData(token, 3);
				customersIds.push(newOrder.customer);
				productsIds.push(...newOrder.products);

				const updatedOrder = await ordersApi.update(orderInProcess._id, newOrder, token);
				validateResponse(updatedOrder, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_ORDER_STATUS,
				});
			},
		);
	});
});
