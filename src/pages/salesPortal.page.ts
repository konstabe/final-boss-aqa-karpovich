import { expect, Locator } from "@playwright/test";
import { SALES_PORTAL_URL } from "config/env";
import { BasePage } from "./base/base.page";

export abstract class SalesPortalPage extends BasePage {
	readonly spinner = this.page.locator(".spinner-border");
	readonly toastMessage = this.page.locator(".toast-body");
	readonly navBar = this.page.locator("#main-header");
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
}
