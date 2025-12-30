import { Page } from "@playwright/test";
import { ModalsOnOrderDetails } from "data/types/order.types";
import { OrderDetailsHeaderPage } from "pages/orders/orderDetails/orderDetails.header.page";
import { logStep } from "utils/report/logStep.utils";

export class OrdersDetailsUIService {
	orderDetailsHeaderPage: OrderDetailsHeaderPage;

	constructor(private page: Page) {
		this.orderDetailsHeaderPage = new OrderDetailsHeaderPage(page);
	}

	@logStep("Open Orders Details Page by order id")
	async open(orderId: string) {
		await this.orderDetailsHeaderPage.open(`orders/${orderId}`);
		await this.orderDetailsHeaderPage.waitForOpened();
	}

	@logStep("Open Process Order Modal on Order Details Page")
	async openProcessOrderModal() {
		await this.orderDetailsHeaderPage.clickProcessOrder();
		await this.orderDetailsHeaderPage.processOrderModal.waitForOpened();
	}

	@logStep("Close modal by clicking on Close button")
	async closeModal(modalName: ModalsOnOrderDetails) {
		const modal = this.orderDetailsHeaderPage[modalName];
		await modal.clickClose();
		await modal.waitForClosed();
	}

	@logStep("Close modal by clicking on Cancel button")
	async cancelModal(modalName: ModalsOnOrderDetails) {
		const modal = this.orderDetailsHeaderPage[modalName];
		await modal.clickCancel();
		await modal.waitForClosed();
	}
}
