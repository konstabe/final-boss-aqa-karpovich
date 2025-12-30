import { SalesPortalPage } from "pages/salesPortal.page";
import { parseSummaryCell } from "utils/parseCells";
import { CustomerDetailsTitle } from "../common/order.types";
import { logStep } from "utils/report/logStep.utils";

export class OrderDetailsCustomerPage extends SalesPortalPage {
	readonly customerSection = this.page.locator("#customer-section");
	readonly uniqueElement = this.customerSection;

	readonly customerDetailsBlocks = this.page.locator("#customer-details .c-details");
	readonly editCustomerButton = this.page.locator("#edit-customer-pencil");
	readonly emailField = this.page.locator("//div[@class='p-3']/div[1]//span[2]");
	readonly nameField = this.page.locator("//div[@class='p-3']/div[2]//span[2]");

	@logStep("Get customer details")
	async getCustomerDetails() {
		const texts = await this.customerDetailsBlocks.allTextContents();

		return texts.map((text) =>
			parseSummaryCell(
				text,
				(label) => label as CustomerDetailsTitle,
				(value) => value as string,
			),
		);
	}

	@logStep("Open change customer modal")
	async openChangeCustomerModal() {
		await this.editCustomerButton.click();
	}
}
