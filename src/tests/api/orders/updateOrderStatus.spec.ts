import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { orderResponseSchema } from "data/schemas/orders/orderResponse.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { OrderStatus } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders]", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[Update Order Status Positive]", () => {
		test(
			"Update status: Draft to In Process with scheduled delivery",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draftWithDelivery = await ordersApiService.createDraftWithDelivery(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(
					draftWithDelivery._id,
					ORDER_STATUS.IN_PROGRESS,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.OK,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(updatedStatus.body.Order.status).toBe(ORDER_STATUS.IN_PROGRESS);
				expect(updatedStatus.body.Order.history[0]?.status).toBe(ORDER_STATUS.IN_PROGRESS);
			},
		);

		test(
			"Update status: Draft to Canceled",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 4);

				const updatedStatus = await ordersApi.updateOrderStatus(draft._id, ORDER_STATUS.CANCELED, token);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.OK,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});
				expect(updatedStatus.body.Order.status).toBe(ORDER_STATUS.CANCELED);
				expect(updatedStatus.body.Order.history[0]?.status).toBe(ORDER_STATUS.CANCELED);
			},
		);

		test(
			"Update status: In Process to Canceled",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const orderInProcess = await ordersApiService.processOrder(token, 2);

				const updatedStatus = await ordersApi.updateOrderStatus(
					orderInProcess._id,
					ORDER_STATUS.CANCELED,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.OK,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(updatedStatus.body.Order.status).toBe(ORDER_STATUS.CANCELED);
				expect(updatedStatus.body.Order.history[0]?.status).toBe(ORDER_STATUS.CANCELED);
			},
		);

		test(
			"Update status: Canceled to Draft (reopen)",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const canceledOrderInProcess = await ordersApiService.cancelOrderInProgress(token, 1);

				const updatedStatus = await ordersApi.updateOrderStatus(
					canceledOrderInProcess._id,
					ORDER_STATUS.DRAFT,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.OK,
					schema: orderResponseSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				expect(updatedStatus.body.Order.status).toBe(ORDER_STATUS.DRAFT);
				expect(updatedStatus.body.Order.history[0]?.status).toBe(ORDER_STATUS.DRAFT);
				expect(updatedStatus.body.Order.delivery).toBe(null);
			},
		);
	});

	test.describe("[Update Order Status Negative]", () => {
		test(
			"Update status: Draft to In Process without scheduled delivery",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(draft._id, ORDER_STATUS.IN_PROGRESS, token);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CANT_PROCESS_ORDER_WITHOUT_DELIVERY,
				});
			},
		);

		test(
			"Update status: In Process to Partially Received",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const orderInProcess = await ordersApiService.processOrder(token, 2);

				const updatedStatus = await ordersApi.updateOrderStatus(
					orderInProcess._id,
					ORDER_STATUS.PARTIALLY_RECEIVED,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_ORDER_STATUS,
				});
			},
		);

		test(
			"Update status: In Process to Received",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const orderInProcess = await ordersApiService.processOrder(token, 2);

				const updatedStatus = await ordersApi.updateOrderStatus(
					orderInProcess._id,
					ORDER_STATUS.RECEIVED,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_ORDER_STATUS,
				});
			},
		);

		test(
			"Update status: Partially Received to Received",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const orderInProcess = await ordersApiService.processOrder(token, 5);
				const partiallyReceivedOrder = await ordersApiService.partiallyReceived(token, orderInProcess, 4);

				const updatedStatus = await ordersApi.updateOrderStatus(
					partiallyReceivedOrder._id,
					ORDER_STATUS.RECEIVED,
					token,
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_ORDER_STATUS,
				});
			},
		);

		test(
			"Update status: Draft to In Process with scheduled delivery without authorization token",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(draft._id, ORDER_STATUS.IN_PROGRESS, "");
				validateResponse(updatedStatus, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);

		test(
			"Update status: Draft to In Process with scheduled delivery with invalid token",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(
					draft._id,
					ORDER_STATUS.IN_PROGRESS,
					token + "5",
				);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_TOKEN,
				});
			},
		);

		test(
			"Update status: Draft to In Process with scheduled delivery with empty request body",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(draft._id, {} as unknown as OrderStatus, token);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
				});
			},
		);

		test(
			"Update status with same current status (Draft to Draft is not allowed)",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersApiService, ordersApi }) => {
				const draft = await ordersApiService.createDraft(token, 3);

				const updatedStatus = await ordersApi.updateOrderStatus(draft._id, ORDER_STATUS.DRAFT, token);
				validateResponse(updatedStatus, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CANT_REOPEN_NOT_CANCELLED,
				});
			},
		);
	});
});
