import { OrdersApi } from "api/api/orders.api";
import { OrdersApiService } from "api/services/orders.service";
import { expect } from "fixtures";

type EnsureAssignedManagerParams = {
	ordersApiService: OrdersApiService;
	orderDetailsHeaderPage: any;
	assignedManagerModal: any;
	orderId: string;
	token: string;
};

export const ensureAssignedManager = async (params: EnsureAssignedManagerParams) => {
	const { ordersApiService, orderDetailsHeaderPage, assignedManagerModal, orderId, token } = params;
	const currentManagerId = await ordersApiService.getAssignedManagerId(token, orderId);
	if (currentManagerId) {
		return currentManagerId;
	}

	await orderDetailsHeaderPage.open(`orders/${orderId}`);
	await orderDetailsHeaderPage.waitForOpened();
	await orderDetailsHeaderPage.clickAssignManager();
	await expect(assignedManagerModal.uniqueElement).toBeVisible();

	const managerCount = await assignedManagerModal.getManagerCount();
	expect(managerCount).toBeGreaterThan(0);
	const managerId = await assignedManagerModal.getManagerIdByIndex(0);
	expect(managerId).toBeTruthy();

	await assignedManagerModal.selectManagerByIndex(0);
	await assignedManagerModal.assignManager();
	await assignedManagerModal.waitForClosed();

	return managerId;
};

export const ensureUnassignedManager = async (
	ordersApiService: OrdersApiService,
	ordersApi: OrdersApi,
	orderId: string,
	token: string,
) => {
	const currentManagerId = await ordersApiService.getAssignedManagerId(token, orderId);
	if (currentManagerId) {
		await ordersApi.unAssignManagerToOrder(orderId, token);
	}
};
