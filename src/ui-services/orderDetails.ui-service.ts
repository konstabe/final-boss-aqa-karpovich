import { Page } from "@playwright/test";
import { ModalsOnOrderDetails } from "data/types/order.types";
import { OrderDetailsPage } from "pages/orders/orderDetails/orderDetails.page";
import { logStep } from "utils/report/logStep.utils";

export class OrdersDetailsUIService {
	orderDetailsPage: OrderDetailsPage;

	constructor(private page: Page) {
		this.orderDetailsPage = new OrderDetailsPage(page);
	}

	@logStep("Open Orders Details Page by order id")
	async open(orderId: string) {
		await this.orderDetailsPage.open(`orders/${orderId}`);
		await this.orderDetailsPage.waitForOpened();
	}

	@logStep("Open Process Order Modal on Order Details Page")
	async openProcessOrderModal() {
		await this.orderDetailsPage.header.clickProcessOrder();
		await this.orderDetailsPage.processOrderModal.waitForOpened();
	}

	@logStep("Close modal by clicking on Close button")
	async closeModal(modalName: ModalsOnOrderDetails) {
		const modal = this.orderDetailsPage[modalName];
		await modal.clickClose();
		await modal.waitForClosed();
	}

	@logStep("Close modal by clicking on Cancel button")
	async cancelModal(modalName: ModalsOnOrderDetails) {
		const modal = this.orderDetailsPage[modalName];
		await modal.clickCancel();
		await modal.waitForClosed();
	}

	@logStep("Open Delivery modal on Order Details Page")
	async openDeliveryModal() {
		await this.orderDetailsPage.bottom.openScheduleDeliveryModal();
		await this.orderDetailsPage.scheduleDeliveryModal.waitForOpened();
	}

	@logStep("Save Delivery")
	async saveDelivery() {
		await this.orderDetailsPage.scheduleDeliveryModal.clickSaveDelivery();
		await this.orderDetailsPage.scheduleDeliveryModal.waitForClosed();
	}
}
