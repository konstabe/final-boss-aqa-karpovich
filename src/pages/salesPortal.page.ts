import { expect, Locator } from "@playwright/test";
import { SALES_PORTAL_URL } from "config/env";
import { BasePage } from "./base/base.page";
import { NavBar } from "./navbar";

export abstract class SalesPortalPage extends BasePage {
	readonly navBarMenu = new NavBar(this.page);

	readonly spinner = this.page.locator(".spinner-border");
	readonly toastMessage = this.page.locator(".toast-body");
	readonly navBar = this.page.locator("#main-header");
	readonly closeNotificationButton = this.page.locator(".toast-container button.btn-close");
	abstract readonly uniqueElement: Locator;

	async waitForOpened() {
		await expect(this.uniqueElement).toBeVisible({ timeout: 10000 });
		await this.waitForSpinners();
	}

	async waitForSpinners() {
		await expect(this.spinner).toHaveCount(0, { timeout: 10000 });
	}

	async open(route?: string) {
		await this.page.goto(SALES_PORTAL_URL + route);
	}

	async clickCloseNotification() {
		await this.closeNotificationButton.click();
		await expect(this.toastMessage).not.toBeVisible();
	}
}
