import { SALES_PORTAL_URL } from "config/env";
import { NOTIFICATIONS } from "data/notifications";
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
		async ({ page, cancelOrderModal, orderDetailsProductPage, orderDetailsHeaderPage, ordersApiService }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await expect(cancelOrderModal.uniqueElement).toHaveText("Are you sure you want to cancel the order?");
			await expect(cancelOrderModal.cancelButton).toBeVisible();
			await expect(cancelOrderModal.closeModal).toBeVisible();
			await expect(cancelOrderModal.yesCancelButton).toBeVisible();

			await cancelOrderModal.clickYesCancel();
			await expect(cancelOrderModal.modalBody).not.toBeVisible();
			await expect(orderDetailsProductPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CANCELED);
		},
	);

	test(
		"Close Cancel Order Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

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
		async ({ page, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

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
		async ({ page, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

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
		async ({ page, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Cansel REOPEN order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, cancelOrderModal, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickCancelOrderButton();

			await cancelOrderModal.clickYesCancel();
		},
	);

	test(
		"Checking that an order cannot be cancelled",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(orderDetailsHeaderPage.cancelOrderButton).not.toBeVisible();
		},
	);
});
