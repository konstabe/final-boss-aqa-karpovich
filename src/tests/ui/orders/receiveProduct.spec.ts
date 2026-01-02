import { expect, test } from "fixtures";
import { TAGS } from "data/tags";

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
		async ({ ordersApiService, page, ordersDetailsUIService, orderDetailsProductPage }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 2);

			await ordersDetailsUIService.open(orderInProcess._id);
			await expect(orderDetailsProductPage.productSection).toBeVisible();
			await orderDetailsProductPage.receiveOrderButton.click();
			await page.waitForTimeout(500);
			await expect(orderDetailsProductPage.selectAllCheckbox).toBeVisible();
			await orderDetailsProductPage.selectAllCheckbox.click();
			await orderDetailsProductPage.saveReceivedProductsButton.click();
			await page.waitForTimeout(1000);

			const row = page.locator(".accordion-header .received-label");
			await expect(row.nth(0)).toHaveText("Received");
			await expect(row.nth(1)).toHaveText("Received");
		},
	);
	test(
		"Receive few Products from order",
		{ tag: [TAGS.ORDER, TAGS.REGRESSION, TAGS.SMOKE] },
		async ({ ordersApiService, page, ordersDetailsUIService, orderDetailsProductPage }) => {
			const orderInProcess = await ordersApiService.processOrder(token, 3);
			const id = orderInProcess._id;

			await ordersDetailsUIService.open(id);
			await expect(orderDetailsProductPage.productSection).toBeVisible();
			await orderDetailsProductPage.receiveOrderButton.click();
			await page.waitForTimeout(500);

			await orderDetailsProductPage.toggleProductCheckbox(0);
			await orderDetailsProductPage.toggleProductCheckbox(2);
			await orderDetailsProductPage.saveReceivedProductsButton.click();
			await page.waitForTimeout(3500);

			const row = page.locator(".accordion-header .received-label");

			await expect(row.nth(1)).toHaveText("Not Received");
			await expect(row.nth(0)).toHaveText("Received");
			await expect(row.nth(2)).toHaveText("Received");
		},
	);
});
