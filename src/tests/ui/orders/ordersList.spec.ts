import { CONFIRMATION_TEXT, CONFIRMATION_TITLE } from "data/orders/confirmationModalText";
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

	test.describe("[Navigation to Orders List Page]", () => {
		test(
			"Should open Orders List page via direct URL",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage }) => {
				await ordersListPage.open("orders");
				await ordersListPage.waitForOpened();

				await expect(ordersListPage.title).toHaveText("Orders List");
				await expect(ordersListPage.navBarMenu.moduleByName("Orders")).toHaveClass(/active/);
			},
		);

		test(
			"Should open Orders List page from Home page via 'View Orders' button",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ homePage, ordersListPage }) => {
				await homePage.clickOnViewModule("Orders");
				await ordersListPage.waitForOpened();

				await expect(ordersListPage.title).toHaveText("Orders List");
				await expect(ordersListPage.navBarMenu.moduleByName("Orders")).toHaveClass(/active/);
			},
		);

		test(
			"Should open Orders List page via Navigation Menu",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage }) => {
				await ordersListPage.navBarMenu.clickModule("Orders");
				await ordersListPage.waitForOpened();

				await expect(ordersListPage.title).toHaveText("Orders List");
				await expect(ordersListPage.navBarMenu.moduleByName("Orders")).toHaveClass(/active/);
			},
		);
	});

	test.describe("[Check UI components on Orders List Page]", () => {
		test(
			"Should display all main UI components on Orders List page",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService }) => {
				await ordersListUIService.open();

				await expect.soft(ordersListPage.title).toHaveText("Orders List");
				await expect.soft(ordersListPage.searchInput).toBeVisible();
				await expect.soft(ordersListPage.searchButton).toBeVisible();
				await expect.soft(ordersListPage.filterButton).toBeVisible();
				await expect.soft(ordersListPage.filterButton).toBeEnabled();
				await expect.soft(ordersListPage.exportButton).toBeVisible();
				await expect.soft(ordersListPage.exportButton).toBeEnabled();
				await expect.soft(ordersListPage.createOrderButton).toBeVisible();
				await expect.soft(ordersListPage.createOrderButton).toBeEnabled();
				await expect.soft(ordersListPage.table).toBeVisible();
			},
		);
	});

	test.describe("[Confirmation modals on Orders List Page]", () => {
		test(
			"Check UI components on Reopen Order Modal",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListPage.clickReopenByOrderId(canceledOrder._id);
				await ordersListPage.reopenModal.waitForOpened();

				expect(ordersListPage.reopenModal.title).toHaveText(CONFIRMATION_TITLE.REOPEN_MODAL);
				expect(ordersListPage.reopenModal.confirmationMessage).toHaveText(CONFIRMATION_TEXT.REOPEN_MODAL);
				expect(ordersListPage.reopenModal.closeButton).toBeEnabled();
				expect(ordersListPage.reopenModal.reopenButton).toBeEnabled();
				expect(ordersListPage.reopenModal.reopenButton).toHaveText("Yes, Reopen");
				expect(ordersListPage.reopenModal.cancelButton).toBeEnabled();
				expect(ordersListPage.reopenModal.cancelButton).toHaveText("Cancel");
			},
		);

		test(
			"Should close Reopen Order Modal by clicking Close",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListPage.clickReopenByOrderId(canceledOrder._id);
				await ordersListPage.reopenModal.waitForOpened();

				await ordersListPage.reopenModal.clickClose();
				await ordersListPage.reopenModal.waitForClosed();

				const orderInTable = await ordersListPage.getOrderData(canceledOrder._id);
				expect(orderInTable.status).toBe(ORDER_STATUS.CANCELED);
				await expect(ordersListPage.reopenButton(canceledOrder._id)).toBeVisible();
			},
		);

		test(
			"Should close Reopen Order Modal by clicking Cancel",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListPage.clickReopenByOrderId(canceledOrder._id);
				await ordersListPage.reopenModal.waitForOpened();

				await ordersListPage.reopenModal.clickCancel();
				await ordersListPage.reopenModal.waitForClosed();

				const orderInTable = await ordersListPage.getOrderData(canceledOrder._id);
				expect(orderInTable.status).toBe(ORDER_STATUS.CANCELED);
				await expect(ordersListPage.reopenButton(canceledOrder._id)).toBeVisible();
			},
		);

		test(
			"Should confirm action by clicking Confirm",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListPage.clickReopenByOrderId(canceledOrder._id);
				await ordersListPage.reopenModal.waitForOpened();

				await ordersListPage.reopenModal.clickReopen();
				await ordersListPage.reopenModal.waitForClosed();
				//можно добавить проверку на orderDetailsPage

				await ordersListPage.navBarMenu.clickModule("Orders");
				await ordersListPage.waitForOpened();

				const orderInTable = await ordersListPage.getOrderData(canceledOrder._id);
				expect(orderInTable.status).toBe(ORDER_STATUS.DRAFT);
				await expect(ordersListPage.reopenButton(canceledOrder._id)).not.toBeVisible();
			},
		);
	});
});
