import { SALES_PORTAL_URL } from "config/env";
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
		async ({ page, ordersApiService, editCustomerModal }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editCustomerButton.click();

			await expect(editCustomerModal.editCustomerModalTitle).toHaveText("Edit Customer");
			await expect(editCustomerModal.saveButton).toBeVisible();
			await expect(editCustomerModal.cancelButton).toBeVisible();
			await expect(editCustomerModal.cancelButton).toBeVisible();
		},
	);

	test(
		"Close Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editCustomerModal }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editCustomerButton.click();

			await editCustomerModal.clickCloseModal();
			await expect(editCustomerModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cancel changes for customer",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editCustomerModal }) => {
			const { customerId, customerName } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей
			const emailField = page.locator("//div[@class='p-3']/div[1]//span[2]"); //необходимо убрать когда будет страница деталей
			const nameField = page.locator("//div[@class='p-3']/div[2]//span[2]"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;
			const customerEmailOriginal = (await newOrder).customer.email;
			const customerNameOriginal = (await newOrder).customer.name;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editCustomerButton.click();

			await editCustomerModal.changeCustomer(customerName);
			await editCustomerModal.clickCancel();
			await expect(editCustomerModal.modalBody).not.toBeVisible();

			await expect(emailField).toHaveText(customerEmailOriginal); //необходимо убрать когда будет страница деталей
			await expect(nameField).toHaveText(customerNameOriginal); //необходимо убрать когда будет страница деталей
		},
	);

	test(
		"Save changes for customer",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editCustomerModal }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей
			const emailField = page.locator("//div[@class='p-3']/div[1]//span[2]"); //необходимо убрать когда будет страница деталей
			const nameField = page.locator("//div[@class='p-3']/div[2]//span[2]"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editCustomerButton.click();

			await editCustomerModal.changeCustomer(customerName);
			await editCustomerModal.clickSave();
			await expect(editCustomerModal.modalBody).not.toBeVisible();

			await expect(emailField).toHaveText(customerEmail); //необходимо убрать когда будет страница деталей
			await expect(nameField).toHaveText(customerName); //необходимо убрать когда будет страница деталей
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order IN PROGRESS",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order Received",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for CANCEL Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editCustomerButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for REOPEN Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editCustomerButton = page.locator("#edit-customer-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editCustomerButton).toBeVisible();
		},
	);
});
