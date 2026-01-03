import { NOTIFICATIONS } from "data/notifications";
import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { generateAllProductsForOrderPage } from "data/products/generateProductData";
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
		async ({ ordersDetailsUIService, mock, orderDetailsPage }) => {
			const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
			await mock.orderDetailsPage(order);

			const orderId = order.Order._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.product.openEditProductDetailsModal();

			await mock.orderDetailsAllProduct(generateAllProductsForOrderPage(1));

			await expect(orderDetailsPage.editProductModal.editProductModalTitle).toHaveText("Edit Products");
			await expect(orderDetailsPage.editProductModal.saveButton).toBeVisible();
			await expect(orderDetailsPage.editProductModal.cancelButton).toBeVisible();
			await expect(orderDetailsPage.editProductModal.cancelButton).toBeVisible();
			await expect(orderDetailsPage.editProductModal.deleteProductButton).not.toBeVisible();
			await expect(orderDetailsPage.editProductModal.addProductButton).toBeVisible();
		},
	);

	test(
		"Check notification after update products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ orderDetailsPage, ordersApiService, ordersDetailsUIService }) => {
			const newOrder = ordersApiService.createDraft(token, 5);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.product.openEditProductDetailsModal();

			await orderDetailsPage.editProductModal.verifyCountDeleteButtons(5);
			await expect(orderDetailsPage.editProductModal.addProductButton).not.toBeVisible();

			await orderDetailsPage.editProductModal.deleteProductByIndex(4);
			await orderDetailsPage.editProductModal.deleteProductByIndex(3);
			await expect(orderDetailsPage.editProductModal.addProductButton).toBeVisible();

			await orderDetailsPage.editProductModal.deleteProductByIndex(2);
			await orderDetailsPage.editProductModal.deleteProductByIndex(1);

			await orderDetailsPage.editProductModal.clickSave();
			await expect(orderDetailsPage.product.toastMessage).toContainText(NOTIFICATIONS.ORDER_UPDATED);
		},
	);

	test(
		"Close Modal",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);

			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.product.openEditProductDetailsModal();

			await orderDetailsPage.editProductModal.clickCloseModal();
			await expect(orderDetailsPage.editProductModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Cancel changes for products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.product.openEditProductDetailsModal();

			await orderDetailsPage.editProductModal.updateProductByIndex(0, productNames[0]!);
			await orderDetailsPage.editProductModal.clickCancel();

			await expect(orderDetailsPage.product.productsDetailsInOrder).not.toContainText(productNames);
		},
	);

	test(
		"Save changes for products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.createDraft(token, 1);
			const orderId = (await newOrder)._id;

			const { productNames, productsIds } = await ordersApiService.createProducts(token, 1);
			ids = productsIds;

			await ordersDetailsUIService.open(orderId);

			await orderDetailsPage.product.openEditProductDetailsModal();

			await orderDetailsPage.editProductModal.updateProductByIndex(0, productNames[0]!);
			await orderDetailsPage.editProductModal.clickSave();

			await expect(orderDetailsPage.product.productsDetailsInOrder).toContainText(productNames);
		},
	);

	test(
		"Сheck that the customer data cannot be changed for order IN PROGRESS",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.processOrder(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsPage.product.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for CANCEL Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.cancelOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsPage.product.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the customer data cannot be changed for Received Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.allReceived(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsPage.product.editProductsButton).not.toBeVisible();
		},
	);

	test(
		"Сheck that the product data cannot be changed for REOPEN Order",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersDetailsUIService, ordersApiService, orderDetailsPage }) => {
			const newOrder = ordersApiService.reopenOrderInProgress(token, 1);
			const orderId = (await newOrder)._id;

			await ordersDetailsUIService.open(orderId);

			await expect(orderDetailsPage.product.editProductsButton).toBeVisible();
		},
	);
});
