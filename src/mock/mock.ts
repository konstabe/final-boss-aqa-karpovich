import { Page } from "@playwright/test";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomerFromResponse } from "data/types/customer.types";
import { IOrderResponse, IOrdersMock } from "data/types/order.types";
import { IProductsResponse } from "data/types/product.types";

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

	async orderDetailsPage(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
		const url = new RegExp(`/api/orders/${body.Order._id}/?(\\?.*)?$`);
		this.page.route(url, async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}

	async orderDetailsAllCustomer(body: ICustomerFromResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
		const url = new RegExp(`/api/customers/all/?(\\?.*)?$`);
		this.page.route(url, async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}

	async orderDetailsAllProduct(body: IProductsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
		const url = new RegExp(`/api/products/all/?(\\?.*)?$`);
		this.page.route(url, async (route) => {
			await route.fulfill({
				status: statusCode,
				contentType: "application/json",
				body: JSON.stringify(body),
			});
		});
	}
}
