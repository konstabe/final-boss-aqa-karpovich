import { SALES_PORTAL_URL } from "config/env";
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
		"Reopen order from OrderDetailsPage",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, reopenModal, ordersApiService, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickReopenButton();

			await reopenModal.clickReopen();
		},
	);

	test(
		"Cansel Reopen order proccess",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ reopenModal, ordersApiService, page, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickReopenButton();

			await reopenModal.clickCancel();

			const orderData = await orderDetailsHeaderPage.getOrderStatus();

			await expect(orderData[0]?.value).toEqual((await newOrder).status);
		},
	);

	test(
		"Close Reopen order proccess",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ reopenModal, ordersApiService, page, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsHeaderPage.clickReopenButton();

			await reopenModal.clickClose();

			const orderData = await orderDetailsHeaderPage.getOrderStatus();

			await expect(orderData[0]?.value).toEqual((await newOrder).status);
		},
	);
});
