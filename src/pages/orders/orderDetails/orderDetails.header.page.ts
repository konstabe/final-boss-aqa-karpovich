import { expect } from "@playwright/test";
import { SalesPortalPage } from "pages/salesPortal.page";
import { parseSummaryCell } from "utils/parseCells";
import { OrderSummaryTitle } from "../common/order.types";
import { logStep } from "utils/report/logStep.utils";

export class OrderDetailsHeaderPage extends SalesPortalPage {
	readonly detailsHeader = this.page.locator("#order-details-header");
	readonly uniqueElement = this.detailsHeader;

	readonly backLink = this.page.locator("a", { hasText: "Orders" });
	readonly orderNumber = this.detailsHeader.locator("span.strong-details + span.fst-italic");
	readonly orderStatusBlocks = this.page.locator("#order-status-bar-container .me-2");

	readonly cancelOrderButton = this.page.locator("#cancel-order");
	readonly reopenOrderButton = this.page.locator("#reopen-order");
	readonly refreshOrderButton = this.page.locator("#refresh-order");
	readonly assignManagerContainer = this.page.locator("#assigned-manager-container");
	readonly unassignManagerButton = this.page.locator("#assigned-manager-link");
	readonly editAssignedManagerButton = this.page.locator("[onclick*='renderAssigneManagerModal']");

	@logStep("Get order number")
	async getOrderNumber() {
		await expect(this.orderNumber).toBeVisible();
		return this.orderNumber.textContent();
	}

	@logStep("Click cancel order button")
	async clickCancelOrderButton() {
		await this.cancelOrderButton.click();
	}

	@logStep("Click reopen order button")
	async clickReopenButton() {
		await this.reopenOrderButton.click();
	}

	@logStep("Get order status")
	async getOrderStatus() {
		const texts = await this.orderStatusBlocks.allTextContents();

		return texts.map((text) =>
			parseSummaryCell(
				text,
				(label) => label as OrderSummaryTitle,
				(value) => value as string,
			),
		);
	}

	@logStep("Refresh order")
	async refreshOrder() {
		return this.interceptResponse("/api/orders/", () => this.refreshOrderButton.click());
	}

	@logStep("Click assign manager")
	async clickAssignManager() {
		await this.assignManagerContainer.click();
	}

	@logStep("Open unassign manager modal")
	async openUnassignManagerModal() {
		await this.unassignManagerButton.click();
	}

	@logStep("Open edit assigned manager modal")
	async openEditAssignedManagerModal() {
		await this.editAssignedManagerButton.click();
	}
}
