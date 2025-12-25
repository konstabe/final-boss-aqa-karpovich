import { SalesPortalPage } from "pages/salesPortal.page";
import { parseSummaryCell } from "utils/parseCells";
import { ProductDetailsTitle } from "../common/order.types";
import { logStep } from "utils/report/logStep.utils";

export class OrderDetailsProductPage extends SalesPortalPage {
	readonly productSection = this.page.locator("#products-section");
	readonly uniqueElement = this.productSection;
	readonly editProductsButton = this.page.locator("#edit-products-pencil");

	readonly productDetailsHeader = (id: number) => this.page.locator(`#heading${id}`);
	readonly productDetailsBlocks = (id: number) => this.page.locator(`#heading${id} .c-details`);

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
