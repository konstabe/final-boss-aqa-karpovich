import { OrdersApi } from "api/api/orders.api";
import { OrdersApiService } from "api/services/orders.service";
import { expect } from "fixtures";

type EnsureAssignedManagerParams = {
	ordersApiService: OrdersApiService;
	orderDetailsPage: any;
	orderId: string;
	token: string;
};

export const ensureAssignedManager = async (params: EnsureAssignedManagerParams) => {
	const { ordersApiService, orderDetailsPage, orderId, token } = params;
	const currentManagerId = await ordersApiService.getAssignedManagerId(token, orderId);
	if (currentManagerId) {
		return currentManagerId;
	}

	await orderDetailsPage.open(`orders/${orderId}`);
	await orderDetailsPage.waitForOpened();
	await orderDetailsPage.header.clickAssignManager();
	await expect(orderDetailsPage.assignedManagerModal.uniqueElement).toBeVisible();

	const managerCount = await orderDetailsPage.assignedManagerModal.getManagerCount();
	expect(managerCount).toBeGreaterThan(0);
	const managerId = await orderDetailsPage.assignedManagerModal.getManagerIdByIndex(0);
	expect(managerId).toBeTruthy();

	await orderDetailsPage.assignedManagerModal.selectManagerByIndex(0);
	await orderDetailsPage.assignedManagerModal.assignManager();
	await orderDetailsPage.assignedManagerModal.waitForClosed();

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
