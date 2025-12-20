import { logStep } from "utils/report/logStep.utils";
import { BasePage } from "./base/base.page";

export type Modules = "Home" | "Products" | "Customers" | "Orders" | "Managers";

export class NavBar extends BasePage {
	readonly navigationBar = this.page.locator("#main-header");
	readonly moduleByName = (moduleName: Modules) =>
		this.navigationBar.locator(`a[name="${moduleName.toLowerCase()}"]`);

	@logStep("Click Module on Navigation Menu")
	async clickModule(modulesName: Modules) {
		await this.moduleByName(modulesName).click();
	}
}
