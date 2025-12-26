import { IAddressDelivery } from "data/types/order.types";
import { BaseModal } from "./base/base.modal";

export class EditCustomerModal extends BaseModal {
	readonly container = this.page.locator("#delivery-container");
	readonly uniqueElement = this.container;

	readonly typeSelect = this.page.locator("#inputType");
	readonly locationSelect = this.page.locator("#inputLocation");
	readonly countryInput = this.page.locator("#inputCountry");
	readonly cityInput = this.page.locator("#inputCity");
	readonly streetInput = this.page.locator("#inputStreet");
	readonly houseInput = this.page.locator("#inputHouse");
	readonly flatInput = this.page.locator("#inputFlat");
	readonly saveDeliveryButton = this.page.locator("#save-delivery");
	readonly backToOrderDetailsButton = this.page.locator("#back-to-order-details-page");

	async fillAddress(address: IAddressDelivery) {
		await this.fillCoutry(address.country);
		await this.fillCity(address.city);
		await this.fillStreet(address.street);
		await this.fillHouse(address.house);
		await this.fillFlat(address.flat);
	}

	async selectType(type: "Delivery" | "Pickup") {
		await this.typeSelect.selectOption(type);
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
		await this.locationSelect.selectOption(location);
	}

	async fillCoutry(country: string) {
		await this.countryInput.fill(country);
	}

	async fillCity(city: string) {
		await this.cityInput.fill(city);
	}

	async fillStreet(address: string) {
		await this.streetInput.fill(address);
	}

	async fillHouse(house: number) {
		await this.houseInput.fill(String(house));
	}

	async fillFlat(flat: number) {
		await this.flatInput.fill(String(flat));
	}

	async saveChanges() {
		await this.saveDeliveryButton.click();
	}

	async backToOrderDetails() {
		await this.backToOrderDetailsButton.click();
	}
}
