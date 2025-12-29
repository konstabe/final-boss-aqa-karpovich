import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Details] [Product]", () => {
	let token = "";
	let orderId = "";
	let productName = "";
	let customerId = "";
	let productIds: string[] = [];

	test.beforeAll(async ({ loginApiService, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const order = await ordersApiService.createDraft(token, 2);
		orderId = order._id;
		productName = order.products[0]?.name ?? "";
		customerId = order.customer._id;
		productIds = order.products.map((product) => product._id);
	});

	test.beforeEach(async ({ orderDetailsProductPage }) => {
		await orderDetailsProductPage.open(`orders/${orderId}`);
		await orderDetailsProductPage.waitForOpened();
	});

	test.afterAll(async ({ ordersApiService, customersApiService, productsApiService }) => {
		if (token && orderId) {
			await ordersApiService.deleteOrder(token, orderId);
		}
		if (productIds.length) {
			await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
		}
		if (customerId) {
			await customersApiService.delete(customerId, token);
		}
		orderId = "";
		productName = "";
		customerId = "";
		productIds = [];
	});

	test(
		"Should display product section and edit button",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsProductPage }) => {
			await expect(orderDetailsProductPage.productSection).toBeVisible();
			await expect(orderDetailsProductPage.editProductsButton).toBeVisible();
		},
	);

	test(
		"Should show product details",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsProductPage }) => {
			const headerIndex = (await orderDetailsProductPage.productDetailsHeader(0).count()) > 0 ? 0 : 1;
			await orderDetailsProductPage.changeStateProductDetailsById(headerIndex);
			const details = await orderDetailsProductPage.getProductDetails();
			const labels = details.map((item) => item.label);

			expect(labels).toContain("Name");
			expect(labels).toContain("Price");
			expect(labels).toContain("Manufacturer");

			const name = details.find((item) => item.label === "Name")?.value ?? "";
			if (productName) {
				expect(name).toContain(productName);
			}
		},
	);
});
