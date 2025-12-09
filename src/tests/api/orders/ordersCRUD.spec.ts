import { orderResponseSchema } from "data/schemas/orders/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders]", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});
	test.describe("[Create Positive]", () => {
		test("Create order", { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ ordersApi }) => {
			const createdOrder = await ordersApi.create(
				"693835db1c508c5d5e9ccecc",
				["693835db1c508c5d5e9ccec7"],
				token,
			);
			validateResponse(createdOrder, {
				status: STATUS_CODES.CREATED,
				schema: orderResponseSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});
		});
	});
});
