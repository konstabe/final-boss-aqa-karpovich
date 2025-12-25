import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders]", () => {
	let token = "";

	test.beforeEach(async ({ loginUIService }) => {
		//убрать, когда появится global setup
		token = await loginUIService.loginAsAdmin();
	});

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

				await expect(ordersListPage.filterModal.title).toHaveText("Filters");
				await expect(ordersListPage.filterModal.closeButton).toBeEnabled();
				await expect(ordersListPage.filterModal.applyButton).toBeEnabled();
				await expect(ordersListPage.filterModal.applyButton).toHaveText("Apply");
				await expect(ordersListPage.filterModal.clearFiltersButton).toBeEnabled();
				await expect(ordersListPage.filterModal.clearFiltersButton).toHaveText("Clear Filters");

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
				await ordersApiService.createDraft(token, 1);
				await ordersApiService.processOrder(token, 1);
				await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersApiService.allReceived(token, 1);
				const order = await ordersApiService.processOrder(token, 4);
				await ordersApiService.partiallyReceived(token, order, 2);

				await ordersListUIService.open();

				for (const status of Object.values(ORDER_STATUS)) {
					await ordersListUIService.openFilterModal();
					await ordersListPage.filterModal.checkCheckboxByStatus(status);
					await ordersListPage.filterModal.clickApply();
					await ordersListPage.filterModal.waitForClosed();

					await ordersListPage.waitForOpened();
					const tableData = await ordersListPage.getTableData();
					tableData.forEach((row) => expect(row.status).toBe(status));
					await expect(ordersListPage.filtredOrdersButtons).toHaveCount(1);
					await expect(ordersListPage.filtredOrdersButtons).toHaveText(status);

					await ordersListUIService.openFilterModal();
					await ordersListPage.filterModal.uncheckCheckboxByStatus(status);

					await ordersListPage.filterModal.clickApply();
					await ordersListPage.filterModal.waitForClosed();
					await expect(ordersListPage.filtredOrdersButtons).toHaveCount(0);
				}
			},
		);
		test(
			"Should apply multiple filters and update orders table",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				await ordersApiService.createDraft(token, 1);
				await ordersApiService.processOrder(token, 1);
				await ordersApiService.cancelOrderInProgress(token, 1);

				await ordersListUIService.open();
				await ordersListUIService.openFilterModal();

				const statusesForFilter = [ORDER_STATUS.DRAFT, ORDER_STATUS.IN_PROGRESS];
				await ordersListPage.filterModal.chooseCheckboxForFilter(statusesForFilter);

				await ordersListPage.filterModal.clickApply();
				await ordersListPage.filterModal.waitForClosed();

				await ordersListPage.waitForOpened();
				await expect(ordersListPage.filtredOrdersButtons).toHaveCount(statusesForFilter.length);
				const filterButtonText = await ordersListPage.filtredOrdersButtons.allInnerTexts();
				expect(filterButtonText).toEqual(statusesForFilter);

				const tableData = await ordersListPage.getTableData();
				const tableStatuses = [...new Set(tableData.map((row) => row.status))];

				expect(tableStatuses.sort()).toEqual(statusesForFilter.sort());
			},
		);

		test(
			"Should clear filter by clicking Clear Filters Button",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
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
