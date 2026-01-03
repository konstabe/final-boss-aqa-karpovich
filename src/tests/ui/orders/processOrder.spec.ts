import { apiConfig } from "config/apiConfig";
import { generateOrderDetailsMockWithDelivery } from "data/orders/generateOrderDetailsMock";
import { CONFIRMATION_MODAL_TEXT } from "data/orders/modalText";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { IOrderResponse } from "data/types/order.types";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders]", () => {
	let token = "";

	test.beforeEach(async ({ orderDetailsPage }) => {
		token = await orderDetailsPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[Process Order modal on Orders Details Page]", () => {
		test(
			"Check UI components on Process Order Modal",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ orderDetailsPage, ordersDetailsUIService, mock }) => {
				const order = generateOrderDetailsMockWithDelivery(ORDER_STATUS.DRAFT, false);
				await mock.orderDetailsPage(order);

				await ordersDetailsUIService.open(order.Order._id);
				await ordersDetailsUIService.openProcessOrderModal();

				expect(orderDetailsPage.processOrderModal.title).toHaveText(CONFIRMATION_MODAL_TEXT.processOrder.title);
				expect(orderDetailsPage.processOrderModal.confirmationMessage).toHaveText(
					CONFIRMATION_MODAL_TEXT.processOrder.body,
				);
				expect(orderDetailsPage.processOrderModal.closeButton).toBeEnabled();
				expect(orderDetailsPage.processOrderModal.processButton).toBeEnabled();
				expect(orderDetailsPage.processOrderModal.processButton).toHaveText(
					CONFIRMATION_MODAL_TEXT.processOrder.confirmButton,
				);
				expect(orderDetailsPage.processOrderModal.cancelButton).toBeEnabled();
				expect(orderDetailsPage.processOrderModal.cancelButton).toHaveText(
					CONFIRMATION_MODAL_TEXT.cancelButton,
				);
			},
		);

		test(
			"Should close Process Order Modal by clicking Close",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ orderDetailsPage, ordersDetailsUIService, ordersApiService }) => {
				const order = await ordersApiService.createDraftWithDelivery(token, 1);

				await ordersDetailsUIService.open(order._id);
				await ordersDetailsUIService.openProcessOrderModal();

				await ordersDetailsUIService.closeModal("processOrderModal");

				const status = await orderDetailsPage.header.tableValueByHeader("Order Status").innerText();
				expect(status).toBe(order.status);
				await expect(orderDetailsPage.header.processOrderButton).toBeEnabled();
			},
		);

		test(
			"Should close Process Order Modal by clicking Cancel",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ orderDetailsPage, ordersDetailsUIService, ordersApiService }) => {
				const order = await ordersApiService.createDraftWithDelivery(token, 1);

				await ordersDetailsUIService.open(order._id);
				await ordersDetailsUIService.openProcessOrderModal();

				await ordersDetailsUIService.cancelModal("processOrderModal");

				const status = await orderDetailsPage.header.tableValueByHeader("Order Status").innerText();
				expect(status).toBe(order.status);
				await expect(orderDetailsPage.header.processOrderButton).toBeEnabled();
			},
		);

		test(
			"Should confirm action by clicking Process",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ orderDetailsPage, ordersDetailsUIService, ordersApiService }) => {
				const order = await ordersApiService.createDraftWithDelivery(token, 1);

				await ordersDetailsUIService.open(order._id);
				await ordersDetailsUIService.openProcessOrderModal();

				const response = await orderDetailsPage.interceptResponse<IOrderResponse, []>(
					apiConfig.endpoints.updateStatus(order._id),
					orderDetailsPage.processOrderModal.clickConfirm.bind(orderDetailsPage.processOrderModal),
				);

				await orderDetailsPage.processOrderModal.waitForClosed();

				await orderDetailsPage.waitForOpened();

				expect(response.body.Order.status).toBe(ORDER_STATUS.IN_PROGRESS);
				const statusInTable = await orderDetailsPage.header.tableValueByHeader("Order Status").innerText();
				expect(statusInTable).toBe(ORDER_STATUS.IN_PROGRESS);
				await expect(orderDetailsPage.header.processOrderButton).not.toBeVisible();
			},
		);
	});
});
