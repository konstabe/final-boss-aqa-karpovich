import { NOTIFICATIONS } from "data/notifications";
import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [cancelOrderModal]", () => {
	let token = "";
	let id_customer = "";

	test.beforeEach(async ({ ordersListPage }) => {
		token = await ordersListPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService, customersApiService }) => {
		await ordersApiService.fullDelete(token);
		if (id_customer) await customersApiService.delete(id_customer, token);
		id_customer = "";
	});

	test(
		"Check UI components for Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ mock, orderDetailsPage, ordersDetailsUIService }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
			await mock.orderDetailsPage(order);
			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await expect(orderDetailsPage.cancelOrderModal.uniqueElement).toHaveText(
				"Are you sure you want to cancel the order?",
			);
			await expect(orderDetailsPage.cancelOrderModal.cancelButton).toBeVisible();
			await expect(orderDetailsPage.cancelOrderModal.closeModal).toBeVisible();
			await expect(orderDetailsPage.cancelOrderModal.yesCancelButton).toBeVisible();

			await orderDetailsPage.cancelOrderModal.clickYesCancel();
			await expect(orderDetailsPage.cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Check notification after Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ orderDetailsPage, ordersApiService, ordersDetailsUIService }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickYesCancel();

			await expect(orderDetailsPage.product.toastMessage).toContainText(NOTIFICATIONS.ORDER_CANCELED);
		},
	);

	test(
		"Close Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickCloseModal();
			await expect(orderDetailsPage.cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Close Cancel Order Modal via CANCEL button",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickCancel();
			await expect(orderDetailsPage.cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cansel Draft order",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			const orderStatusDraft = await orderDetailsPage.header.getOrderStatus();
			await expect(orderStatusDraft[0]?.value).toEqual("Draft");

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickYesCancel();

			await orderDetailsPage.waitForOpened();

			const orderStatus = await orderDetailsPage.header.getOrderStatus();

			await expect(orderStatus[0]?.value).toEqual("Canceled");
		},
	);

	test(
		"Cansel IN PROGRESS order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Cansel REOPEN order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickCancelOrderButton();

			await orderDetailsPage.cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Checking that an order cannot be cancelled",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsPage.header.cancelOrderButton).not.toBeVisible();
		},
	);
});
