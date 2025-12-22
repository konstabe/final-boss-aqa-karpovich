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
	ordersListPage: OrdersListPage;
	addNewOrderPage: CreateOrderModal;

	//ui-services
	homeUIService: HomeUIService;
	// productsListUIService: ProductsListUIService;
	// addNewProductUIService: AddNewProductUIService;
	loginUIService: LoginUIService;
	ordersListUIService: OrdersListUIService;
	// customersListUIService: CustomersListUIService;
	// addNewCustomerUIService: AddNewCustomertUIService;
	addNewOrderUIService: AddNewOrderUIService;
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

	addNewOrderPage: async ({ page }, use) => {
		await use(new CreateOrderModal(page));
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
});

export { expect };
