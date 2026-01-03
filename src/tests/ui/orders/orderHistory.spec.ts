import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[History on Orders Details Page]", () => {
	const token = "";
	let mockOrder: ReturnType<typeof generateOrderDetailsMockWithDelivery>;

	test.beforeEach(async ({ orderDetailsPage, mock, ordersDetailsUIService, page }) => {
		mockOrder = generateOrderDetailsMockWithDelivery(ORDER_STATUS.RECEIVED, false);

		await mock.orderDetailsPage(mockOrder);
		await ordersDetailsUIService.open(mockOrder.Order._id);
		await expect(orderDetailsPage.bottom.bottomTab("history-tab")).toBeVisible();
		await orderDetailsPage.bottom.changeBottomTab("history-tab");
		await page.waitForTimeout(500);
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[History on Orders Details Page]", () => {
		test(
			"Check all order actions shown on history",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.HISTORY] },
			async ({ orderDetailsPage }) => {
				await expect(orderDetailsPage.bottom.historyTitle).toHaveText("Order History");
				await expect(orderDetailsPage.bottom.bottomTab("history-tab")).toHaveText("Order History");

				await expect(orderDetailsPage.bottom.historyColumns).toHaveText([
					"Action",
					"Performed By",
					"Date & Time",
				]);

				await expect(orderDetailsPage.bottom.historyAccordion).toHaveCount(mockOrder.Order.history.length);
				for (const [index, item] of mockOrder.Order.history.entries()) {
					const accordion = orderDetailsPage.bottom.historyAccordion.nth(index);
					const cols = accordion.locator(".his-col");

					await expect(orderDetailsPage.bottom.historyToggleButton(index)).toHaveAttribute(
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
			},
		);
	});
	test.describe("[History on Orders Details Page]", () => {
		test(
			"Check expand and toggle button on history page",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.HISTORY] },
			async ({ orderDetailsPage, page }) => {
				await orderDetailsPage.bottom.historyToggleButton(3).click();
				await expect
					.poll(
						async () => await orderDetailsPage.bottom.historyToggleButton(3).getAttribute("aria-expanded"),
					)
					.toBe("true");
				await expect(orderDetailsPage.bottom.historyChangeCols(3).nth(2)).toHaveText("Updated");
				await expect(orderDetailsPage.bottom.historyChangeCols(3).nth(1)).toHaveText("Previous");
				await page.waitForTimeout(500);
				await orderDetailsPage.bottom.historyToggleButton(3).click();
				await expect
					.poll(
						async () => await orderDetailsPage.bottom.historyToggleButton(3).getAttribute("aria-expanded"),
					)
					.toBe("false");
			},
		);
	});
});
