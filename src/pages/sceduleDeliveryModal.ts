import { logStep } from "utils/report/logStep.utils";
import { ConfirmationModal } from "./confirmation.modal";
import { ConditionDelivery } from "../data/types/order.types";
import { COUNTRIES } from "../data/customers/countries";

export class ScheduleDeliveryModal extends ConfirmationModal {
	readonly uniqueElement = this.page.locator("#delivery-container");

	readonly title = this.uniqueElement.locator("h2");
	readonly saveDeliveryButton = this.uniqueElement.locator("#inputType");
	readonly deliveryType = this.uniqueElement.locator("#selectDeliveryType");
	readonly date = this.uniqueElement.locator("#datepicker"); //date
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

	@logStep("Click deliveryType dropdown")
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
}
