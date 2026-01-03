import { apiConfig } from "config/apiConfig";
import { TAGS } from "data/tags";
import { IOrderResponse } from "data/types/order.types";
import { expect, test } from "fixtures";
import { convertToDate, parseDatepickerDate } from "utils/date.utils";
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
				await orderDetailsPage.scheduleDeliveryModal.clickDate();
				const day = await orderDetailsPage.scheduleDeliveryModal.getRandomAvailableDay();
				const monthAndYear = await orderDetailsPage.scheduleDeliveryModal.getMonthAndYear();

				await orderDetailsPage.scheduleDeliveryModal.clickAvailableDay(day!);
				const date = parseDatepickerDate(monthAndYear, day!);
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
				const currentDay = convertToDate(deliveryDate!).split("/")[2];

				await ordersDetailsUIService.open(order._id);
				await orderDetailsPage.bottom.changeBottomTab("delivery-tab");

				await ordersDetailsUIService.openDeliveryModal();
				await orderDetailsPage.scheduleDeliveryModal.clickDate();
				const availableDays = orderDetailsPage.scheduleDeliveryModal.getAllAvailableDays();
				const day = (await availableDays).find((day) => day !== currentDay);
				const monthAndYear = await orderDetailsPage.scheduleDeliveryModal.getMonthAndYear();

				await orderDetailsPage.scheduleDeliveryModal.clickAvailableDay(day!);
				const date = parseDatepickerDate(monthAndYear, day!);
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
