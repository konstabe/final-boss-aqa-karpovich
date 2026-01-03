import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Details] [Customer]", () => {
	let token = "";
	let orderId = "";
	let customerEmail = "";
	let customerName = "";
	let customerId = "";
	let productIds: string[] = [];

	test.beforeAll(async ({ loginApiService, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const order = await ordersApiService.createDraft(token, 1);
		orderId = order._id;
		customerEmail = order.customer.email;
		customerName = order.customer.name;
		customerId = order.customer._id;
		productIds = order.products.map((product) => product._id);
	});

	test.beforeEach(async ({ orderDetailsPage }) => {
		await orderDetailsPage.open(`orders/${orderId}`);
		await orderDetailsPage.waitForOpened();
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
		customerEmail = "";
		customerName = "";
		customerId = "";
		productIds = [];
	});

	test(
		"Should display customer section and edit button",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			await expect(orderDetailsPage.customer.customerSection).toBeVisible();
			await expect(orderDetailsPage.customer.editCustomerButton).toBeVisible();
		},
	);

	test(
		"Should show customer details",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			const details = await orderDetailsPage.customer.getCustomerDetails();
			const labels = details.map((item) => item.label);

			expect(labels).toContain("Email");
			expect(labels).toContain("Name");

			const email = details.find((item) => item.label === "Email")?.value ?? "";
			const name = details.find((item) => item.label === "Name")?.value ?? "";

			expect(email).toContain(customerEmail);
			expect(name).toContain(customerName);
		},
	);
});
