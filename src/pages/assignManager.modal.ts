import { logStep } from "utils/report/logStep.utils";
import { ConfirmationModal } from "./confirmation.modal";

export class AssignedManagerModal extends ConfirmationModal {
	readonly uniqueElement = this.page.locator(".modal-content");

	readonly title = this.uniqueElement.locator("h5");
	readonly searchField = this.uniqueElement.locator("#manager-search-input");
	readonly managerList = this.uniqueElement.locator("#manager-list");
	readonly managerByID = (id: string) => this.managerList.locator(`//li[@data-managerid="${id}"]`);
	readonly saveButton = this.uniqueElement.locator(".btn-primary");
	readonly closeButton = this.uniqueElement.locator("button.hover-danger");

	@logStep("Click close button")
	async clickClose() {
		await this.closeButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click save button")
	async clickSave() {
		await this.saveButton.click();
	}

	@logStep("Click search field")
	async clickSearchField(value: string) {
		await this.searchField.fill(value);
	}

	@logStep("Click on manager by id")
	async clickManagerById(id: string) {
		await this.managerByID(id).click();
	}
}
