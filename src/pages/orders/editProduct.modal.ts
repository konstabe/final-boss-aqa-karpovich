import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";
import { expect } from "@playwright/test";

export class EditProductPage extends BaseModal {
	readonly editProductPageTitle = this.page.locator("h5");
	readonly productField = this.page.locator('select[name="Product"]');
	readonly addProductButton = this.page.locator("add-product-btn");
	readonly cancelButton = this.page.locator("#cancel-edit-products-modal-btn");
	readonly totalPriceOrder = this.page.locator("#total-price-order-modal");
	readonly closeModal = this.page.locator('[aria-label="Close"]');
	readonly deleteProductButton = this.page.locator(".del-btn-modal");
	readonly saveButton = this.page.locator("#update-products-btn");

	readonly uniqueElement = this.editProductPageTitle;

	@logStep("Click save button")
	async clickSave() {
		await this.saveButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click close icon for edit product modal window")
	async clickCloseModal() {
		await this.closeModal.click();
	}

	@logStep("Get Product Index By Name")
	async getProductIndexByName(productName: string): Promise<number> {
		const productFields = this.productField;
		const count = await productFields.count();

		for (let i = 0; i < count; i++) {
			const value = await productFields.nth(i).inputValue();
			if (value === productName) {
				return i;
			}
		}

		return -1;
	}

	@logStep("Delete Product Index By Name")
	async deleteProductByIndex(index: number) {
		const deleteButton = this.deleteProductButton.nth(index);
		await deleteButton.click();
	}

	@logStep("Delete Product By Name")
	async deleteProductByName(productName: string) {
		const productIndex = await this.getProductIndexByName(productName);
		await this.deleteProductByIndex(productIndex);
	}

	@logStep("Counting the number of 'Delete' buttons")
	async verifyCountOfDeleteButtons(productNumber: number) {
		await expect(this.deleteProductButton).toHaveCount(productNumber);
	}
}
