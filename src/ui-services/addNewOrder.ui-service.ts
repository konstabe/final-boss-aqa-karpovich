import { Page } from "@playwright/test";
import { CreateOrderModal } from "pages/orders/createOrder.modal";
import { OrderDetailsPage } from "pages/orders/orderDetails/orderDetails.page";
import { logStep } from "utils/report/logStep.utils";

export class AddNewOrderUIService {
	addNewOrderPage: CreateOrderModal;

	constructor(private page: Page) {
		this.addNewOrderPage = new CreateOrderModal(page);
	}
}

export class OrderDetailsUIService {
	orderDetailsPage: OrderDetailsPage;

	constructor(private page: Page) {
		this.orderDetailsPage = new OrderDetailsPage(page);
	}

	@logStep("Open Orders List Page")
	async open(orderId: string) {
		await this.orderDetailsPage.open("orders/" + orderId);
		await this.orderDetailsPage.waitForOpened();
	}
}
