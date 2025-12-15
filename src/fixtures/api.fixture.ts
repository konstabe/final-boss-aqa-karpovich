import { test as base, expect } from "@playwright/test";
import { ProductsApi } from "api/api/product.api";
import { ProductsApiService } from "api/services/products.service";
import { LoginApi } from "api/api/login.api";
import { LoginService } from "api/services/login.service";
import { CustomersApi } from "api/api/customers.api";
import { CustomersApiService } from "api/services/customers.service";
import { PlaywrightApiClient } from "api/core/requestApi";
import { OrdersApi } from "api/api/orders.api";
import { OrdersApiService } from "api/services/orders.service";
import { NotificationsApi } from "api/api/notifications.api";
import { NotificationsService } from "api/services/notifications.service";

export interface IApi {
	// api
	productsApi: ProductsApi;
	loginApi: LoginApi;
	customersApi: CustomersApi;
	ordersApi: OrdersApi;
	notificationsApi: NotificationsApi;

	//services
	productsApiService: ProductsApiService;
	loginApiService: LoginService;
	customersApiService: CustomersApiService;
	ordersApiService: OrdersApiService;
	notificationsApiService: NotificationsService;
}

const test = base.extend<IApi>({
	//api
	productsApi: async ({ request }, use) => {
		const apiClient = new PlaywrightApiClient(request);
		const api = new ProductsApi(apiClient);
		await use(api);
	},

	loginApi: async ({ request }, use) => {
		const apiClient = new PlaywrightApiClient(request);
		const api = new LoginApi(apiClient);
		await use(api);
	},

	customersApi: async ({ request }, use) => {
		const apiClient = new PlaywrightApiClient(request);
		const api = new CustomersApi(apiClient);
		await use(api);
	},

	ordersApi: async ({ request }, use) => {
		const apiClient = new PlaywrightApiClient(request);
		const api = new OrdersApi(apiClient);
		await use(api);
	},
	notificationsApi: async ({ request }, use) => {
		const apiClient = new PlaywrightApiClient(request);
		const api = new NotificationsApi(apiClient);
		await use(api);
	},

	//services
	productsApiService: async ({ productsApi }, use) => {
		await use(new ProductsApiService(productsApi));
	},

	loginApiService: async ({ loginApi }, use) => {
		await use(new LoginService(loginApi));
	},

	customersApiService: async ({ customersApi }, use) => {
		await use(new CustomersApiService(customersApi));
	},

	ordersApiService: async ({ ordersApi, customersApiService, productsApiService }, use) => {
		await use(new OrdersApiService(ordersApi, customersApiService, productsApiService));
	},
	notificationsApiService: async ({ notificationsApi }, use) => {
		await use(new NotificationsService(notificationsApi));
	},
});

export { test, expect };
