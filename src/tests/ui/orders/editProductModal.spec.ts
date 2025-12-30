import { SALES_PORTAL_URL } from "config/env";
import { NOTIFICATIONS } from "data/notifications";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [editProductModal]", () => {
	let token = "";
	let id = "";
	let ids: string[] = [];

	test.beforeEach(async ({ ordersListPage }) => {
		token = await ordersListPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService, productsApiService }) => {
		await ordersApiService.fullDelete(token);
		if (id) await productsApiService.delete(id, token);
		id = "";
		if (ids.length) {
			for (const id of ids) {
				await productsApiService.delete(token, id);
			}
			ids.length = 0;
		}
	});

	test(
		"Check UI components",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.createDraft(token, 5);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsProductPage.openEditProductDetailsModal();

			await expect(editProductModal.editProductModalTitle).toHaveText("Edit Products");
			await expect(editProductModal.saveButton).toBeVisible();
			await expect(editProductModal.cancelButton).toBeVisible();
			await expect(editProductModal.cancelButton).toBeVisible();
			await editProductModal.verifyCountDeleteButtons(5);
			await expect(editProductModal.addProductButton).not.toBeVisible();

			await editProductModal.deleteProductByIndex(4);
			await editProductModal.deleteProductByIndex(3);
			await expect(editProductModal.addProductButton).toBeVisible();

			await editProductModal.deleteProductByIndex(2);
			await editProductModal.deleteProductByIndex(1);
			await expect(editProductModal.deleteProductButton).not.toBeVisible();

			await editProductModal.clickSave();
			await expect(orderDetailsProductPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_UPDATED);
		},
	);

	test(
		"Close Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsProductPage.openEditProductDetailsModal();

			await editProductModal.clickCloseModal();
			await expect(editProductModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cancel changes for products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal, orderDetailsProductPage }) => {
			const productsInOrder = page.locator("#products-accordion-section");

			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsProductPage.openEditProductDetailsModal();

			await editProductModal.updateProductByIndex(0, productNames[0]!);
			await editProductModal.clickCancel();

			await expect(productsInOrder).not.toHaveText(productNames);
		},
	);

	test(
		"Save changes for products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await orderDetailsProductPage.openEditProductDetailsModal();

			await editProductModal.updateProductByIndex(0, productNames[0]!);
			await editProductModal.clickSave();

			await expect(orderDetailsProductPage.productsDetailsInOrder).toContainText(productNames);
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order IN PROGRESS",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(orderDetailsProductPage.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for CANCEL Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(orderDetailsProductPage.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for Received Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(orderDetailsProductPage.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the product data cannot be changed for REOPEN Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, orderDetailsProductPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(orderDetailsProductPage.editProductsButton).toBeVisible();
		},
	);
});
