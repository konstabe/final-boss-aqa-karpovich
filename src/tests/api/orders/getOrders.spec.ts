import { test, expect } from "fixtures/api.fixture.js";
import { STATUS_CODES } from "data/statusCodes.js";
import { TAGS } from "data/tags.js";
import { SortOrder } from "data/types/core.types.js";
import { OrderSortField } from "data/types/order.types.js";
import { returnSortedArrayWithOrder } from "utils/comprare.utils.js";
import { validateResponse } from "utils/validation/validateResponse.utils.js";
import { validateJsonSchema } from "utils/validation/validateSchema.utils.js";
import { getAllOrdersSchema } from "data/schemas/orders/getOrder.schema.js";
import { ORDER_STATUS } from "data/orders/orderStatus.js";

test.describe("Get orders all", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.describe("positive", () => {
		test("get order list", { tag: TAGS.API }, async ({ ordersApi }) => {
			const response = await ordersApi.get(token);
			validateJsonSchema(response, getAllOrdersSchema);
		});

		const fields: OrderSortField[] = ["createdOn", "total_price", "status"];
		const orders: SortOrder[] = ["asc", "desc"];

		for (const field of fields) {
			test(`sort by ${field}`, async ({ ordersApi }) => {
				for (const order of orders) {
					await test.step(`sort order ${order}`, async () => {
						const response = await ordersApi.get(token, {
							sortField: field,
							sortOrder: order,
						});

						validateResponse(response, { status: STATUS_CODES.OK });

						const sorted = returnSortedArrayWithOrder(response.body.Orders, field, order);

						expect(response.body.Orders).toEqual(sorted);
					});
				}
			});
		}

		const statuses = Object.values(ORDER_STATUS);

		for (const status of statuses) {
			test(`filter orders by status: ${status}`, { tag: TAGS.API }, async ({ ordersApi }) => {
				const response = await ordersApi.get(token, {
					status: [status],
				});

				for (const order of response.body.Orders) {
					expect(order.status).toBe(status);
				}
			});
		}
	});

	test.describe("negative", () => {
		test("get orders without token", { tag: TAGS.API }, async ({ ordersApi }) => {
			const response = await ordersApi.get("");

			validateResponse(response, { status: STATUS_CODES.UNAUTHORIZED });
		});
	});
});
