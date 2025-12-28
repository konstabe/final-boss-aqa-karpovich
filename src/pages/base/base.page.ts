import { Page } from "@playwright/test";
import { IResponse } from "api/core/types";

export abstract class BasePage {
	constructor(protected page: Page) {}

	async interceptRequest<T extends unknown[]>(url: string, triggerAction: (...args: T) => Promise<void>, ...args: T) {
		const [request] = await Promise.all([
			this.page.waitForRequest((request) => request.url().includes(url)),
			triggerAction(...args),
		]);
		return request;
	}

	async interceptResponse<U extends object | null, T extends unknown[]>(
		url: string,
		triggerAction: (...args: T) => Promise<void>,
		...args: T
	): Promise<IResponse<U>> {
		const [response] = await Promise.all([
			this.page.waitForResponse((response) => response.url().includes(url)),
			triggerAction(...args),
		]);
		const status = response.status();
		const headers = response.headers();
		let body: U = null as U;
		const isRedirect = status >= 300 && status < 400;
		const hasBody = status !== 204 && status !== 304 && !isRedirect;
		const contentType = headers["content-type"] ?? "";
		if (hasBody && contentType.includes("application/json")) {
			try {
				body = (await response.json()) as U;
			} catch {
				body = null as U;
			}
		}
		return {
			status,
			headers,
			body,
		};
	}

	async getAuthToken() {
		const token = (await this.page.context().cookies()).find((c) => c.name === "Authorization")!.value;
		return token;
	}
}
