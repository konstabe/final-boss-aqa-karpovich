// import { test as base } from "@playwright/test";
// import { PlaywrightApiClient } from "../api/core/requestApi";
// import { ProductsApi } from "../api/api/products.api";
// import { CustomersApi } from "../api/api/customers.api";

// export interface IApi {
//   productsApi: ProductsApi;
//   customersApi: CustomersApi;
// }

// const test = base.extend<IApi>({
//   //api
//   productsApi: async ({ request }, use) => {
//     const apiClient = new PlaywrightApiClient(request);
//     const api = new ProductsApi(apiClient);
//     await use(api);
//   },

//   customersApi: async ({ request }, use) => {
//     const apiClient = new PlaywrightApiClient(request);
//     const api = new LoginApi(apiClient);
//     await use(api);
//   },
// });
