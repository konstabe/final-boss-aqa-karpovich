import { Page } from "@playwright/test";
import { OrdersListPage } from "pages/orders/ordersList.page";
import { logStep } from "utils/report/logStep.utils";

export class OrdersListUIService {
	ordersListPage: OrdersListPage;

	constructor(private page: Page) {
		this.ordersListPage = new OrdersListPage(page);
	}

	@logStep("Open Orders List Page")
	async open() {
		await this.ordersListPage.open("orders");
		await this.ordersListPage.waitForOpened();
	}
}
