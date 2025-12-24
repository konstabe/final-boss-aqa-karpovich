import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";

export class EditCustomerModal extends BaseModal {
	readonly editCustomerPageTitle = this.page.locator("h5");
	readonly customerField = this.page.locator('[id="inputCustomerOrder"]');
	readonly saveButton = this.page.locator("button[type='submit']");
	readonly cancelButton = this.page.locator("button.btn-secondary");
	readonly closeModal = this.page.locator('[aria-label="Close"]');

	readonly uniqueElement = this.editCustomerPageTitle;

	@logStep("Click save button")
	async clickSave() {
		await this.saveButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}
}
