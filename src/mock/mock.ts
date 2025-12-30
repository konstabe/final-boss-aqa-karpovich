import { Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomerFromResponse } from "data/types/customer.types";
import { IOrderDitailsMock, IOrdersMock } from "data/types/order.types";

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

	async orderDetailsPage(body: IOrderDitailsMock, /*ID: string,*/ statusCode: STATUS_CODES = STATUS_CODES.OK) {
		await this.page.route(apiConfig.baseUrl + apiConfig.endpoints.productById(body.Order._id), async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}

	async ordersCustomerAll(body: ICustomerFromResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
		this.page.route(/\/api\/customers\/all(\?.*)?$/, async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}
}
