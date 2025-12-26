import { ConfirmationModal } from "pages/confirmation.modal";
import { logStep } from "utils/report/logStep.utils";

export class ProcessOrderModal extends ConfirmationModal {
	readonly processButton = this.uniqueElement.locator(".btn-primary");
	//все остальное есть в ConfirmationModal

	@logStep("Click Process Order button")
	async clickConfirm() {
		await this.processButton.click();
	}
}
