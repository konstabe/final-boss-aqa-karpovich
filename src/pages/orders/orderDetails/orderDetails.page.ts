import { SalesPortalPage } from "pages/salesPortal.page";
import { OrderDetailsBottomPage } from "pages/orders/orderDetails/orderDetails.bottom.page";
import { OrderDetailsCustomerPage } from "pages/orders/orderDetails/orderDetails.customer.page";
import { OrderDetailsHeaderPage } from "pages/orders/orderDetails/orderDetails.header.page";
import { OrderDetailsProductPage } from "pages/orders/orderDetails/orderDetails.product.page";
import { AssignedManagerModal } from "pages/assignManager.modal";
import { ConfirmationModal } from "pages/confirmation.modal";
import { EditDeliveryModal } from "pages/editDelivery";
import { ReopenModal } from "pages/reOpenOder.modal";
import { CancelOrderModal } from "pages/orders/canсelOrder.modal";
import { EditCustomerModal } from "pages/orders/editCustomer.modal";
import { EditProductModal } from "pages/orders/editProduct.modal";
import { ProcessOrderModal } from "pages/orders/processOrder.modal";

export class OrderDetailsPage extends SalesPortalPage {
	readonly header = new OrderDetailsHeaderPage(this.page);
	readonly customer = new OrderDetailsCustomerPage(this.page);
	readonly product = new OrderDetailsProductPage(this.page);
	readonly bottom = new OrderDetailsBottomPage(this.page);

	readonly processOrderModal = new ProcessOrderModal(this.page);
	readonly assignedManagerModal = new AssignedManagerModal(this.page);
	readonly confirmationModal = new ConfirmationModal(this.page);
	readonly cancelOrderModal = new CancelOrderModal(this.page);
	readonly reopenModal = new ReopenModal(this.page);
	readonly editCustomerModal = new EditCustomerModal(this.page);
	readonly editProductModal = new EditProductModal(this.page);
	readonly editDeliveryModal = new EditDeliveryModal(this.page);

	readonly uniqueElement = this.header.uniqueElement;
}
