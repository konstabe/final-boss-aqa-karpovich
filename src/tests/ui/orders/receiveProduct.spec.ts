import { expect, test } from "fixtures";
import { TAGS } from "data/tags";
import { NOTIFICATIONS } from "data/notifications";

test.describe("[UI] [OrderProductsReceive]", () => {
	let token = "";

	test.beforeEach(async ({ ordersListPage }) => {
		token = await ordersListPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});
	test(
		"Receive All Products from order",
		{ tag: [TAGS.ORDER, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ ordersApiService, page, ordersDetailsUIService, orderDetailsPage }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 2);

			await ordersDetailsUIService.open(orderInProcess._id);
			await expect(orderDetailsPage.product.productSection).toBeVisible();
			await orderDetailsPage.product.receiveOrderButton.click();
			await page.waitForTimeout(500);
			await expect(orderDetailsPage.product.selectAllCheckbox).toBeVisible();
			await orderDetailsPage.product.selectAllCheckbox.click();
			await orderDetailsPage.product.saveReceivedProductsButton.click();
			await page.waitForTimeout(1000);

			const row = page.locator(".accordion-header .received-label");
			await expect(row.nth(0)).toHaveText("Received");
			await expect(row.nth(1)).toHaveText("Received");
		},
	);
	test(
		"Receive few Products from order",
		{ tag: [TAGS.ORDER, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ ordersApiService, page, ordersDetailsUIService, orderDetailsPage }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 3);
			const id = orderInProcess._id;

			await ordersDetailsUIService.open(id);
			await expect(orderDetailsPage.product.productSection).toBeVisible();
			await orderDetailsPage.product.receiveOrderButton.click();
			await page.waitForTimeout(500);

			await orderDetailsPage.product.toggleProductCheckbox(0);
			await orderDetailsPage.product.toggleProductCheckbox(2);
			await orderDetailsPage.product.saveReceivedProductsButton.click();
			await page.waitForTimeout(500);

			await expect(orderDetailsPage.product.toastMessage).toContainText(NOTIFICATIONS.PRODUCTS_RECEIVED);

			await expect(orderDetailsPage.product.row.nth(1)).toHaveText("Not Received");
			await expect(orderDetailsPage.product.row.nth(0)).toHaveText("Received");
			await expect(orderDetailsPage.product.row.nth(2)).toHaveText("Received");
		},
	);
});
