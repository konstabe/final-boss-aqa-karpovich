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

	test.beforeEach(async ({ orderDetailsPage }) => {
		await orderDetailsPage.open(`orders/${orderId}`);
		await orderDetailsPage.waitForOpened();
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
		async ({ orderDetailsPage }) => {
			await expect(orderDetailsPage.bottom.bottomSection).toBeVisible();
			await expect(orderDetailsPage.bottom.bottomTab("delivery-tab")).toBeVisible();
			await expect(orderDetailsPage.bottom.bottomTab("history-tab")).toBeVisible();
			await expect(orderDetailsPage.bottom.bottomTab("comments-tab")).toBeVisible();
		},
	);

	test(
		"Should show delivery details",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			await orderDetailsPage.bottom.changeBottomTab("delivery-tab");
			const details = await orderDetailsPage.bottom.getDeliveryInformation();
			const labels = details.map((item) => item.label);
			const expectedLabels = ["Delivery Type", "Delivery Date", "Country", "City", "Street", "House", "Flat"];

			for (const label of expectedLabels) {
				expect(labels).toContain(label);
			}
		},
	);

	test(
		"Should open Edit Delivery modal",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			await orderDetailsPage.bottom.changeBottomTab("delivery-tab");
			await orderDetailsPage.bottom.openScheduleDeliveryModal();

			await expect(orderDetailsPage.editDeliveryModal.uniqueElement).toBeVisible();
			await expect(orderDetailsPage.editDeliveryModal.typeSelect).toBeVisible();
			await expect(orderDetailsPage.editDeliveryModal.locationSelect).toBeVisible();
			await expect(orderDetailsPage.editDeliveryModal.saveDeliveryButton).toBeVisible();
			await expect(orderDetailsPage.editDeliveryModal.backToOrderDetailsButton).toBeVisible();

			await orderDetailsPage.editDeliveryModal.backToOrderDetails();
			await orderDetailsPage.editDeliveryModal.waitForClosed();
		},
	);

	test("Should show history data", { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] }, async ({ orderDetailsPage }) => {
		await orderDetailsPage.bottom.changeBottomTab("history-tab");
		const historyCount = await orderDetailsPage.bottom.historyAccordion.count();

		expect(historyCount).toBeGreaterThan(0);
		await expect(orderDetailsPage.bottom.historyToggleButton(0)).toBeVisible();
	});

	test(
		"Should validate empty comment",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			await orderDetailsPage.bottom.changeBottomTab("comments-tab");
			await orderDetailsPage.bottom.fillComment(">");

			const errorText = await orderDetailsPage.bottom.getCommentValidationErrorText();

			expect(errorText ?? "").not.toBe("");
			expect(orderDetailsPage.bottom.sendCommentButton).toBeDisabled();
		},
	);
});
