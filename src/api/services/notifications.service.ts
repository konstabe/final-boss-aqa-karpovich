import { NotificationsApi } from "api/api/notifications.api";
import { getnotificationsSchema } from "data/schemas/notifications/getNotificationSchema";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class NotificationsService {
	constructor(private notificationsApi: NotificationsApi) {}

	async getNotifications(token: string) {
		const response = await this.notificationsApi.getNotifications(token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: getnotificationsSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Notifications;
	}

	async markAllNotificationsAsReaded(token: string) {
		const response = await this.notificationsApi.markAllNotificationsAsReaded(token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: getnotificationsSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Notifications;
	}

	async markNotificationAsReadedById(token: string, notificationId: string) {
		const response = await this.notificationsApi.markNotificationAsReaded(token, notificationId);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			schema: getnotificationsSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		return response.body.Notification;
	}
}
