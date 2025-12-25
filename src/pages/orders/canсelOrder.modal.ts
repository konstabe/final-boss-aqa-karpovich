import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";
import { expect } from "fixtures";

export class CancelOrderModal extends BaseModal {
	readonly cancelOrderModalTitle = this.page.locator("h5");
	readonly body = this.page.locator('[class="modal-body modal-body-text"]');
	readonly yesCancelButton = this.page.locator("button[type='submit']");
	readonly cancelButton = this.page.locator("button.btn-secondary");
	readonly closeModal = this.page.locator('[aria-label="Close"]');
	readonly modalBody = this.page.locator(".modal-content");

	readonly uniqueElement = this.body;

	@logStep("Click 'Yes, Cancel' button")
	async clickYesCancel() {
		await this.yesCancelButton.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Click close icon for cancel order modal window")
	async clickCloseModal() {
		await this.closeModal.click();
		await expect(this.modalBody).not.toBeVisible();
	}
}
