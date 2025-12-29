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

	test.beforeEach(async ({ orderDetailsHeaderPage }) => {
		await orderDetailsHeaderPage.open(`orders/${orderId}`);
		await orderDetailsHeaderPage.waitForOpened();
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
		async ({ orderDetailsHeaderPage }) => {
			const numberText = await orderDetailsHeaderPage.getOrderNumber();

			await expect(orderDetailsHeaderPage.detailsHeader).toBeVisible();
			await expect(orderDetailsHeaderPage.backLink).toBeVisible();
			await expect(orderDetailsHeaderPage.refreshOrderButton).toBeVisible();
			await expect(orderDetailsHeaderPage.assignManagerContainer).toBeVisible();
			expect(numberText ?? "").toContain(orderId);
		},
	);

	test(
		"Should show order summary labels and status",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsHeaderPage }) => {
			const summary = await orderDetailsHeaderPage.getOrderStatus();
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
		async ({ orderDetailsHeaderPage, page }) => {
			const response = await orderDetailsHeaderPage.refreshOrder(orderId);
			await page.pause();

			expect([STATUS_CODES.NOT_MODIFYED, STATUS_CODES.OK]).toContain(response.status);
		},
	);

	test(
		"Should navigate back to Orders list",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsHeaderPage, ordersListPage }) => {
			await orderDetailsHeaderPage.backLink.click();
			await ordersListPage.waitForOpened();
		},
	);

	test(
		"Assign manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsHeaderPage, assignedManagerModal, ordersApi, ordersApiService }) => {
			await ensureUnassignedManager(ordersApiService, ordersApi, orderId, token);
			await orderDetailsHeaderPage.open(`orders/${orderId}`);
			await orderDetailsHeaderPage.waitForOpened();

			await orderDetailsHeaderPage.clickAssignManager();
			await expect(assignedManagerModal.uniqueElement).toBeVisible();

			const managerCount = await assignedManagerModal.getManagerCount();
			expect(managerCount).toBeGreaterThan(0);
			const expectedManagerId = await assignedManagerModal.getManagerIdByIndex(0);
			expect(expectedManagerId).toBeTruthy();

			await assignedManagerModal.selectManagerByIndex(0);
			await assignedManagerModal.assignManager();
			await assignedManagerModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBe(expectedManagerId);
		},
	);

	test(
		"Unassign manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsHeaderPage, confirmationModal, ordersApiService, assignedManagerModal }) => {
			await ensureAssignedManager({
				ordersApiService,
				orderDetailsHeaderPage,
				assignedManagerModal,
				orderId,
				token,
			});
			await orderDetailsHeaderPage.open(`orders/${orderId}`);
			await orderDetailsHeaderPage.waitForOpened();

			await orderDetailsHeaderPage.openUnassignManagerModal();
			await confirmationModal.clickConfirm();
			await confirmationModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBeNull();
		},
	);

	test(
		"Edit manager",
		{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
		async ({ orderDetailsHeaderPage, assignedManagerModal, ordersApiService }) => {
			const currentManagerId = await ensureAssignedManager({
				ordersApiService,
				orderDetailsHeaderPage,
				assignedManagerModal,
				orderId,
				token,
			});
			await orderDetailsHeaderPage.open(`orders/${orderId}`);
			await orderDetailsHeaderPage.waitForOpened();

			await orderDetailsHeaderPage.openEditAssignedManagerModal();
			await expect(assignedManagerModal.uniqueElement).toBeVisible();

			const managerCount = await assignedManagerModal.getManagerCount();
			test.skip(managerCount < 2, "Not enough managers to edit");

			const firstManagerId = await assignedManagerModal.getManagerIdByIndex(0);
			const secondManagerId = await assignedManagerModal.getManagerIdByIndex(1);
			const targetIndex = firstManagerId === currentManagerId ? 1 : 0;
			const expectedManagerId = targetIndex === 1 ? secondManagerId : firstManagerId;
			expect(expectedManagerId).toBeTruthy();

			await assignedManagerModal.selectManagerByIndex(targetIndex);
			await assignedManagerModal.assignManager();
			await assignedManagerModal.waitForClosed();

			const managerId = await ordersApiService.getAssignedManagerId(token, orderId);
			expect(managerId).toBe(expectedManagerId);
		},
	);
});
