import { apiConfig } from "config/apiConfig";
import { DELIVERY_CONDITION } from "data/orders/deliveryCondition";
import { TAGS } from "data/tags";
import { IOrderResponse } from "data/types/order.types";
import { expect, test } from "fixtures";
import { convertToDate } from "utils/date.utils";
import { mapDeliveryInfo } from "utils/mappers.utils";

test.describe("[UI] [Orders]", () => {
	let token = "";

	test.beforeEach(async ({ orderDetailsPage }) => {
		token = await orderDetailsPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[Delivery]", () => {
		test(
			"Should schedule delivery",
			{ tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
			async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
				const order = await ordersApiService.createDraft(token, 2);
				await ordersDetailsUIService.open(order._id);
				await orderDetailsPage.bottom.changeBottomTab("delivery-tab");

				await ordersDetailsUIService.openDeliveryModal();
				const date = await ordersDetailsUIService.clickRandomDeliveryDate();

				await expect(orderDetailsPage.scheduleDeliveryModal.dateInput).toHaveValue(date);
				await expect(orderDetailsPage.scheduleDeliveryModal.saveDeliveryButton).toBeEnabled();

				const response = await orderDetailsPage.interceptResponse<IOrderResponse, []>(
					apiConfig.endpoints.updateDelivery(order._id),
					orderDetailsPage.scheduleDeliveryModal.clickSaveDelivery.bind(
						orderDetailsPage.scheduleDeliveryModal,
					),
				);
				await orderDetailsPage.scheduleDeliveryModal.waitForClosed();
				await orderDetailsPage.waitForOpened();

				const dateDeliveryInTable = await orderDetailsPage.header.tableValueByHeader("Delivery").innerText();
				expect(dateDeliveryInTable).toBe(date);
				expect(orderDetailsPage.bottom.deliveryButton).toHaveText("Edit Delivery");

				const infoFromUI = await orderDetailsPage.bottom.parseDeliveryInformation();
				const infoFromResp = mapDeliveryInfo(response.body.Order.delivery!);
				expect(infoFromUI).toEqual(infoFromResp);
			},
		);

		test(
			"Should change delivery",
			{ tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
			async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
				const order = await ordersApiService.createDraftWithDelivery(token, 2);
				const deliveryDate = order.delivery?.finalDate;

				await ordersDetailsUIService.open(order._id);
				await orderDetailsPage.bottom.changeBottomTab("delivery-tab");

				await ordersDetailsUIService.openDeliveryModal();
				const date = await ordersDetailsUIService.clickDifferentDate(deliveryDate!);

				await expect(orderDetailsPage.scheduleDeliveryModal.dateInput).toHaveValue(date);
				await expect(orderDetailsPage.scheduleDeliveryModal.saveDeliveryButton).toBeEnabled();

				const response = await orderDetailsPage.interceptResponse<IOrderResponse, []>(
					apiConfig.endpoints.updateDelivery(order._id),
					orderDetailsPage.scheduleDeliveryModal.clickSaveDelivery.bind(
						orderDetailsPage.scheduleDeliveryModal,
					),
				);
				await orderDetailsPage.scheduleDeliveryModal.waitForClosed();
				await orderDetailsPage.waitForOpened();

				const dateDeliveryInTable = await orderDetailsPage.header.tableValueByHeader("Delivery").innerText();
				expect(dateDeliveryInTable).toBe(date);
				expect(orderDetailsPage.bottom.deliveryButton).toHaveText("Edit Delivery");

				const infoFromUI = await orderDetailsPage.bottom.parseDeliveryInformation();
				const infoFromResp = mapDeliveryInfo(response.body.Order.delivery!);
				expect(infoFromUI).toEqual(infoFromResp);
			},
		);

		test(
			"Should schedule pickup",
			{ tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
			async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
				const order = await ordersApiService.createDraft(token, 2);
				const country = order.customer.country;
				await ordersDetailsUIService.open(order._id);
				await orderDetailsPage.bottom.changeBottomTab("delivery-tab");

				await ordersDetailsUIService.openDeliveryModal();
				await orderDetailsPage.scheduleDeliveryModal.selectDeliveryMethod("Pickup");
				await expect(orderDetailsPage.scheduleDeliveryModal.deliveryType).toHaveValue(
					DELIVERY_CONDITION.PICKUP,
				);

				const date = await ordersDetailsUIService.clickRandomDeliveryDate();

				await expect(orderDetailsPage.scheduleDeliveryModal.dateInput).toHaveValue(date);
				await expect(orderDetailsPage.scheduleDeliveryModal.country).toHaveValue(country);
				await expect(orderDetailsPage.scheduleDeliveryModal.saveDeliveryButton).toBeEnabled();

				const response = await orderDetailsPage.interceptResponse<IOrderResponse, []>(
					apiConfig.endpoints.updateDelivery(order._id),
					orderDetailsPage.scheduleDeliveryModal.clickSaveDelivery.bind(
						orderDetailsPage.scheduleDeliveryModal,
					),
				);
				await orderDetailsPage.scheduleDeliveryModal.waitForClosed();
				await orderDetailsPage.waitForOpened();

				const pickupDateInTable = await orderDetailsPage.header.tableValueByHeader("Delivery").innerText();
				expect(pickupDateInTable).toBe(date);
				expect(orderDetailsPage.bottom.deliveryButton).toHaveText("Edit Delivery");

				const infoFromUI = await orderDetailsPage.bottom.parseDeliveryInformation();
				const infoFromResp = mapDeliveryInfo(response.body.Order.delivery!);
				expect(infoFromUI).toEqual(infoFromResp);
			},
		);

		test(
			"Should switch from delivery to pickup",
			{ tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
			async ({ ordersApiService, ordersDetailsUIService, orderDetailsPage }) => {
				const order = await ordersApiService.createDraftWithDelivery(token, 2);
				const deliveryDate = order.delivery?.finalDate;
				const date = convertToDate(deliveryDate!);
				expect(order.delivery?.condition).toBe(DELIVERY_CONDITION.DELIVERY);

				await ordersDetailsUIService.open(order._id);
				await orderDetailsPage.bottom.changeBottomTab("delivery-tab");

				await ordersDetailsUIService.openDeliveryModal();
				await expect(orderDetailsPage.scheduleDeliveryModal.deliveryType).toHaveValue(
					DELIVERY_CONDITION.DELIVERY,
				);
				await orderDetailsPage.scheduleDeliveryModal.selectDeliveryMethod("Pickup");
				await expect(orderDetailsPage.scheduleDeliveryModal.deliveryType).toHaveValue(
					DELIVERY_CONDITION.PICKUP,
				);
				await expect(orderDetailsPage.scheduleDeliveryModal.saveDeliveryButton).toBeEnabled();

				await expect(orderDetailsPage.scheduleDeliveryModal.dateInput).toHaveValue(date);
				await expect(orderDetailsPage.scheduleDeliveryModal.saveDeliveryButton).toBeEnabled();

				const response = await orderDetailsPage.interceptResponse<IOrderResponse, []>(
					apiConfig.endpoints.updateDelivery(order._id),
					orderDetailsPage.scheduleDeliveryModal.clickSaveDelivery.bind(
						orderDetailsPage.scheduleDeliveryModal,
					),
				);
				await orderDetailsPage.scheduleDeliveryModal.waitForClosed();
				await orderDetailsPage.waitForOpened();

				const dateDeliveryInTable = await orderDetailsPage.header.tableValueByHeader("Delivery").innerText();
				expect(dateDeliveryInTable).toBe(date);
				expect(orderDetailsPage.bottom.deliveryButton).toHaveText("Edit Delivery");

				const infoFromUI = await orderDetailsPage.bottom.parseDeliveryInformation();
				const infoFromResp = mapDeliveryInfo(response.body.Order.delivery!);
				expect(infoFromUI).toEqual(infoFromResp);
			},
		);
	});
});
