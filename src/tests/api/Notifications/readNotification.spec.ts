import { expect, test } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { getnotificationsSchema } from "data/schemas/notifications/getNotificationSchema";
import { errorSchema } from "data/schemas/core.schema";
import { ERROR_MESSAGES } from "data/notifications";

test.describe("[API][Notifications]", () => {
	let token = "";
	const managerId = "692337cd1c508c5d5e953339";
	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test("Get all notification", { tag: [TAGS.SMOKE] }, async ({ loginApiService, notificationsApi }) => {
		token = await loginApiService.loginAsAdmin();

		const allNotifications = await notificationsApi.getNotifications(token);
		validateResponse(allNotifications, {
			status: STATUS_CODES.OK,
			schema: getnotificationsSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Get notification w/o token", { tag: [TAGS.SMOKE] }, async ({ loginApiService, notificationsApi }) => {
		await loginApiService.loginAsAdmin();
		const allNotifications = await notificationsApi.getNotifications("");
		validateResponse(allNotifications, {
			status: STATUS_CODES.UNAUTHORIZED,
			schema: errorSchema,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	test(
		"Patch notifications/mark-all-read",
		{ tag: [TAGS.SMOKE] },
		async ({ loginApiService, notificationsApi, ordersApiService, ordersApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdOrder = await ordersApiService.createDraft(token, 1);

			await ordersApi.assignManagerToOrder(createdOrder._id, managerId, token);
			const reaDNotifications = await notificationsApi.markAllNotificationsAsReaded(token);

			validateResponse(reaDNotifications, {
				status: STATUS_CODES.OK,
				schema: getnotificationsSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});
			expect(reaDNotifications.body.Notifications.every((n) => n.read)).toBe(true);
		},
	);

	test(
		"Patch {notificationId}/read",
		{ tag: [TAGS.SMOKE] },
		async ({ loginApiService, notificationsApi, ordersApiService, ordersApi }) => {
			token = await loginApiService.loginAsAdmin();
			const createdOrder = await ordersApiService.createDraft(token, 1);
			await ordersApi.assignManagerToOrder(createdOrder._id, managerId, token);
			const unReadNotificationIDs = await notificationsApi.getNotifications(token);
			const unReadNotificationID = unReadNotificationIDs.body.Notifications.find((n) => !n.read)?._id;
			const readNotification = await notificationsApi.markNotificationAsReaded(token, unReadNotificationID!);

			validateResponse(readNotification, {
				status: STATUS_CODES.OK,
				schema: getnotificationsSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const notification = readNotification.body.Notifications.find((n) => n._id === unReadNotificationID);

			expect(notification!.read).toBe(true);
		},
	);
});
