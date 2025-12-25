import { FILTER_MODAL_TEXT } from "data/orders/modalText";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { getDifferentEnumValue, getRandomEnumValue } from "utils/enum.utils";

test.describe("[UI] [Orders]", () => {
	let token = "";

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test.describe("[Filter modal on Orders List Page]", () => {
		test(
			"Check UI components on Filter Modal",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService }) => {
				await ordersListUIService.open();
				await ordersListUIService.openFilterModal();

				await expect(ordersListPage.filterModal.title).toHaveText(FILTER_MODAL_TEXT.title);
				await expect(ordersListPage.filterModal.closeButton).toBeEnabled();
				await expect(ordersListPage.filterModal.applyButton).toBeEnabled();
				await expect(ordersListPage.filterModal.applyButton).toHaveText(FILTER_MODAL_TEXT.applyButton);
				await expect(ordersListPage.filterModal.clearFiltersButton).toBeEnabled();
				await expect(ordersListPage.filterModal.clearFiltersButton).toHaveText(
					FILTER_MODAL_TEXT.clearFiltersButton,
				);

				for (const status of Object.values(ORDER_STATUS)) {
					const checkbox = ordersListPage.filterModal.getCheckboxByStatus(status);
					const label = ordersListPage.filterModal.getLabelByStatus(status);

					await expect(checkbox).toBeVisible();
					await expect(checkbox).toBeEnabled();
					await expect(label).toHaveText(status);
				}
			},
		);

		test(
			"Should close Filter Modal by clicking Close",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService }) => {
				await ordersListUIService.open();
				await ordersListUIService.openFilterModal();

				await ordersListUIService.closeModal("filterModal");
				await expect(ordersListPage.filterModal.uniqueElement).not.toBeVisible();
			},
		);

		test(
			"Should apply filters and update orders table",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();

				await ordersApiService.createDraft(token, 1);
				await ordersApiService.processOrder(token, 1);
				await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersApiService.allReceived(token, 1);
				const order = await ordersApiService.processOrder(token, 4);
				await ordersApiService.partiallyReceived(token, order, 2);

				await ordersListUIService.open();
				const randomStatus = getRandomEnumValue(ORDER_STATUS);

				await ordersListUIService.openFilterModal();
				await ordersListPage.filterModal.checkCheckboxByStatus(randomStatus);
				await ordersListPage.filterModal.clickApply();
				await ordersListPage.filterModal.waitForClosed();

				await ordersListPage.waitForOpened();
				const tableData = await ordersListPage.getTableData();
				tableData.forEach((row) => expect(row.status).toBe(randomStatus));
				await expect(ordersListPage.filtredOrdersButtons).toHaveCount(1);
				await expect(ordersListPage.filtredOrdersButtons).toHaveText(randomStatus);
			},
		);
		test(
			"Should apply multiple filters and update orders table",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();

				await ordersApiService.createDraft(token, 1);
				await ordersApiService.processOrder(token, 1);
				await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersApiService.allReceived(token, 1);
				const order = await ordersApiService.processOrder(token, 4);
				await ordersApiService.partiallyReceived(token, order, 2);

				await ordersListUIService.open();
				await ordersListUIService.openFilterModal();

				const status1 = getRandomEnumValue(ORDER_STATUS);
				const status2 = getDifferentEnumValue(ORDER_STATUS, status1);
				const statusesForFilter = [status1, status2].toSorted();
				await ordersListPage.filterModal.chooseCheckboxForFilter(statusesForFilter);

				await ordersListPage.filterModal.clickApply();
				await ordersListPage.filterModal.waitForClosed();

				await ordersListPage.waitForOpened();
				await expect(ordersListPage.filtredOrdersButtons).toHaveCount(statusesForFilter.length);
				const filterButtonText = (await ordersListPage.filtredOrdersButtons.allInnerTexts()).toSorted();
				expect(filterButtonText).toEqual(statusesForFilter);

				const tableData = await ordersListPage.getTableData();
				const tableStatuses = [...new Set(tableData.map((row) => row.status))].toSorted();

				expect(tableStatuses).toEqual(statusesForFilter);
			},
		);

		test(
			"Should clear filter by clicking Clear Filters Button",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();
				await ordersApiService.createDraft(token, 1);

				await ordersListUIService.open();
				await ordersListUIService.openFilterModal();

				await ordersListPage.filterModal.checkCheckboxByStatus(ORDER_STATUS.DRAFT);

				await ordersListPage.filterModal.clickApply();
				await ordersListPage.filterModal.waitForClosed();

				await ordersListPage.waitForOpened();

				const tableDataWithFilter = await ordersListPage.getTableData();
				for (const row of tableDataWithFilter) {
					expect(row.status).toBe(ORDER_STATUS.DRAFT);
				}
				await expect(ordersListPage.filtredOrdersButtons).toHaveCount(1);

				await ordersListUIService.openFilterModal();
				await ordersListUIService.cancelModal("filterModal");

				await ordersListPage.waitForOpened();
				await expect(ordersListPage.filtredOrdersButtons).toHaveCount(0);

				const tableDataWithoutFilter = await ordersListPage.getTableData();
				expect(tableDataWithoutFilter.some((row) => row.status !== ORDER_STATUS.DRAFT)).toBeTruthy();

				await ordersListUIService.openFilterModal();

				for (const status of Object.values(ORDER_STATUS)) {
					const checkbox = ordersListPage.filterModal.getCheckboxByStatus(status);
					await expect(checkbox).not.toBeChecked();
				}
			},
		);
	});
});
