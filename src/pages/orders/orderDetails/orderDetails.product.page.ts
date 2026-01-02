import { SalesPortalPage } from "pages/salesPortal.page";
import { parseSummaryCell } from "utils/parseCells";
import { ProductDetailsTitle } from "../common/order.types";
import { logStep } from "utils/report/logStep.utils";
import { expect } from "fixtures";

export class OrderDetailsProductPage extends SalesPortalPage {
	readonly productSection = this.page.locator("#products-section");
	readonly uniqueElement = this.productSection;
	readonly editProductsButton = this.page.locator("#edit-products-pencil");
	readonly receiveOrderButton = this.page.locator("#start-receiving-products");
	readonly selectAllCheckbox = this.page.locator("#selectAll");
	readonly saveReceivedProductsButton = this.page.locator("#save-received-products");

	readonly cancelReceivedProductsButton = this.page.locator("#cancel-receiving");
	readonly receivedAccordion = this.page.locator(`#products-section .accordion`);
	readonly receivedAccordionLabel = (index: number) =>
		this.receivedAccordion.nth(index).locator(".accordion-header .received-label");
	readonly receivedRow = this.receivedAccordion.locator(".received-label");
	readonly row = this.page.locator(".accordion-header .received-label");

	async toggleProductCheckbox(index: number) {
		const checkbox = this.page.locator('input[name="product"]').nth(index);
		await checkbox.click();
	}
	async expectReceivedStatus(index: number, expectedStatus: "Received" | "Not Received") {
		await expect(this.receivedAccordionLabel(index)).toHaveText(expectedStatus);
	}

	readonly productDetailsHeader = (id: number) => this.page.locator(`#heading${id}`);
	readonly productsDetailsInOrder = this.page.locator("#products-accordion-section");
	readonly productDetailsBlocks = (id: number) => this.page.locator(`[aria-labelledby="heading${id}"] .c-details`);

	@logStep("Change state product details by id")
	async changeStateProductDetailsById(id: number = 0) {
		await this.productDetailsHeader(id).click();
	}

	@logStep("Get product details")
	async getProductDetails(id: number = 0) {
		const texts = await this.productDetailsBlocks(id).allTextContents();

		return texts.map((text) =>
			parseSummaryCell(
				text,
				(label) => label as ProductDetailsTitle,
				(value) => value as string,
			),
		);
	}

	@logStep("Open edit product details modal")
	async openEditProductDetailsModal() {
		await this.editProductsButton.click();
	}
}
