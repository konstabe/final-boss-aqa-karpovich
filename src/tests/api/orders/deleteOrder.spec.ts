import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";
import { ERROR_MESSAGES } from "data/notifications";

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
			validateResponse(responsefirst, {
				status: STATUS_CODES.UNAUTHORIZED,
				schema: errorSchema,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
			});
			expect(responsefirst.status).toBe(STATUS_CODES.UNAUTHORIZED);
		},
	);
});
