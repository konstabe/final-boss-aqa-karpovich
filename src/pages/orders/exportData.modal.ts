import { Download, expect } from "@playwright/test";
import { ExportDataFields } from "data/types/order.types";
import { BaseModal } from "pages/base/base.modal";
import path from "path";
import { logStep } from "utils/report/logStep.utils";

export class ExportOrderModal extends BaseModal {
	readonly editProductModalTitle = this.page.locator("h5");
	readonly exportFormatForm = this.page.locator("#exportFormatForm");
	readonly csvFormat = this.page.locator("#exportCsv");
	readonly jsonFormat = this.page.locator("#exportJson");
	readonly exportFilteringForm = this.page.locator("#exportFilteringForm");
	readonly exportFilteredToggle = this.page.locator("#export-filtered-toggle");
	readonly exportAllToggle = this.page.locator("#export-all-toggle");
	readonly selectAllFields = this.page.locator("#select-all-fields");
	readonly statusExportField = this.page.locator("#status-export-field");
	readonly totalPriceExportField = this.page.locator("#total_price-export-field");
	readonly deliveryExportField = this.page.locator("#delivery-export-field");
	readonly customerExportField = this.page.locator("#customer-export-field");
	readonly productsExportField = this.page.locator("#products-export-field");
	readonly assignedManagerExportField = this.page.locator("#assignedManager-export-field");
	readonly createdOnExportField = this.page.locator("#createdOn-export-field");
	readonly closeModalIcon = this.page.locator('[aria-label="Close"]');
	readonly cancelButton = this.page.locator(".btn-secondary");
	readonly downloadButton = this.page.locator("#export-button");
	readonly modalBody = this.page.locator(".modal-content");

	readonly uniqueElement = this.editProductModalTitle;

	@logStep("Click download button")
	async clickDownloadButton() {
		await this.downloadButton.click();
		await expect(this.modalBody).not.toBeVisible({ timeout: 10000 });
	}

	@logStep("Click cancel button")
	async clickCancelButton() {
		await this.cancelButton.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Click close modal Icon")
	async clickCloseIcon() {
		await this.closeModalIcon.click();
		await expect(this.modalBody).not.toBeVisible();
	}

	@logStep("Check Select AllFields")
	async checkSelectAllFields() {
		await this.selectAllFields.click();
	}

	@logStep("Select fields")
	async selectFields(checkbox: ExportDataFields) {
		if (checkbox === "Status") await this.statusExportField.click();
		if (checkbox === "Total Price") await this.totalPriceExportField.click();
		if (checkbox === "Delivery") await this.deliveryExportField.click();
		if (checkbox === "Customer") await this.customerExportField.click();
		if (checkbox === "Products") await this.productsExportField.click();
		if (checkbox === "Assigned Manager") await this.assignedManagerExportField.click();
		if (checkbox === "Created On") await this.createdOnExportField.click();
	}

	@logStep("Select file format")
	async selectFileFormat(radio: "CSV" | "JSON") {
		if (radio === "CSV") await this.csvFormat.click();
		if (radio === "JSON") await this.jsonFormat.click();
	}

	@logStep("Download file")
	async downloadFile(format: "CSV" | "JSON"): Promise<{
		download: Download;
		fileName: string;
	}> {
		await this.selectFileFormat(format);

		const downloadPromise = this.page.waitForEvent("download");

		await this.downloadButton.click();

		const download = await downloadPromise;

		const fileName = download.suggestedFilename();

		const downloadDir = process.cwd() + "/test-results/download";

		const filePath = path.join(downloadDir, fileName);
		await download.saveAs(filePath);

		return { download, fileName };
	}
}
