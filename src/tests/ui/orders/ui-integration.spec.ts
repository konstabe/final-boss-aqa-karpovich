import { generateOrderMock, generateOrdersListUIMock, mapRespToTable } from "data/orders/generateOrdersListResponse";
import { ordersListDataForMock } from "data/orders/ordersListMock";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI Integration] [Orders]", () => {
	test.describe("[Orders List Page] [Render Orders List based on API response]", () => {
		for (const { title, order } of ordersListDataForMock) {
			test(
				title,
				{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
				async ({ mock, ordersListUIService, ordersListPage }) => {
					const orderMock = generateOrderMock(order);
					const ordersArray = [orderMock];
					const mockData = generateOrdersListUIMock(ordersArray);
					await mock.ordersListPage(mockData);
					await ordersListUIService.open();

					const mappedOrderMock = mapRespToTable(orderMock);

					const orderDataInTable = await ordersListPage.getOrderData(orderMock._id);
					expect(orderDataInTable).toEqual(mappedOrderMock);
				},
			);
		}

		test(
			"Should show empty table when no orders returned",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ mock, ordersListUIService, ordersListPage }) => {
				const mockData = generateOrdersListUIMock([]);
				await mock.ordersListPage(mockData);
				await ordersListUIService.open();

				await expect(ordersListPage.tableRow.first()).toHaveText("No records created yet");
				await expect(ordersListPage.tableRow).toHaveCount(1);
			},
		);

		test(
			"Should display multiple orders correctly in the table",
			{ tag: [TAGS.UI, TAGS.REGRESSION, TAGS.ORDER] },
			async ({ mock, ordersListUIService, ordersListPage }) => {
				const order1 = generateOrderMock({ status: ORDER_STATUS.DRAFT });
				const order2 = generateOrderMock({ status: ORDER_STATUS.IN_PROGRESS });
				const order3 = generateOrderMock({ status: ORDER_STATUS.RECEIVED });
				const mockOrdersArray = [order1, order2, order3];

				const mockData = generateOrdersListUIMock(mockOrdersArray);
				await mock.ordersListPage(mockData);
				await ordersListUIService.open();

				const tableData = await ordersListPage.getTableData();

				expect(tableData.length).toBe(mockOrdersArray.length);
				for (let i = 0; i < mockOrdersArray.length; i++) {
					const mappedOrderMock = mapRespToTable(mockOrdersArray[i]!);
					expect(tableData[i]).toEqual(mappedOrderMock);
				}
			},
		);
	});
});
