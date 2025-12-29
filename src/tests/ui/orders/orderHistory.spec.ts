import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders]", () => {
	let token = "";

	test.beforeEach(async ({ orderDetailsHeaderPage }) => {
		token = await orderDetailsHeaderPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[history Order modal on Orders Details Page]", () => {
		test(
			"Check UI components on history Order Modal",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ orderDetailsBottomPage, page, mock, ordersApiService }) => {
				const order = await ordersApiService.createDraft(token, 1);
				const mockOrder = generateOrderDetailsMockWithDelivery(ORDER_STATUS.RECEIVED, false);
				mockOrder.Order._id = order._id;

				await mock.orderDetailsPage(mockOrder);
				await orderDetailsBottomPage.open(`orders/${order._id}`);
				await orderDetailsBottomPage.waitForOpened();

				await expect(orderDetailsBottomPage.bottomTab("history-tab")).toBeVisible();
				await orderDetailsBottomPage.changeBottomTab("history-tab");
				await page.waitForTimeout(1000);
				await expect(orderDetailsBottomPage.historyAccordion).toHaveCount(mockOrder.Order.history.length);
				for (const [index, item] of mockOrder.Order.history.entries()) {
					const accordion = orderDetailsBottomPage.historyAccordion.nth(index);
					const cols = accordion.locator(".his-col");

					await expect(cols.nth(0)).toHaveText(item.action);
					await expect(cols.nth(1)).toHaveText(`${item.performer!.firstName} ${item.performer!.lastName}`);
					await expect(cols.nth(2)).toHaveText(
						item.changedOn
							.replace(/T/, " ")
							.replace(/\..+Z$/, "")
							.replace(/-/g, "/"),
					);
				}
			},
		);
	});
});
