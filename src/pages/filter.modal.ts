import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "./base/base.modal";
import { Locator } from "@playwright/test";

export class filterModal extends BaseModal {
	readonly uniqueElement = this.page.locator("//div[@class='modal-dialog modal-filters-wrapper']");

	readonly title = this.uniqueElement.locator("h5");
	readonly applyButton = this.uniqueElement.locator("#apply-filters");
	readonly clearFiltersButton = this.uniqueElement.locator("#clear-filters");
	readonly closeButton = this.uniqueElement.locator("button.btn-close");
	private filtersCheckbox(value: string): Locator {
		return this.uniqueElement.locator(`//*[@value='${value}']`);
	}

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
	async chooseFieldsForExport(checkboxes: string[]) {
		for (const checkbox of checkboxes) {
			await this.filtersCheckbox(checkbox).click();
		}
	}
}
