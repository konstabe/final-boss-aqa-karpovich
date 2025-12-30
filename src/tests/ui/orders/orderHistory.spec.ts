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
			async ({ orderDetailsBottomPage, page, mock, ordersDetailsUIService }) => {
				const mockOrder = generateOrderDetailsMockWithDelivery(ORDER_STATUS.RECEIVED, false);
				await mock.orderDetailsPage(mockOrder);
				await ordersDetailsUIService.open(mockOrder.Order._id);

				await expect(orderDetailsBottomPage.bottomTab("history-tab")).toBeVisible();
				await orderDetailsBottomPage.changeBottomTab("history-tab");
				await page.waitForTimeout(500);

				await expect(orderDetailsBottomPage.historyTitle).toHaveText("Order History");
				await expect(orderDetailsBottomPage.bottomTab("history-tab")).toHaveText("Order History");

				await expect(orderDetailsBottomPage.historyColumns).toHaveText([
					"Action",
					"Performed By",
					"Date & Time",
				]);

				await expect(orderDetailsBottomPage.historyAccordion).toHaveCount(mockOrder.Order.history.length);
				for (const [index, item] of mockOrder.Order.history.entries()) {
					const accordion = orderDetailsBottomPage.historyAccordion.nth(index);
					const cols = accordion.locator(".his-col");

					await expect(orderDetailsBottomPage.historyToggleButton(index)).toHaveAttribute(
						"aria-expanded",
						"false",
					);
					await expect(cols.nth(0)).toHaveText(item.action);
					await expect(cols.nth(1)).toHaveText(`${item.performer!.firstName} ${item.performer!.lastName}`);
					await expect(cols.nth(2)).toHaveText(
						item.changedOn
							.replace(/T/, " ")
							.replace(/\..+Z$/, "")
							.replace(/-/g, "/"),
					);
				}
				await orderDetailsBottomPage.historyToggleButton(3).click();
				await expect
					.poll(async () => await orderDetailsBottomPage.historyToggleButton(3).getAttribute("aria-expanded"))
					.toBe("true");
				await expect(orderDetailsBottomPage.historyChangeCols(3).nth(2)).toHaveText("Updated");
				await expect(orderDetailsBottomPage.historyChangeCols(3).nth(1)).toHaveText("Previous");
				await page.waitForTimeout(500);
				await orderDetailsBottomPage.historyToggleButton(3).click();
				await expect
					.poll(async () => await orderDetailsBottomPage.historyToggleButton(3).getAttribute("aria-expanded"))
					.toBe("false");
			},
		);
	});
});
