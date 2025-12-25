import { IOrderInTable, OrdersTableHeader, OrderStatus } from "data/types/order.types";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils";
import { CreateOrderModal } from "pages/orders/createOrder.modal";
import { ReopenModal } from "pages/reOpenOder.modal";
import { FilterModal } from "pages/filter.modal";
import { ExportDataModal } from "pages/exportData.modal";

export class OrdersListPage extends SalesPortalPage {
	readonly filterModal = new FilterModal(this.page);
	readonly exportDataModal = new ExportDataModal(this.page);
	readonly createOrderModal = new CreateOrderModal(this.page);
	readonly reopenModal = new ReopenModal(this.page);

	readonly createOrderButton = this.page.locator("button[name='add-button']");
	readonly uniqueElement = this.createOrderButton;
	readonly title = this.page.locator("#title h2");
	readonly searchInput = this.page.locator("input#search");
	readonly searchButton = this.page.locator("#search-orders");
	readonly filterButton = this.page.locator("#filter");
	readonly exportButton = this.page.locator("#export");

	readonly table = this.page.locator("#table-orders");
	readonly tableHeader = this.page.locator("thead th div[current]");
	readonly tableHeaderName = (name: OrdersTableHeader) => this.tableHeader.filter({ hasText: name });

	readonly tableRow = this.page.locator("tbody tr");
	readonly tableRowByOrderNumber = (orderId: string) =>
		this.tableRow.filter({ has: this.page.locator("td", { hasText: orderId }) });

	readonly tableRowsByEmail = (email: string) =>
		this.tableRow.filter({ has: this.page.locator("td", { hasText: email }) });

	readonly detailsButton = (orderId: string) => this.tableRowByOrderNumber(orderId).getByTitle("Details");
	readonly reopenButton = (orderId: string) => this.tableRowByOrderNumber(orderId).getByTitle("Reopen");

	readonly filtredOrdersButtons = this.page.locator("#chip-buttons > div");

	@logStep("Click Create Order Button")
	async clickCreateOrder() {
		await this.createOrderButton.click();
	}

	@logStep("Click Filter Button")
	async clickFilter() {
		await this.filterButton.click();
	}

	@logStep("Click Export Button")
	async clickExport() {
		await this.exportButton.click();
	}

	@logStep("Click Table Header on Order List page")
	async clickTableHeader(name: OrdersTableHeader) {
		await this.tableHeaderName(name).click();
	}

	@logStep("Fill Search Input on Order List page")
	async fillSearchInput(text: string) {
		await this.searchInput.fill(text);
	}

	@logStep("Click Search Button on Order List page")
	async clickSearch() {
		await this.searchButton.click();
	}

	@logStep("Click Details Button")
	async clickDetailsByOrderId(orderId: string) {
		await this.detailsButton(orderId).click();
	}

	@logStep("Click Reopen Button")
	async clickReopenByOrderId(orderId: string) {
		await this.reopenButton(orderId).click();
	}

	@logStep("Get all order data from Orders List")
	async getTableData(): Promise<IOrderInTable[]> {
		const data: IOrderInTable[] = [];

		const rows = await this.tableRow.all();
		for (const row of rows) {
			const [orderId, email, price, delivery, status, assignedManager, createdOn] = await row
				.locator("td")
				.allInnerTexts();
			data.push({
				_id: orderId!,
				email: email!,
				price: +price!.replace("$", ""),
				delivery: delivery!,
				status: status as OrderStatus,
				assignedManager: assignedManager!,
				createdOn: createdOn!,
			});
		}
		return data;
	}

	@logStep("Get row data from the Orders List by order id")
	async getOrderData(orderID: string): Promise<IOrderInTable> {
		const [orderId, email, price, delivery, status, assignedManager, createdOn] = await this.tableRowByOrderNumber(
			orderID,
		)
			.locator("td")
			.allInnerTexts();
		return {
			_id: orderId!,
			email: email!,
			price: +price!.replace("$", ""),
			delivery: delivery!,
			status: status as OrderStatus,
			assignedManager: assignedManager!,
			createdOn: createdOn!,
		};
	}
}
