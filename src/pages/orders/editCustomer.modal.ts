import { expect } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";

export class EditCustomerModal extends BaseModal {
	readonly editCustomerModalTitle = this.page.locator("h5");
	readonly customerField = this.page.locator('[id="inputCustomerOrder"]');
	readonly saveButton = this.page.locator("button[type='submit']");
	readonly cancelButton = this.page.locator("button.btn-secondary");
	readonly closeModal = this.page.locator('[aria-label="Close"]');
	readonly modalBody = this.page.locator(".modal-content");

	readonly uniqueElement = this.editCustomerModalTitle;

	@logStep("Click save button")
	async clickSave() {
		await this.saveButton.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Click close icon for edit customer modal window")
	async clickCloseModal() {
		await this.closeModal.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Change customer for order")
	async changeCustomer(customerName: string) {
		await this.customerField.selectOption(customerName);
	}
}
