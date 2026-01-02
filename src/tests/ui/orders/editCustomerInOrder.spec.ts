import { generateCustomerResponseData } from "data/customers/generateCustomerData";
import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [editCustomerModal]", () => {
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
		async ({ mock, editCustomerModal, orderDetailsCustomerPage, ordersDetailsUIService }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
			await mock.orderDetailsPage(order);

			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsCustomerPage.openChangeCustomerModal();
			const allCustomet = generateCustomerResponseData();
			await mock.orderDetailsAllCustomer(allCustomet);

			await expect(editCustomerModal.editCustomerModalTitle).toHaveText("Edit Customer");
			await expect(editCustomerModal.saveButton).toBeVisible();
			await expect(editCustomerModal.cancelButton).toBeVisible();
		},
	);

	test(
		"Close Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, editCustomerModal, orderDetailsCustomerPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsCustomerPage.openChangeCustomerModal();

			await editCustomerModal.clickCloseModal();
			await expect(editCustomerModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cancel changes for customer",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, editCustomerModal, orderDetailsCustomerPage }) => {
			const { customerId, customerName } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const customerData = await orderDetailsCustomerPage.getCustomerDetails();

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;
			const customerEmailOriginal = (await newOrder).customer.email;
			const customerNameOriginal = (await newOrder).customer.name;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsCustomerPage.openChangeCustomerModal();

			await editCustomerModal.changeCustomer(customerName);
			await editCustomerModal.clickCancel();
			await expect(editCustomerModal.modalBody).not.toBeVisible();

			console.log(customerData);

			await expect(orderDetailsCustomerPage.emailField).toHaveText(customerEmailOriginal);
			await expect(orderDetailsCustomerPage.nameField).toHaveText(customerNameOriginal);
		},
	);

	test(
		"Save changes for customer",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, editCustomerModal, orderDetailsCustomerPage }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsCustomerPage.openChangeCustomerModal();

			await editCustomerModal.changeCustomer(customerName);
			await editCustomerModal.clickSave();
			await expect(editCustomerModal.modalBody).not.toBeVisible();

			await expect(orderDetailsCustomerPage.emailField).toHaveText(customerEmail);
			await expect(orderDetailsCustomerPage.nameField).toHaveText(customerName);
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order IN PROGRESS",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsCustomerPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsCustomerPage.editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order Received",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsCustomerPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsCustomerPage.editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for CANCEL Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsCustomerPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsCustomerPage.editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for REOPEN Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsCustomerPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsCustomerPage.editCustomerButton).toBeVisible();
		},
	);
});
