import { Page } from "@playwright/test";
import { CreateOrderModal } from "pages/orders/createOrder.modal";

export class AddNewOrderUIService {
	addNewOrderPage: CreateOrderModal;

	constructor(private page: Page) {
		this.addNewOrderPage = new CreateOrderModal(page);
	}
}
