import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "./base/base.modal";
import { ORDER_STATUS } from "data/orders/orderStatus";

export class FilterModal extends BaseModal {
	readonly uniqueElement = this.page.locator("//div[@class='modal-dialog modal-filters-wrapper']");

	readonly title = this.uniqueElement.locator("h5");
	readonly applyButton = this.uniqueElement.locator("#apply-filters");
	readonly clearFiltersButton = this.uniqueElement.locator("#clear-filters");
	readonly closeButton = this.uniqueElement.locator("button.btn-close");
	readonly getCheckboxByStatus = (status: ORDER_STATUS) => {
		return this.uniqueElement.locator(`//*[@value='${status}']`);
	};
	readonly getLabelByStatus = (status: ORDER_STATUS) => {
		return this.getCheckboxByStatus(status).locator("~label");
	};

	@logStep("Click close button")
	async clickClose() {
		await this.closeButton.click();
	}

	@logStep("Click clear filters button")
	async clickCancel() {
		await this.clearFiltersButton.click();
	}

	@logStep("Click apply button")
	async clickApply() {
		await this.applyButton.click();
	}

	@logStep("Choose filters")
	async chooseCheckboxForFilter(checkboxes: ORDER_STATUS[]) {
		for (const checkbox of checkboxes) {
			await this.getCheckboxByStatus(checkbox).click();
		}
	}

	@logStep("Check checkbox")
	async checkCheckboxByStatus(checkbox: ORDER_STATUS) {
		await this.getCheckboxByStatus(checkbox).check();
	}

	@logStep("Uncheck checkbox")
	async uncheckCheckboxByStatus(checkbox: ORDER_STATUS) {
		await this.getCheckboxByStatus(checkbox).uncheck();
	}
}
