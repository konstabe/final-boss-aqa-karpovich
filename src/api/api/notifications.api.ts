import { IApiClient } from "api/core/types";
import { INotificationResponse, INotificationsResponse } from "data/types/notifications.types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "api/core/types";

export class NotificationsApi {
	constructor(private apiClient: IApiClient) {}

	async getNotifications(token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.getNotifications,
			method: "get",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<INotificationsResponse>(options);
	}

	async markAllNotificationsAsReaded(token: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.markAllNotificationsAsReaded,
			method: "patch",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<INotificationsResponse>(options);
	}

	async markNotificationAsReaded(token: string, notificationId: string) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.markNotificationAsReaded(notificationId),
			method: "patch",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		return await this.apiClient.send<INotificationResponse>(options);
	}
}
