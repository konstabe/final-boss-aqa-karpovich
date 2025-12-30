import { NOTIFICATIONS } from "data/notifications";
import { TAGS } from "data/tags";
import { IOrderInTable } from "data/types/order.types";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [createOrderModal]", () => {
	let token = "";
	let ids: string[] = [];
	let id_product = "";
	let id_order = "";
	let id_customer = "";

	test.beforeEach(async ({ ordersListPage }) => {
		token = await ordersListPage.getAuthToken();
	});

	test.afterEach(async ({ productsApiService, customersApiService, ordersApiService }) => {
		test.setTimeout(40000);
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
		"Check UI components",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ createOrderModal, ordersListPage, ordersListUIService, ordersApiService }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const { productsIds, productNames } = await ordersApiService.createProducts(token, 5);
			ids = productsIds;

			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await expect(createOrderModal.createOrderPageTitle).toHaveText("Create Order");
			await expect(createOrderModal.addProductButton).toBeVisible();
			await expect(createOrderModal.deleteProductButton).not.toBeVisible();

			await createOrderModal.selectCustomerAndProduct(customerName, productNames);
			await expect(createOrderModal.addProductButton).not.toBeVisible();
			await createOrderModal.verifyCountOfDeleteButtons(5);

			await createOrderModal.deleteProductByName(productNames[1]!);
			await createOrderModal.deleteProductByName(productNames[2]!);
			await createOrderModal.verifyCountOfDeleteButtons(3);
			await expect(createOrderModal.addProductButton).toBeVisible();

			await createOrderModal.deleteProductByName(productNames[1]!);
			await createOrderModal.deleteProductByName(productNames[2]!);
			await expect(createOrderModal.addProductButton).toBeVisible();
			await expect(createOrderModal.deleteProductButton).not.toBeVisible();

			await createOrderModal.clickCreate();

			await ordersListPage.waitForOpened();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.ORDER_CREATED);

			await expect(ordersListPage.tableRowsByEmail(customerEmail)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: IOrderInTable) => order.email === customerEmail);
			id_order = order!._id;
		},
	);

	test(
		"Add order with 5 products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ createOrderModal, ordersListPage, ordersListUIService, ordersApiService }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const { productsIds, productNames } = await ordersApiService.createProducts(token, 5);
			ids = productsIds;

			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await createOrderModal.selectCustomerAndProduct(customerName, productNames);
			await createOrderModal.clickCreate();

			await ordersListPage.waitForOpened();

			await expect(ordersListPage.tableRowsByEmail(customerEmail)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: IOrderInTable) => order.email === customerEmail);
			id_order = order!._id;
		},
	);

	test(
		"Add order with the addition and removal of products",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ createOrderModal, ordersListPage, ordersListUIService, ordersApiService }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const { productsIds, productNames } = await ordersApiService.createProducts(token, 3);
			ids = productsIds;

			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await createOrderModal.selectCustomerAndProduct(customerName, productNames);

			await createOrderModal.deleteProductByName(productNames[1]!);
			await createOrderModal.deleteProductByName(productNames[2]!);
			expect(createOrderModal.productField.selectOption(productNames[0]!));

			await createOrderModal.clickCreate();

			await ordersListPage.waitForOpened();

			await expect(ordersListPage.tableRowsByEmail(customerEmail)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: IOrderInTable) => order.email === customerEmail);
			id_order = order!._id;
		},
	);

	test(
		"Add order with 1 products",
		{
			tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.UI],
		},
		async ({ createOrderModal, ordersListPage, ordersListUIService, ordersApiService }) => {
			const { customerId, customerName, customerEmail } = await ordersApiService.createCustomer(token);
			id_customer = customerId;

			const { productsIds, productNames } = await ordersApiService.createProducts(token, 3);
			ids = productsIds;

			await ordersListUIService.open();
			await ordersListPage.clickCreateOrder();

			await createOrderModal.selectCustomerAndProduct(customerName, productNames);
			await createOrderModal.clickCreate();

			await ordersListPage.waitForOpened();

			await expect(ordersListPage.tableRowsByEmail(customerEmail)).toBeVisible();
			const orderData = await ordersListPage.getTableData();
			const order = orderData.find((order: IOrderInTable) => order.email === customerEmail);
			id_order = order!._id;
		},
	);
});
