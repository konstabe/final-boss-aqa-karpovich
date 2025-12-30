import {
	test as base,
	expect,
	// Page
} from "@playwright/test";
import { OrdersListPage } from "pages/orders/ordersList.page";
import { LoginPage } from "pages/login.page";
import { HomePage } from "pages/home.page";
import { LoginUIService } from "ui-services/login.ui-service";
import { OrdersListUIService } from "ui-services/ordersList.ui-service";
import { CreateOrderModal } from "pages/orders/createOrder.modal";
import { AddNewOrderUIService } from "ui-services/addNewOrder.ui-service";
import { HomeUIService } from "ui-services/home.ui-service";
import { OrderDetailsHeaderPage } from "pages/orders/orderDetails/orderDetails.header.page";
import { OrderDetailsBottomPage } from "pages/orders/orderDetails/orderDetails.bottom.page";
import { OrderDetailsCustomerPage } from "pages/orders/orderDetails/orderDetails.customer.page";
import { OrderDetailsProductPage } from "pages/orders/orderDetails/orderDetails.product.page";
import { AssignedManagerModal } from "pages/assignManager.modal";
import { ConfirmationModal } from "pages/confirmation.modal";
import { EditDeliveryModal } from "pages/editDelivery";
import { OrdersDetailsUIService } from "ui-services/orderDetails.ui-service";
import { ReopenModal } from "pages/reOpenOder.modal";
import { CancelOrderModal } from "pages/orders/canсelOrder.modal";
import { EditCustomerModal } from "pages/orders/editCustomer.modal";
import { EditProductModal } from "pages/orders/editProduct.modal";
// import { AddNewCustomerPage } from "pages/customers/addNewCustomer.page";
// import { CustomersListPage } from "pages/customers/customersList.page";
// import { AddNewProductPage } from "pages/products/addNewProduct.page";
// import { EditProductPage } from "pages/products/editProduct.page";
// import { ProductsListPage } from "pages/products/productsList.page";
// import { AddNewCustomertUIService } from "service/addNewCustomer.ui-service";
// import { AddNewProductUIService } from "service/addNewProduct.ui-service";
// import { CustomersListUIService } from "service/customersList.ui-service";
// import { HomeUIService } from "service/home.ui-service";
// import { ProductsListUIService } from "service/productsList.ui-service";

export interface IPages {
	//pages
	loginPage: LoginPage;
	homePage: HomePage;
	// productsListPage: ProductsListPage;
	// addNewProductPage: AddNewProductPage;
	// editProductPage: EditProductPage;
	// addNewCustomerPage: AddNewCustomerPage;
	// customersListPage: CustomersListPage;
	editCustomerModal: EditCustomerModal;
	editProductModal: EditProductModal;
	cancelOrderModal: CancelOrderModal;
	ordersListPage: OrdersListPage;

	orderDetailsHeaderPage: OrderDetailsHeaderPage;
	orderDetailsBottomPage: OrderDetailsBottomPage;
	orderDetailsCustomerPage: OrderDetailsCustomerPage;
	orderDetailsProductPage: OrderDetailsProductPage;
	assignedManagerModal: AssignedManagerModal;
	confirmationModal: ConfirmationModal;
	editDeliveryModal: EditDeliveryModal;
	createOrderModal: CreateOrderModal;
	reopenModal: ReopenModal;

	//ui-services
	homeUIService: HomeUIService;
	// productsListUIService: ProductsListUIService;
	// addNewProductUIService: AddNewProductUIService;
	loginUIService: LoginUIService;
	ordersListUIService: OrdersListUIService;
	// customersListUIService: CustomersListUIService;
	// addNewCustomerUIService: AddNewCustomertUIService;
	addNewOrderUIService: AddNewOrderUIService;
	ordersDetailsUIService: OrdersDetailsUIService;
}

export const test = base.extend<IPages>({
	//pages
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},

	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},

	// productsListPage: async ({ page }, use) => {
	// 	await use(new ProductsListPage(page));
	// },

	// addNewProductPage: async ({ page }, use) => {
	// 	await use(new AddNewProductPage(page));
	// },

	// editProductPage: async ({ page }, use) => {
	// 	await use(new EditProductPage(page));
	// },

	// addNewCustomerPage: async ({ page }, use) => {
	// 	await use(new AddNewCustomerPage(page));
	// },

	// customersListPage: async ({ page }, use) => {
	// 	await use(new CustomersListPage(page));
	// },

	ordersListPage: async ({ page }, use) => {
		await use(new OrdersListPage(page));
	},

	orderDetailsHeaderPage: async ({ page }, use) => {
		await use(new OrderDetailsHeaderPage(page));
	},
	orderDetailsBottomPage: async ({ page }, use) => {
		await use(new OrderDetailsBottomPage(page));
	},
	orderDetailsCustomerPage: async ({ page }, use) => {
		await use(new OrderDetailsCustomerPage(page));
	},
	orderDetailsProductPage: async ({ page }, use) => {
		await use(new OrderDetailsProductPage(page));
	},
	assignedManagerModal: async ({ page }, use) => {
		await use(new AssignedManagerModal(page));
	},
	confirmationModal: async ({ page }, use) => {
		await use(new ConfirmationModal(page));
	},
	editDeliveryModal: async ({ page }, use) => {
		await use(new EditDeliveryModal(page));
	},

	createOrderModal: async ({ page }, use) => {
		await use(new CreateOrderModal(page));
	},

	reopenModal: async ({ page }, use) => {
		await use(new ReopenModal(page));
	},

	// //ui-services
	homeUIService: async ({ page }, use) => {
		await use(new HomeUIService(page));
	},

	// productsListUIService: async ({ page }, use) => {
	// 	await use(new ProductsListUIService(page));
	// },

	// addNewProductUIService: async ({ page }, use) => {
	// 	await use(new AddNewProductUIService(page));
	// },

	loginUIService: async ({ page }, use) => {
		await use(new LoginUIService(page));
	},

	addNewOrderUIService: async ({ page }, use) => {
		await use(new AddNewOrderUIService(page));
	},

	// customersListUIService: async ({ page }, use) => {
	// 	await use(new CustomersListUIService(page));
	// },

	// addNewCustomerUIService: async ({ page }, use) => {
	// 	await use(new AddNewCustomertUIService(page));
	// },

	ordersListUIService: async ({ page }, use) => {
		await use(new OrdersListUIService(page));
	},

	ordersDetailsUIService: async ({ page }, use) => {
		await use(new OrdersDetailsUIService(page));
	},
});

export { expect };
