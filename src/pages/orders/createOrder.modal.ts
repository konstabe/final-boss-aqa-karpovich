import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "../base/base.modal";
import { expect } from "@playwright/test";

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

	@logStep("Select customer and product for order")
	async selectCustomerAndProduct(initialCustomerName: string, initialProductNames: string[]) {
		await this.customerField.selectOption(initialCustomerName);

		const maxProducts = initialProductNames.length > 5 ? 5 : initialProductNames.length;

		if (initialProductNames.length === 1) {
			await this.productField.selectOption(initialProductNames);
		} else if (initialProductNames.length > 1) {
			for (let i = 0; i < maxProducts; i++) {
				const productName = initialProductNames[i];

				let productLocator;
				switch (i) {
					case 0:
						productLocator = this.productField.nth(0);
						break;
					case 1:
						await this.addProductButton.click();
						productLocator = this.productField.nth(1);
						break;
					case 2:
						await this.addProductButton.click();
						productLocator = this.productField.nth(2);
						break;
					case 3:
						await this.addProductButton.click();
						productLocator = this.productField.nth(3);
						break;
					case 4:
						await this.addProductButton.click();
						productLocator = this.productField.nth(4);
						break;
					default:
						continue;
				}

				await productLocator.selectOption(productName!);
			}
		}
	}

	@logStep("get Product Index By Name")
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

	@logStep("delete Product Index By Name")
	async deleteProductByIndex(index: number): Promise<boolean> {
		const deleteButton = this.deleteProductButton.nth(index);
		await deleteButton.click();

		return true;
	}

	@logStep("delete Product By Name")
	async deleteProductByName(productName: string): Promise<boolean> {
		const productIndex = await this.getProductIndexByName(productName);

		await this.deleteProductByIndex(productIndex);

		return true;
	}

	@logStep("Counting the number of 'Delete' buttons")
	async countDeleteButtons(productNumber: number) {
		await expect(this.deleteProductButton).toHaveCount(productNumber);
	}
}
