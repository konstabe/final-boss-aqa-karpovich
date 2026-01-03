import { NOTIFICATIONS } from "data/notifications";
import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [reopenOrderModal]", () => {
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
		"Check UI components",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, mock, orderDetailsPage }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.CANCELED, false);
			await mock.orderDetailsPage(order);
			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickReopenButton();
			await orderDetailsPage.reopenModal.clickReopen();
		},
	);

	test(
		"Notification after Reopen order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickReopenButton();

			await orderDetailsPage.reopenModal.clickReopen();
			await expect(orderDetailsPage.product.toastMessage).toContainText(NOTIFICATIONS.ORDER_REOPENED);

			const orderData = await orderDetailsPage.header.getOrderStatus();
			await expect(orderData[0]?.value).toEqual("Draft");
		},
	);

	test(
		"Cansel Reopen order proccess",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickReopenButton();

			await orderDetailsPage.reopenModal.clickCancel();

			const orderData = await orderDetailsPage.header.getOrderStatus();

			await expect(orderData[0]?.value).toEqual((await newOrder).status);
		},
	);

	test(
		"Close Reopen order proccess",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.header.clickReopenButton();

			await orderDetailsPage.reopenModal.clickClose();

			const orderData = await orderDetailsPage.header.getOrderStatus();

			await expect(orderData[0]?.value).toEqual((await newOrder).status);
		},
	);
});
