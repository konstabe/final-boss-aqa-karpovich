import { logStep } from "utils/report/logStep.utils";
import { BaseModal } from "./base/base.modal";
import { Locator } from "@playwright/test";

export class ExportDataModal extends BaseModal {
	readonly uniqueElement = this.page.locator("#exportModal");

	readonly title = this.uniqueElement.locator("h5");
	readonly downloadButton = this.uniqueElement.locator("#export-button");
	readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");
	readonly closeButton = this.uniqueElement.locator("button.btn-close");
	readonly selectAll = this.uniqueElement.locator("#select-all-fields");
	private formatRadioXpath(format: string): Locator {
		return this.uniqueElement.locator(`//*[@value='${format}']`);
	}
	private fieldToInclude(value: string): Locator {
		return this.uniqueElement.locator(`//*[@value='${value}']`);
	}

	@logStep("Click close button")
	async clickClose() {
		await this.closeButton.click();
	}

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click download button")
	async clickDownload() {
		await this.downloadButton.click();
	}
	//умышленно не сделал обязательные варианты, так как видится, что метод можно вызвать 2 раза для выбора формата и откуда
	//экспортить
	@logStep("Choose file format for download")
	async chooseFileFormat(format: string) {
		await this.formatRadioXpath(format).click();
	}

	@logStep("Choose fields for download")
	async chooseFieldsForExport(fields: string[]) {
		for (const field of fields) {
			await this.fieldToInclude(field).click();
		}
	}

	@logStep("Choose all fields for download")
	async chooseAllFieldsForExport() {
		await this.selectAll.click();
	}
}
