import { logStep } from "utils/report/logStep.utils";
import { ConfirmationModal } from "./confirmation.modal";

export class ReopenModal extends ConfirmationModal {
	readonly uniqueElement = this.page.locator('[name="confirmation-modal"]');

	readonly title = this.uniqueElement.locator("h5");
	readonly reopenButton = this.uniqueElement.locator("button.position-relative");

	@logStep("Click close button")
	async clickClose() {
		await this.closeButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click reopen button")
	async clickReopen() {
		await this.reopenButton.click();
	}
}
