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
		async ({ ordersListPage, ordersListUIService, exportOrderModal }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await expect(exportOrderModal.editProductModalTitle).toHaveText("Export Data");

			await expect(exportOrderModal.downloadButton).toBeVisible();
			await expect(exportOrderModal.cancelButton).toBeVisible();
			await expect(exportOrderModal.closeModalIcon).toBeVisible();

			await expect(exportOrderModal.csvFormat).toBeVisible();
			await expect(exportOrderModal.jsonFormat).toBeVisible();

			await expect(exportOrderModal.exportFilteredToggle).toBeVisible();
			await expect(exportOrderModal.exportAllToggle).toBeVisible();

			await expect(exportOrderModal.selectAllFields).toBeVisible();
			await expect(exportOrderModal.statusExportField).toBeVisible();
			await expect(exportOrderModal.totalPriceExportField).toBeVisible();
			await expect(exportOrderModal.deliveryExportField).toBeVisible();
			await expect(exportOrderModal.customerExportField).toBeVisible();
			await expect(exportOrderModal.productsExportField).toBeVisible();
			await expect(exportOrderModal.assignedManagerExportField).toBeVisible();
			await expect(exportOrderModal.createdOnExportField).toBeVisible();
		},
	);

	test(
		"Check that download button disabled",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, exportOrderModal }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();

			await exportOrderModal.selectFields("Status");
			await exportOrderModal.selectFields("Total Price");
			await exportOrderModal.selectFields("Customer");
			await exportOrderModal.selectFields("Products");
			await exportOrderModal.selectFields("Created On");

			await expect(exportOrderModal.downloadButton).toBeDisabled();

			await exportOrderModal.selectFields("Delivery");
			await expect(exportOrderModal.downloadButton).toBeEnabled();
		},
	);

	test(
		"Close Modal via Close Icon",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, exportOrderModal }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();
			await exportOrderModal.clickCloseIcon();
			await expect(exportOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Close Modal via Cancel Button",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, exportOrderModal }) => {
			await ordersListUIService.open();
			await ordersListPage.clickExport();
			await exportOrderModal.checkSelectAllFields();
			await exportOrderModal.clickCancelButton();
			await expect(exportOrderModal.modalBody).not.toBeVisible();
		},
	);

	test(
		"Check notification after data export",
		{
			tag: [TAGS.REGRESSION, TAGS.UI, TAGS.SMOKE],
		},
		async ({ ordersListPage, ordersListUIService, exportOrderModal, ordersApiService }) => {
			ordersApiService.createDraft(token, 1);
			await ordersListUIService.open();
			await ordersListPage.clickExport();
			await exportOrderModal.clickDownloadButton();
			await expect(ordersListPage.toastMessage).toContainText(NOTIFICATIONS.DATA_EXPORTED);
		},
	);

	test(
		"Download JSON file",
		{
			tag: [TAGS.REGRESSION, TAGS.UI],
		},
		async ({ ordersListPage, ordersListUIService, exportOrderModal, ordersApiService }) => {
			ordersApiService.createDraft(token, 1);
			await ordersListUIService.open();
			await ordersListPage.clickExport();
			await exportOrderModal.selectFileFormat("JSON");
			await exportOrderModal.clickDownloadButton();
		},
	);
});
