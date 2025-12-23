import { Page } from "@playwright/test";
import { STATUS_CODES } from "data/statusCodes";
import { IOrdersMock } from "data/types/order.types";

export class Mock {
	constructor(private page: Page) {}
	async ordersListPage(body: IOrdersMock, statusCode: STATUS_CODES = STATUS_CODES.OK) {
		this.page.route(/\/api\/orders(\?.*)?$/, async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}
}
