import { expect } from "@playwright/test";
import { BasePage } from "pages/base/base.page";
import { logStep } from "utils/report/logStep.utils";

export class NotificationsPopover extends BasePage {
	readonly bellButton = this.page.locator("#notification-bell");
	readonly popoverContainer = this.page.locator("#notification-popover-container");
	readonly title = this.popoverContainer.getByText("Notifications");
	readonly closeButton = this.popoverContainer.locator("button.btn-close");
	readonly markAllReadButton = this.popoverContainer.locator("#mark-all-read");

	readonly notificationList = this.popoverContainer.locator("#notification-list");
	readonly notificationItems = this.notificationList.locator("li");
	readonly notificationItemByIndex = (index: number) => this.notificationItems.nth(index);
	readonly notificationDateByIndex = (index: number) =>
		this.notificationItemByIndex(index).locator("[data-testid='notification-date']");
	readonly notificationTextByIndex = (index: number) =>
		this.notificationItemByIndex(index).locator("[data-testid='notification-text']");
	readonly orderDetailsLinkByIndex = (index: number) =>
		this.notificationItemByIndex(index).locator("[data-testid='order-details-link']");
	readonly emptyStateText = this.popoverContainer.getByText("No notifications");

	@logStep("Open notifications popover")
	async open() {
		await this.bellButton.click();
		await expect(this.popoverContainer).toBeVisible();
	}

	@logStep("Close notifications popover")
	async close() {
		await this.closeButton.click();
		await expect(this.popoverContainer).not.toBeVisible();
	}

	@logStep("Click Read All button")
	async clickMarkAllRead() {
		await this.markAllReadButton.click();
	}

	async getNotificationCount() {
		return this.notificationItems.count();
	}
}
