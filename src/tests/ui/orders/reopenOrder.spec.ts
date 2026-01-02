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
		async ({ ordersDetailsUIService, mock, reopenModal, orderDetailsHeaderPage }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.CANCELED, false);
			await mock.orderDetailsPage(order);
			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickReopenButton();
			await reopenModal.clickReopen();
		},
	);

	test(
		"Notification after Reopen order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({
			reopenModal,
			ordersApiService,
			ordersDetailsUIService,
			orderDetailsHeaderPage,
			orderDetailsProductPage,
		}) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickReopenButton();

			await reopenModal.clickReopen();
			await expect(orderDetailsProductPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_REOPENED);

			const orderData = await orderDetailsHeaderPage.getOrderStatus();
			await expect(orderData[0]?.value).toEqual("Draft");
		},
	);

	test(
		"Cansel Reopen order proccess",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ reopenModal, ordersApiService, ordersDetailsUIService, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

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
		async ({ reopenModal, ordersApiService, ordersDetailsUIService, orderDetailsHeaderPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsHeaderPage.clickReopenButton();

			await reopenModal.clickClose();

			const orderData = await orderDetailsHeaderPage.getOrderStatus();

			await expect(orderData[0]?.value).toEqual((await newOrder).status);
		},
	);
});
