import { Locator } from "@playwright/test";
import { SalesPortalPage } from "./salesPortal.page";
import { logStep } from "utils/report/logStep.utils";
import { HomeModuleButton } from "data/types/home.types";

export class HomePage extends SalesPortalPage {
	readonly welcomeText = this.page.locator(".welcome-text");
	readonly productsButton = this.page.locator("#products-from-home");
	readonly customersButton = this.page.locator("#customers-from-home");
	readonly ordersButton = this.page.locator("#orders-from-home");
	readonly uniqueElement = this.welcomeText;

	@logStep("Click View Module Button on Home page")
	async clickOnViewModule(module: HomeModuleButton) {
		const moduleButtons: Record<HomeModuleButton, Locator> = {
			Products: this.productsButton,
			Customers: this.customersButton,
			Orders: this.ordersButton,
		};

		await moduleButtons[module].click();
	}
}
