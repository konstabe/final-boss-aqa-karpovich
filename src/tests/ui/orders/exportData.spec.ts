import { NOTIFICATIONS } from "data/notifications";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [exportDataModal]", () => {
	let token = "";

	test.beforeEach(async ({ ordersListPage }) => {
		token = await ordersListPage.getAuthToken();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test(
		"Check UI components",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await expect(ordersListPage.exportOrderModal.editProductModalTitle).toHaveText("Export Data");

			await expect(ordersListPage.exportOrderModal.downloadButton).toBeVisible();
			await expect(ordersListPage.exportOrderModal.cancelButton).toBeVisible();
			await expect(ordersListPage.exportOrderModal.closeModalIcon).toBeVisible();

			await expect(ordersListPage.exportOrderModal.csvFormat).toBeVisible();
			await expect(ordersListPage.exportOrderModal.jsonFormat).toBeVisible();

			await expect(ordersListPage.exportOrderModal.exportFilteredToggle).toBeVisible();
			await expect(ordersListPage.exportOrderModal.exportAllToggle).toBeVisible();

			await expect(ordersListPage.exportOrderModal.selectAllFields).toBeVisible();
			await expect(ordersListPage.exportOrderModal.statusExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.totalPriceExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.deliveryExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.customerExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.productsExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.assignedManagerExportField).toBeVisible();
			await expect(ordersListPage.exportOrderModal.createdOnExportField).toBeVisible();
		},
	);

	test(
		"Check that download button disabled",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await ordersListPage.exportOrderModal.selectFields("Status");
			await ordersListPage.exportOrderModal.selectFields("Total Price");
			await ordersListPage.exportOrderModal.selectFields("Customer");
			await ordersListPage.exportOrderModal.selectFields("Products");
			await ordersListPage.exportOrderModal.selectFields("Created On");

			await expect(ordersListPage.exportOrderModal.downloadButton).toBeDisabled();

			await ordersListPage.exportOrderModal.selectFields("Delivery");
			await expect(ordersListPage.exportOrderModal.deliveryExportField).toBeChecked();
			await expect(ordersListPage.exportOrderModal.downloadButton).toBeEnabled();
		},
	);

	test(
		"Close Modal via Close Icon",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();
			await ordersListPage.exportOrderModal.clickCloseIcon();
		},
	);

	test(
		"Close Modal via Cancel Button",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await ordersListPage.exportOrderModal.checkSelectAllFields();

			await ordersListPage.exportOrderModal.clickCancelButton();
		},
	);

	test(
		"Check notification after data export",
		{
			tag: [TAGS.REGRESSION, TAGS.UI, TAGS.SMOKE],
		},
		async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
			ordersApiService.createDraft(token, 1);
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await ordersListPage.exportOrderModal.clickDownloadButton();

			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.DATA_EXPORTED);
		},
	);

	test(
		"Download JSON file",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
			ordersApiService.createDraft(token, 1);
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			const { fileName } = await ordersListPage.exportOrderModal.downloadFile("JSON");

			await expect(fileName).toEqual("data.json");
		},
	);

	test(
		"Download CSV file",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
			ordersApiService.createDraft(token, 1);
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			const { fileName } = await ordersListPage.exportOrderModal.downloadFile("CSV");

			await expect(fileName).toEqual("data.csv");
		},
	);
});
