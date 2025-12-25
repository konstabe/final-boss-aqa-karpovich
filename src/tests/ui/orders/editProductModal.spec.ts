import { SALES_PORTAL_URL } from "config/env";
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
		async ({ page, ordersApiService, editProductModal }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей
			const newOrder = ordersApiService.createDraft(token, 5);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editPodructButton.click();

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
			// await expect(page!!!!!.toastMessage).toContainText(NOTIFICATIONS.ORDER_UPDATED);
		},
	);

	test(
		"Close Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editPodructButton.click();

			await editProductModal.clickCloseModal();
			await expect(editProductModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cancel changes for products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal }) => {
			const productsInOrder = page.locator("#products-accordion-section");
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editPodructButton.click();

			await editProductModal.updateProductByIndex(0, productNames[0]!);
			await editProductModal.clickCancel();

			await expect(productsInOrder).not.toHaveText(productNames); //необходимо убрать когда будет страница деталей
		},
	);

	test(
		"Save changes for products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService, editProductModal }) => {
			const productsInOrder = page.locator("#products-accordion-section");
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await editPodructButton.click();

			await editProductModal.updateProductByIndex(0, productNames[0]!);
			await editProductModal.clickSave();

			await expect(productsInOrder).toContainText(productNames); //необходимо убрать когда будет страница деталей
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order IN PROGRESS",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editPodructButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for CANCEL Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editPodructButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for Received Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editPodructButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the product data cannot be changed for REOPEN Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ page, ordersApiService }) => {
			const editPodructButton = page.locator("#edit-products-pencil"); //необходимо убрать когда будет страница деталей

			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await page.goto(`${SALES_PORTAL_URL}orders/${orderId}`); //необходимо убрать когда будет страница деталей

			await expect(editPodructButton).toBeVisible();
		},
	);
});
