import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "./base/base.modal";

export class CreateOrderPage extends BaseModal {
  readonly createOrderPageTitle = this.page.locator("h5");
  readonly customerField = this.page.locator('[id="inputCustomerOrder"]');
  readonly productField = this.page.locator('[id="edit-products-section"]');
  readonly addProductButton = this.page.locator('[id="add-product-btn"]');
  readonly createButton = this.page.locator("#create-order-btn");
  readonly cancelButton = this.page.locator("#cancel-order-modal-btn");
  readonly totalPriceOrder = this.page.locator("#total-price-order-modal");
  readonly closeModal = this.page.locator('[aria-label="Close"]');

  readonly product1 = this.productField.locator("div").nth(1);
  readonly product2 = this.productField.locator("div").nth(2);
  
  readonly uniqueElement = this.createOrderPageTitle;

  @logStep("Click add product button")
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep("Click Create Order button")
  async clickAddNewOrder() {
    await this.createButton.click();
  }

  @logStep("Click cancel button")
  async clickCancelCreateOrder() {
    await this.cancelButton.click();
  }
}