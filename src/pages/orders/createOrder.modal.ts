import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";
import { expect } from "@playwright/test";
import { UpToFive } from "data/types/core.types";

export class CreateOrderModal extends BaseModal {
	readonly createOrderPageTitle = this.page.locator("h5");
	readonly customerField = this.page.locator('[id="inputCustomerOrder"]');
	readonly productField = this.page.locator('select[name="Product"]');
	readonly addProductButton = this.page.locator('[id="add-product-btn"]');
	readonly createButton = this.page.locator("#create-order-btn");
	readonly cancelButton = this.page.locator("#cancel-order-modal-btn");
	readonly totalPriceOrder = this.page.locator("#total-price-order-modal");
	readonly closeModal = this.page.locator('[aria-label="Close"]');
	readonly deleteProductButton = this.page.locator(".del-btn-modal");

	readonly uniqueElement = this.createOrderPageTitle;

	@logStep("Click add product button")
	async clickAddProduct() {
		await this.addProductButton.click();
	}

	@logStep("Click Create Order button")
	async clickCreate() {
		await this.createButton.click();
	}

	@logStep("Click cancel button")
	async clickCancelCreateOrder() {
		await this.cancelButton.click();
	}

	@logStep("Click close icon for create order modal window")
	async clickCloseModal() {
		await this.closeModal.click();
	}

	@logStep("Select customer and product for order")
	async selectCustomerAndProduct(initialCustomerName: string, initialProductNames: UpToFive<string> | string[]) {
		await this.customerField.selectOption(initialCustomerName);

		if (initialProductNames.length === 1) {
			await this.productField.selectOption(initialProductNames[0]!);
		} else if (initialProductNames.length > 1) {
			for (let i = 0; i < initialProductNames.length; i++) {
				if (i > 0) {
					await this.addProductButton.click();
				}
				await this.productField.nth(i).selectOption(initialProductNames[i]!);
			}
		}
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
