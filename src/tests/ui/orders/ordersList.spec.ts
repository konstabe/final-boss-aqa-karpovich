import { CONFIRMATION_MODAL_TEXT } from "data/orders/modalText";
import { generateOrderMock, generateOrdersListUIMock } from "data/orders/generateOrdersListResponse";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders]", () => {
	let token = "";

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
			{ tag: [TAGS.UI, TAGS.REGRESSION] },
			async ({ homePage, ordersListPage, homeUIService }) => {
				await homeUIService.open();
				await homePage.clickOnViewModule("Orders");
				await ordersListPage.waitForOpened();

				await expect(ordersListPage.title).toHaveText("Orders List");
				await expect(ordersListPage.navBarMenu.moduleByName("Orders")).toHaveClass(/active/);
			},
		);

		test(
			"Should open Orders List page via Navigation Menu",
			{ tag: [TAGS.UI, TAGS.REGRESSION] },
			async ({ ordersListPage, homeUIService }) => {
				await homeUIService.open();
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
			async ({ ordersListPage, ordersListUIService, mock }) => {
				const order = generateOrderMock({ status: ORDER_STATUS.CANCELED });
				const mockData = generateOrdersListUIMock([order]);
				await mock.ordersListPage(mockData);

				await ordersListUIService.open();
				await ordersListUIService.clickReopenOrder(order._id);

				expect(ordersListPage.reopenModal.title).toHaveText(CONFIRMATION_MODAL_TEXT.reopen.title);
				expect(ordersListPage.reopenModal.confirmationMessage).toHaveText(CONFIRMATION_MODAL_TEXT.reopen.body);
				expect(ordersListPage.reopenModal.closeButton).toBeEnabled();
				expect(ordersListPage.reopenModal.reopenButton).toBeEnabled();
				expect(ordersListPage.reopenModal.reopenButton).toHaveText(
					CONFIRMATION_MODAL_TEXT.reopen.confirmButton,
				);
				expect(ordersListPage.reopenModal.cancelButton).toBeEnabled();
				expect(ordersListPage.reopenModal.cancelButton).toHaveText(CONFIRMATION_MODAL_TEXT.cancelButton);
			},
		);

		test(
			"Should close Reopen Order Modal by clicking Close",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListUIService.clickReopenOrder(canceledOrder._id);

				await ordersListUIService.closeModal("reopenModal");

				const orderInTable = await ordersListPage.getOrderData(canceledOrder._id);
				expect(orderInTable.status).toBe(ORDER_STATUS.CANCELED);
				await expect(ordersListPage.reopenButton(canceledOrder._id)).toBeVisible();
			},
		);

		test(
			"Should close Reopen Order Modal by clicking Cancel",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListUIService.clickReopenOrder(canceledOrder._id);

				await ordersListUIService.cancelModal("reopenModal");

				const orderInTable = await ordersListPage.getOrderData(canceledOrder._id);
				expect(orderInTable.status).toBe(ORDER_STATUS.CANCELED);
				await expect(ordersListPage.reopenButton(canceledOrder._id)).toBeVisible();
			},
		);

		test(
			"Should confirm action by clicking Confirm",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ ordersListPage, ordersListUIService, ordersApiService }) => {
				token = await ordersListPage.getAuthToken();
				const canceledOrder = await ordersApiService.cancelOrderInProgress(token, 1);
				await ordersListUIService.open();
				await ordersListUIService.clickReopenOrder(canceledOrder._id);

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
