import { logStep } from "utils/report/logStep.utils";
import { BasePage } from "./base/base.page";

export type Modules = "Home" | "Products" | "Customers" | "Orders" | "Managers";

export class NavBar extends BasePage {
	readonly modules = this.page.locator(".d-none div[name='module-item'] a");
	readonly moduleByName = (modulesName: Modules) => this.modules.filter({ hasText: modulesName });

	@logStep("Click Module on Navigation Menu")
	async clickModule(modulesName: Modules) {
		await this.moduleByName(modulesName).click();
	}
}
