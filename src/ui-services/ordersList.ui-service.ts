import { Page } from "@playwright/test";
import { OrdersModalName } from "data/types/order.types";
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

	@logStep("Close Modal")
	async closeModal(modalName: OrdersModalName) {
		const modal = this.ordersListPage[modalName];
		await modal.clickClose();
		await modal.waitForClosed();
	}

	@logStep("Cancel Modal")
	async cancelModal(modalName: OrdersModalName) {
		const modal = this.ordersListPage[modalName];
		await modal.clickCancel();
		await modal.waitForClosed();
	}

	@logStep("Open Reopen Modal on Orders List Page")
	async clickReopenOrder(orderId: string) {
		await this.ordersListPage.clickReopenByOrderId(orderId);
		await this.ordersListPage.reopenModal.waitForOpened();
	}

	@logStep("Open Filter Modal on Orders List Page")
	async openFilterModal() {
		await this.ordersListPage.clickFilter();
		await this.ordersListPage.filterModal.waitForOpened();
	}
}
