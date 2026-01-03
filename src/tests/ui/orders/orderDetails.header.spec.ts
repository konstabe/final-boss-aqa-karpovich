import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures";
import { ensureAssignedManager, ensureUnassignedManager } from "tests/ui/orders/helpers/orderDetails.helpers";

test.describe.serial("[UI] [Orders] [Details] [Header]", () => {
	let token = "";
	let orderId = "";
	let orderStatus = "";
	let customerId = "";
	let productIds: string[] = [];

	test.beforeAll(async ({ loginApiService, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const order = await ordersApiService.createDraftWithDelivery(token, 1);
		orderId = order._id;
		orderStatus = order.status;
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
		orderStatus = "";
		customerId = "";
		productIds = [];
	});

	test(
		"Should display header elements and order number",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			const numberText = await orderDetailsPage.header.getOrderNumber();

			await expect(orderDetailsPage.header.detailsHeader).toBeVisible();
			await expect(orderDetailsPage.header.backLink).toBeVisible();
			await expect(orderDetailsPage.header.refreshOrderButton).toBeVisible();
			await expect(orderDetailsPage.header.assignManagerContainer).toBeVisible();
			expect(numberText ?? "").toContain(orderId);
		},
	);

	test(
		"Should show order summary labels and status",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage }) => {
			const summary = await orderDetailsPage.header.getOrderStatus();
			const labels = summary.map((item) => item.label);
			const expectedLabels = ["Order Status", "Total Price", "Delivery", "Created On"];

			for (const label of expectedLabels) {
				expect(labels).toContain(label);
			}

			const statusItem = summary.find((item) => item.label === "Order Status");
			expect(statusItem?.value ?? "").toContain(orderStatus);
		},
	);

	test(
		"Should refresh order details",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage, page }) => {
			const response = await orderDetailsPage.header.refreshOrder(orderId);
			await page.pause();

			expect([STATUS_CODES.NOT_MODIFYED, STATUS_CODES.OK]).toContain(response.status);
		},
	);

	test(
		"Should navigate back to Orders list",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage, ordersListPage }) => {
			await orderDetailsPage.header.backLink.click();
			await ordersListPage.waitForOpened();
		},
	);

	test(
		"Assign manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage, ordersApi, ordersApiService }) => {
			await ensureUnassignedManager(ordersApiService, ordersApi, orderId, token);
			await orderDetailsPage.open(`orders/${orderId}`);
			await orderDetailsPage.waitForOpened();

			await orderDetailsPage.header.clickAssignManager();
			await expect(orderDetailsPage.assignedManagerModal.uniqueElement).toBeVisible();

			const managerCount = await orderDetailsPage.assignedManagerModal.getManagerCount();
			expect(managerCount).toBeGreaterThan(0);
			const expectedManagerId = await orderDetailsPage.assignedManagerModal.getManagerIdByIndex(0);
			expect(expectedManagerId).toBeTruthy();

			await orderDetailsPage.assignedManagerModal.selectManagerByIndex(0);
			await orderDetailsPage.assignedManagerModal.assignManager();
			await orderDetailsPage.assignedManagerModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBe(expectedManagerId);
		},
	);

	test(
		"Unassign manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage, ordersApiService }) => {
			await ensureAssignedManager({
				ordersApiService,
				orderDetailsPage,
				orderId,
				token,
			});
			await orderDetailsPage.open(`orders/${orderId}`);
			await orderDetailsPage.waitForOpened();

			await orderDetailsPage.header.openUnassignManagerModal();
			await orderDetailsPage.confirmationModal.clickConfirm();
			await orderDetailsPage.confirmationModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBeNull();
		},
	);

	test(
		"Edit manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsPage, ordersApiService }) => {
			const currentManagerId = await ensureAssignedManager({
				ordersApiService,
				orderDetailsPage,
				orderId,
				token,
			});
			await orderDetailsPage.open(`orders/${orderId}`);
			await orderDetailsPage.waitForOpened();

			await orderDetailsPage.header.openEditAssignedManagerModal();
			await expect(orderDetailsPage.assignedManagerModal.uniqueElement).toBeVisible();

			const managerCount = await orderDetailsPage.assignedManagerModal.getManagerCount();
			test.skip(managerCount < 2, "Not enough managers to edit");

			const firstManagerId = await orderDetailsPage.assignedManagerModal.getManagerIdByIndex(0);
			const secondManagerId = await orderDetailsPage.assignedManagerModal.getManagerIdByIndex(1);
			const targetIndex = firstManagerId === currentManagerId ? 1 : 0;
			const expectedManagerId = targetIndex === 1 ? secondManagerId : firstManagerId;
			expect(expectedManagerId).toBeTruthy();

			await orderDetailsPage.assignedManagerModal.selectManagerByIndex(targetIndex);
			await orderDetailsPage.assignedManagerModal.assignManager();
			await orderDetailsPage.assignedManagerModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBe(expectedManagerId);
		},
	);
});
