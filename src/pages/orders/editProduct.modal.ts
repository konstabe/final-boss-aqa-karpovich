import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";

export class EditProductPage extends BaseModal {
	readonly editProductPageTitle = this.page.locator("h5");
	readonly productField = this.page.locator("#edit-products-section");
	readonly saveButton = this.page.locator("#update-products-btn");
	readonly cancelButton = this.page.locator("#cancel-edit-products-modal-btn");
	readonly addProductButton = this.page.locator("add-product-btn");
	readonly closeModal = this.page.locator('[aria-label="Close"]');
	readonly totalPriceOrder = this.page.locator("#total-price-order-modal");

	readonly product1 = this.productField.locator("/div[1]/div[1]");
	readonly product2 = this.productField.locator("/div[2]/div[1]");

	readonly uniqueElement = this.editProductPageTitle;

	@logStep("Click save button")
	async clickSave() {
		await this.saveButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click on a product dropdown")
	async clickFirstProduct() {
		await this.product1.click();
	}
}
