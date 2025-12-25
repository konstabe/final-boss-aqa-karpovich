import { expect } from "@playwright/test";
import { SalesPortalPage } from "pages/salesPortal.page";
import { parseSummaryCell } from "utils/parseCells";
import { DeliveryDetailsTitle, HistoryChange } from "../common/order.types";
import { logStep } from "utils/report/logStep.utils";

export class OrderDetailsBottomPage extends SalesPortalPage {
	readonly bottomSection = this.page.locator("#order-details-tabs-section");
	readonly uniqueElement = this.bottomSection;

	readonly bottomTab = (tab: "delivery-tab" | "history-tab" | "comments-tab") => this.page.locator(`#${tab}`);

	readonly deliveryInfoBlocks = this.page.locator("#delivery .c-details");
	readonly scheduleDeliveryButton = this.page.locator("#delivery-btn");

	readonly historyAccordion = this.page.locator("#history-body .accordion");
	readonly historyToggleButton = (index: number) =>
		this.historyAccordion.nth(index).locator(".accordion-header button.accordion-button");
	readonly historyAccordionCollapse = (index: number) =>
		this.historyAccordion.nth(index).locator(".accordion-collapse");
	readonly historyChangeRow = (index: number) =>
		this.historyAccordionCollapse(index).locator(".d-flex.justify-content-around.py-3.border-bottom").last();
	readonly historyChangeCols = (index: number) => this.historyChangeRow(index).locator(".his-col");
	readonly commentTextarea = this.page.locator("#textareaComments");
	readonly sendCommentButton = this.page.locator("#create-comment-btn");
	readonly commentValidationError = this.page.locator("#error-textareaComments");

	@logStep("Change bottom tab")
	async changeBottomTab(tab: "delivery-tab" | "history-tab" | "comments-tab") {
		await this.bottomTab(tab).click();
	}

	@logStep("Get delivery information")
	async getDeliveryInformation() {
		const texts = await this.deliveryInfoBlocks.allTextContents();

		return texts.map((text) =>
			parseSummaryCell(
				text,
				(label) => label as DeliveryDetailsTitle,
				(value) => value as string,
			),
		);
	}

	@logStep("Open schedule delivery modal")
	async openScheduleDeliveryModal() {
		await this.scheduleDeliveryButton.click();
	}

	@logStep("Get history change by index")
	async getHistoryChangeByIndex(index: number): Promise<HistoryChange> {
		const toggleButton = this.historyToggleButton(index);
		const isExpanded = await toggleButton.getAttribute("aria-expanded");

		if (isExpanded !== "true") {
			await toggleButton.click();
		}

		const cols = this.historyChangeCols(index);

		const previous = (await cols.nth(1).textContent())?.trim() ?? "";
		const current = (await cols.nth(2).textContent())?.trim() ?? "";

		return { previous, current };
	}

	@logStep("Fill comment")
	async fillComment(comment: string) {
		await this.commentTextarea.fill(comment);
	}

	async sendComment() {
		await this.sendCommentButton.click();
	}

	@logStep("Get comment validation error text")
	async getCommentValidationErrorText() {
		await expect(this.commentValidationError).toBeVisible();
		return this.commentValidationError.textContent();
	}
}
