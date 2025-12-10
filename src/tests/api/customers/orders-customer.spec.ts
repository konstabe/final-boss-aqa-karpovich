import { ERROR_MESSAGES } from "data/notifications";
import { customerOrdersSchema } from "data/schemas/orders/getCustomerOrders.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers]", () => {
	let token = "";
	let ids: string[] = [];
	let id = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ customersApiService }) => {
		if (ids.length) {
			for (const id of ids) {
				await customersApiService.delete(id, token);
			}
		}
		ids = [];
	});

	test.describe("[Customer Orders]", () => {
		test(
			"Get orders for non-existent customer",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi }) => {
				const _id = "6894b2471c508c5d5e93e111";
				const getCustomerOrders = await customersApi.getOrdersForCustomer(_id, token);
				validateResponse(getCustomerOrders, {
					status: STATUS_CODES.NOT_FOUND,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.ORDER_NOT_FOUND(_id),
				});
			},
		);

		test(
			"Get list of orders for customer without Orders",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id = customer._id;

				const getCustomerOrders = await customersApi.getOrdersForCustomer(id, token);
				validateResponse(getCustomerOrders, {
					status: STATUS_CODES.OK,
					schema: customerOrdersSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});
			},
		);

		test.skip(
			"Get orders for customer without TOKEN",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, ordersApi }) => {},
		);

		test.skip(
			"Get orders for customer",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, ordersApi }) => {},
		);
	});
});
