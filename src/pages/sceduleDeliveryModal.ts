import { logStep } from "utils/report/logStep.utils";
import { ConfirmationModal } from "./confirmation.modal";
import { ConditionDelivery } from "../data/types/order.types";
import { COUNTRIES } from "../data/customers/countries";
import { getRandomItemsFromArray } from "utils/getRandom.utils";

export class ScheduleDeliveryModal extends ConfirmationModal {
	readonly uniqueElement = this.page.locator("#delivery-container");

	readonly title = this.uniqueElement.locator("h2");
	readonly saveDeliveryButton = this.uniqueElement.locator("#save-delivery");
	readonly deliveryType = this.uniqueElement.locator("select#inputType");
	readonly date = this.uniqueElement.locator("#datepicker"); //date
	readonly availableDays = this.page.locator(".datepicker-days td:not(.disabled)");
	readonly dateInput = this.uniqueElement.locator("#date-input");
	readonly monthAndYear = this.page.locator(".datepicker-days th.datepicker-switch");
	readonly country = this.uniqueElement.locator("#selectCountry"); // dropdown with existed countries
	readonly city = this.uniqueElement.locator("#inputCity");
	readonly street = this.uniqueElement.locator("#inputStreet");
	readonly house = this.uniqueElement.locator("#inputHouse");
	readonly flat = this.uniqueElement.locator("#inputFlat");

	@logStep("Click cancel button")
	async clickCancel() {
		await this.cancelButton.click();
	}

	@logStep("Click save delivery button")
	async clickSaveDelivery() {
		await this.saveDeliveryButton.click();
	}

	@logStep("Select deliveryType")
	async selectDeliveryMethod(method: ConditionDelivery) {
		await this.deliveryType.selectOption(method);
	}

	@logStep("Click date picker button")
	async clickDate() {
		await this.date.click();
	}

	@logStep("Click country button")
	async clickCountry(country: COUNTRIES) {
		await this.country.selectOption(country);
	}

	@logStep("Click city field")
	async clickCity(value: string) {
		await this.city.fill(value);
	}

	@logStep("Click street field")
	async clickStreet(value: string) {
		await this.street.fill(value);
	}

	@logStep("Click house field")
	async clickHouse(value: string) {
		await this.house.fill(value);
	}

	@logStep("Click flat field")
	async clickFlat(value: string) {
		await this.flat.fill(value);
	}

	@logStep("Click first available day in calendar")
	async clickFirstAvailableDay() {
		await this.availableDays.first().click();
	}

	@logStep("Get all available days in calendar")
	async getAllAvailableDays() {
		const dates = await this.availableDays.allInnerTexts();
		return dates;
	}

	@logStep("Get random available day in calendar")
	async getRandomAvailableDay() {
		const availableDays: string[] = await this.getAllAvailableDays();
		const randomDay = getRandomItemsFromArray(availableDays, 1);
		return randomDay[0];
	}

	@logStep("Click random available day in calendar")
	async clickAvailableDay(day: string) {
		await this.availableDays.getByText(day).click();
	}

	@logStep("Get month and year from calendar")
	async getMonthAndYear() {
		const date = await this.monthAndYear.innerText();
		return date;
	}
}
