import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";

export class CancelOrderModal extends BaseModal {
	readonly createOrderPageTitle = this.page.locator("h5");
	readonly body = this.page.locator('[class="modal-body modal-body-text"]');
	readonly yesCancelButton = this.page.locator("button[type='submit']");
	readonly cancelButton = this.page.locator("button.btn-secondary");
	readonly closeModal = this.page.locator('[aria-label="Close"]');

	readonly uniqueElement = this.body;

	@logStep("Click 'Yes, Cancel' button")
	async clickYesCancel() {
		await this.yesCancelButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}
}
