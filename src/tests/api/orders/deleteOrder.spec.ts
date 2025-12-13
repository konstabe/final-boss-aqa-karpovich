import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Orders]", () => {
	test(
		"Delete Order",
		{
			tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.SMOKE],
		},
		async ({ loginApiService, ordersApiService, ordersApi }) => {
			const token = await loginApiService.loginAsAdmin();

			const createdOrder = await ordersApiService.createDraft(token, 1);
			const id = createdOrder._id;

			const responsefirst = await ordersApi.delete(id, token);
			expect(responsefirst.status).toBe(STATUS_CODES.DELETED);
		},
	);

	test(
		"Delete Order without TOKEN",
		{
			tag: [TAGS.ORDERS, TAGS.REGRESSION],
		},
		async ({ loginApiService, ordersApiService, ordersApi }) => {
			const token = await loginApiService.loginAsAdmin();

			const createdOrder = await ordersApiService.createDraft(token, 1);
			const id = createdOrder._id;

			const responsefirst = await ordersApi.delete(id, "");
			expect(responsefirst.status).toBe(STATUS_CODES.UNAUTHORIZED);
		},
	);
});
