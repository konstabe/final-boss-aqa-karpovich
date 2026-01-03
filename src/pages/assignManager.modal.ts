import { logStep } from "utils/report/logStep.utils";
import { ConfirmationModal } from "./confirmation.modal";

export class AssignedManagerModal extends ConfirmationModal {
	readonly uniqueElement = this.page.locator(".modal-content");

	readonly title = this.uniqueElement.locator("h5");
	readonly searchField = this.uniqueElement.locator("#manager-search-input");
	readonly managerList = this.uniqueElement.locator("#manager-list");
	readonly managerById = (id: string) => this.managerList.locator(`[data-managerid="${id}"]`);
	readonly managerItems = this.managerList.locator("[data-managerid]");
	readonly managerItemByIndex = (index: number) => this.managerItems.nth(index);

	readonly saveButton = this.uniqueElement.locator(".btn-primary");
	readonly closeButton = this.uniqueElement.locator("button.hover-danger");

	@logStep("Search manager by name")
	async searchManagerByName(name: string) {
		await this.searchField.fill(name);
	}

	@logStep("Select manager by id")
	async selectManagerById(id: string) {
		await this.managerById(id).click();
	}

	@logStep("Select first available manager")
	async selectFirstManager() {
		await this.managerItemByIndex(0).click();
	}

	@logStep("Select manager by index")
	async selectManagerByIndex(index: number) {
		await this.managerItemByIndex(index).click();
	}

	@logStep("Get manager id by index")
	async getManagerIdByIndex(index: number) {
		return this.managerItemByIndex(index).getAttribute("data-managerid");
	}

	@logStep("Get managers count")
	async getManagerCount() {
		return this.managerItems.count();
	}

	@logStep("Assign manager")
	async assignManager() {
		await this.saveButton.click();
	}

	@logStep("Close modal")
	async close() {
		await this.closeButton.click();
	}
}
