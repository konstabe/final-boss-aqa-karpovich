import { test } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { getnotificationsSchema } from "data/schemas/notifications/getNotificationSchema";
import { errorSchema } from "data/schemas/core.schema";
import { ERROR_MESSAGES } from "data/notifications";

test.describe("[API][Notifications]", () => {
	let token = "";

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
});
