import { NOTIFICATIONS } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[UI] [Orders]", () => {
	let token = "";
	const ids: string[] = [];
	let id_product = "";
	let id_order = "";
	let id_customer = "";
	const product_name: string[] = [];

	test.afterEach(async ({ productsApiService, customersApiService, ordersApiService }) => {
		if (id_order) await ordersApiService.deleteOrder(token, id_order);
		id_order = "";
		if (id_customer) await customersApiService.delete(id_customer, token);
		id_customer = "";
		if (id_product) await productsApiService.delete(token, id_product);
		id_product = "";
		if (ids.length) {
			for (const id of ids) {
				await productsApiService.delete(token, id);
			}
			ids.length = 0;
		}
	});

	test(
		"Add order with 5 products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({
			page,
			addNewOrderPage,
			ordersListPage,
			ordersListUIService,
			customersApiService,
			productsApiService,
		}) => {
			token = await ordersListPage.getAuthToken();
			const customer = await customersApiService.create(token);
			id_customer = customer._id;
			const customer_name = customer.name;

			for (let i = 1; i <= 5; i++) {
				const products = await productsApiService.create(token);
				ids.push(products._id);
				product_name.push(products.name);
				await page.waitForTimeout(1000);
			}

			token = await ordersListPage.getAuthToken();
			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await expect(addNewOrderPage.createOrderPageTitle).toHaveText("Create Order");
			await expect(addNewOrderPage.addProductButton).toBeVisible();

			await addNewOrderPage.selectCustomerAndProduct(customer_name, product_name);
			await expect(addNewOrderPage.addProductButton).not.toBeVisible();
			await addNewOrderPage.countDeleteButtons(5);
			await addNewOrderPage.clickCreate();

			await ordersListPage.waitForOpened();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CREATED);

			await expect(ordersListPage.tableRowsByEmail(customer.email)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: any) => order.email === customer.email);
			id_order = order!._id;
		},
	);

	test(
		"Add order with the addition and removal of products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({
			page,
			addNewOrderPage,
			ordersListPage,
			ordersListUIService,
			customersApiService,
			productsApiService,
		}) => {
			token = await ordersListPage.getAuthToken();
			const customer = await customersApiService.create(token);
			id_customer = customer._id;
			const customer_name = customer.name;

			for (let i = 1; i <= 3; i++) {
				const products = await productsApiService.create(token);
				ids.push(products._id);
				product_name.push(products.name);
				await page.waitForTimeout(1000);
			}

			token = await ordersListPage.getAuthToken();
			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await expect(addNewOrderPage.createOrderPageTitle).toHaveText("Create Order");
			await expect(addNewOrderPage.addProductButton).toBeVisible();

			await addNewOrderPage.selectCustomerAndProduct(customer_name, product_name);
			await addNewOrderPage.countDeleteButtons(3);

			await addNewOrderPage.deleteProductByName(product_name[1]!);
			await addNewOrderPage.deleteProductByName(product_name[2]!);
			await expect(addNewOrderPage.deleteProductButton).not.toBeVisible();

			await addNewOrderPage.clickCreate();

			await ordersListPage.waitForOpened();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CREATED);

			await expect(ordersListPage.tableRowsByEmail(customer.email)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: any) => order.email === customer.email);
			id_order = order!._id;
		},
	);

	test(
		"Add order with 1 products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ addNewOrderPage, ordersListPage, ordersListUIService, customersApiService, productsApi }) => {
			token = await ordersListPage.getAuthToken();
			const customer = await customersApiService.create(token);
			id_customer = customer._id;
			const customer_name = customer.name;

			const createdProduct = await productsApi.create(generateProductData(), token);
			id_product = createdProduct.body.Product._id;
			product_name.push(createdProduct.body.Product.name);

			token = await ordersListPage.getAuthToken();
			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await expect(addNewOrderPage.createOrderPageTitle).toHaveText("Create Order");
			await expect(addNewOrderPage.addProductButton).toBeVisible();

			await addNewOrderPage.selectCustomerAndProduct(customer_name, product_name);
			await expect(addNewOrderPage.deleteProductButton).not.toBeVisible();
			await addNewOrderPage.clickCreate();

			await ordersListPage.waitForOpened();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CREATED);

			await expect(ordersListPage.tableRowsByEmail(customer.email)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: any) => order.email === customer.email);
			id_order = order!._id;
		},
	);
});
