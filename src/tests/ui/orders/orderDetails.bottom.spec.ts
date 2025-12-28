import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Details] [Bottom]", () => {
	let token = "";
	let orderId = "";
	let customerId = "";
	let productIds: string[] = [];

	test.beforeAll(async ({ loginApiService, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const order = await ordersApiService.createDraftWithDelivery(token, 1);
		orderId = order._id;
		customerId = order.customer._id;
		productIds = order.products.map((product) => product._id);
	});

	test.beforeEach(async ({ orderDetailsBottomPage }) => {
		await orderDetailsBottomPage.open(`orders/${orderId}`);
		await orderDetailsBottomPage.waitForOpened();
	});

	test.afterAll(async ({ ordersApiService, customersApiService, productsApiService }) => {
		if (token && orderId) {
			await ordersApiService.deleteOrder(token, orderId);
		}
		if (productIds.length) {
			await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
		}
		if (customerId) {
			await customersApiService.delete(customerId, token);
		}
		orderId = "";
		customerId = "";
		productIds = [];
	});

	test(
		"Should display bottom section and tabs",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsBottomPage }) => {
			await expect(orderDetailsBottomPage.bottomSection).toBeVisible();
			await expect(orderDetailsBottomPage.bottomTab("delivery-tab")).toBeVisible();
			await expect(orderDetailsBottomPage.bottomTab("history-tab")).toBeVisible();
			await expect(orderDetailsBottomPage.bottomTab("comments-tab")).toBeVisible();
		},
	);

	test(
		"Should show delivery details",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsBottomPage }) => {
			await orderDetailsBottomPage.changeBottomTab("delivery-tab");
			const details = await orderDetailsBottomPage.getDeliveryInformation();
			const labels = details.map((item) => item.label);
			const expectedLabels = ["Delivery Type", "Delivery Date", "Country", "City", "Street", "House", "Flat"];

			for (const label of expectedLabels) {
				expect(labels).toContain(label);
			}
		},
	);

	test(
		"Should show history data",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsBottomPage }) => {
			await orderDetailsBottomPage.changeBottomTab("history-tab");
			const historyCount = await orderDetailsBottomPage.historyAccordion.count();

			expect(historyCount).toBeGreaterThan(0);
			await expect(orderDetailsBottomPage.historyToggleButton(0)).toBeVisible();
		},
	);

	test(
		"Should validate empty comment",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsBottomPage }) => {
			await orderDetailsBottomPage.changeBottomTab("comments-tab");
			await orderDetailsBottomPage.fillComment(">");

			const errorText = await orderDetailsBottomPage.getCommentValidationErrorText();

			expect(errorText ?? "").not.toBe("");
			expect(orderDetailsBottomPage.sendCommentButton).toBeDisabled();
		},
	);
});
