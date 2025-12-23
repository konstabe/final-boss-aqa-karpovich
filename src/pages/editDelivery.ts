import { Page } from "@playwright/test";
import { BaseModal } from "./base/base.modal";

export class EditCustomerModal extends BaseModal {
	readonly container = this.page.locator("#delivery-container");
	readonly uniqueElement = this.container;

	constructor(page: Page) {
		super(page);
	}

	async selectType(type: "Delivery" | "Pickup") {
		await this.page.selectOption("#inputType", type);
	}

	async pickDate(date: Date) {
		const timestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

		const day = this.page.locator(`.datepicker-days td.day[data-date="${timestamp}"]:not(.disabled)`);

		await day.waitFor({ state: "visible" });
		await day.click();
	}

	async pickDateWithNavigation(date: Date) {
		const target = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

		while ((await this.page.locator(`.datepicker-days td[data-date="${target}"]`).count()) === 0) {
			await this.page.locator(".datepicker-days th.next").click();
		}

		await this.page.locator(`.datepicker-days td.day[data-date="${target}"]:not(.disabled)`).click();
	}

	async selectLocation(location: "Home" | "Other") {
		await this.page.selectOption("#inputLocation", location);
	}

	async fillCoutry(country: string) {
		await this.page.locator("#inputCountry").fill(country);
	}

	async fillCity(city: string) {
		await this.page.locator("#inputCity").fill(city);
	}

	async fillStreet(address: string) {
		await this.page.locator("#inputStreet").fill(address);
	}

	async fillHouse(address: string) {
		await this.page.locator("#inputHouse").fill(address);
	}

	async fillFlat(address: string) {
		await this.page.locator("#inputFlat").fill(address);
	}

	async saveChanges() {
		await this.page.locator("#save-delivery").click();
	}

	async backToOrderDetails() {
		await this.page.locator("#back-to-order-details-page").click();
	}
}
