import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders]", () => {
	test.describe("[Navigation to Orders List Page]", () => {
		test(
			"Should open Orders List page via direct URL",
			{ tag: [TAGS.UI, TAGS.REGRESSION] },
			async ({ ordersListPage }) => {
				await ordersListPage.getAuthToken();
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
				await homePage.getAuthToken();
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
			async ({ ordersListPage, ordersListUIService }) => {
				await ordersListPage.getAuthToken();
				await ordersListUIService.open();
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
			{ tag: [TAGS.UI, TAGS.REGRESSION] },
			async ({ ordersListPage, ordersListUIService }) => {
				await ordersListPage.getAuthToken();
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
});
