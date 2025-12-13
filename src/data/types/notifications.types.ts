import { IResponseFields } from "./core.types";

export interface INotification {
	_id: string;
	userId: string;
	type: string;
	orderId: string;
	message: string;
	read: boolean;
	createdAt: string;
	expiresAt: string;
}
export interface INotificationResponse extends IResponseFields {
	Notification: INotification;
}
export interface INotificationsResponse extends IResponseFields {
	Notifications: INotification[];
}
