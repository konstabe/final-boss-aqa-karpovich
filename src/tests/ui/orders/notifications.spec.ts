import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { INotification, INotificationsResponse } from "data/types/notifications.types";
import { expect, test } from "fixtures";

const buildNotificationsResponse = (notifications: INotification[]): INotificationsResponse => ({
	Notifications: notifications,
	IsSuccess: true,
	ErrorMessage: null,
});

test.describe("[UI] [Notifications]", () => {
	test(
		"Should show empty state when there are no notifications",
		{ tag: [TAGS.UI, TAGS.REGRESSION] },
		async ({ mock, ordersListUIService, notificationsPopover }) => {
			await mock.notifications(buildNotificationsResponse([]));
			await ordersListUIService.open();

			await notificationsPopover.open();

			await expect(notificationsPopover.emptyStateText).toBeVisible();
		},
	);

	test(
		"Should display notifications list items",
		{ tag: [TAGS.UI, TAGS.REGRESSION] },
		async ({ mock, ordersListUIService, notificationsPopover }) => {
			const notification: INotification = {
				_id: "notification-id-1",
				userId: "user-id-1",
				type: "order",
				orderId: "order-id-1",
				message: "You have been assigned to order",
				read: true,
				createdAt: "2026-01-02T23:03:04.000Z",
				expiresAt: "2027-01-02T23:03:04.000Z",
			};

			await mock.notifications(buildNotificationsResponse([notification]));
			await ordersListUIService.open();

			await notificationsPopover.open();

			await expect(notificationsPopover.notificationItems).toHaveCount(1);
			await expect(notificationsPopover.notificationDateByIndex(0)).toBeVisible();
			await expect(notificationsPopover.notificationTextByIndex(0)).toHaveText(notification.message);
			await expect(notificationsPopover.orderDetailsLinkByIndex(0)).toBeVisible();
		},
	);

	test(
		"Should open Order Details page from notification link",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ mock, ordersListUIService, notificationsPopover, orderDetailsPage }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
			const notification: INotification = {
				_id: "notification-id-2",
				userId: "user-id-2",
				type: "order",
				orderId: order.Order._id,
				message: "You have been assigned to order",
				read: false,
				createdAt: "2026-01-02T23:03:04.000Z",
				expiresAt: "2027-01-02T23:03:04.000Z",
			};

			await mock.notifications(buildNotificationsResponse([notification]));
			await mock.orderDetailsPage(order);
			await ordersListUIService.open();

			await notificationsPopover.open();
			await notificationsPopover.orderDetailsLinkByIndex(0).click();

			await orderDetailsPage.waitForOpened();
			const numberText = await orderDetailsPage.header.getOrderNumber();
			expect(numberText ?? "").toContain(order.Order._id);
		},
	);
});
