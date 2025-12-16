import { ICredentials } from "data/types/credentials.types.js";
import { logStep } from "utils/report/logStep.utils.js";
import { SalesPortalPage } from "./salesPortal.page.js";

export class LoginPage extends SalesPortalPage {
	readonly emailInput = this.page.locator("#emailinput");
	readonly passwordInput = this.page.locator("#passwordinput");
	readonly loginButton = this.page.locator("button[type='submit']");
	readonly uniqueElement = this.page.locator("#signInPage");

	@logStep("Fill credentials")
	async fillCredentials(credentials: Partial<ICredentials>) {
		if (credentials.username) await this.emailInput.fill(credentials.username);
		if (credentials.password) await this.passwordInput.fill(credentials.password);
	}

	@logStep("Click login button")
	async clickLogin() {
		await this.loginButton.click();
	}
}
