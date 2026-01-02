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
		async ({ mock, cancelOrderModal, orderDetailsHeaderPage, ordersDetailsUIService }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
			await mock.orderDetailsPage(order);
			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await expect(cancelOrderModal.uniqueElement).toHaveText("Are you sure you want to cancel the order?");
			await expect(cancelOrderModal.cancelButton).toBeVisible();
			await expect(cancelOrderModal.closeModal).toBeVisible();
			await expect(cancelOrderModal.yesCancelButton).toBeVisible();

			await cancelOrderModal.clickYesCancel();
			await expect(cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Check notification after Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({
			cancelOrderModal,
			orderDetailsProductPage,
			orderDetailsHeaderPage,
			ordersApiService,
			ordersDetailsUIService,
		}) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();

			await expect(orderDetailsProductPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CANCELED);
		},
	);

	test(
		"Close Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickCloseModal();
			await expect(cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Close Cancel Order Modal via CANCEL button",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickCancel();
			await expect(cancelOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cansel Draft order",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			const orderStatusDraft = await orderDetailsHeaderPage.getOrderStatus();
			await expect(orderStatusDraft[0]?.value).toEqual("Draft");

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();

			await orderDetailsHeaderPage.waitForOpened();

			const orderStatus = await orderDetailsHeaderPage.getOrderStatus();

			await expect(orderStatus[0]?.value).toEqual("Canceled");
		},
	);

	test(
		"Cansel IN PROGRESS order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Cansel REOPEN order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Checking that an order cannot be cancelled",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsHeaderPage.cancelOrderButton).not.toBeVisible();
		},
	);
});
