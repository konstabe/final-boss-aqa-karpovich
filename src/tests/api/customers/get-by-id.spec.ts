import { ObjectId } from "bson";
import { ERROR_MESSAGES } from "data/notifications";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers]", () => {
	let token = "";
	let id = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ customersApiService }) => {
		if (id) await customersApiService.delete(id, token);
		id = "";
	});

	test.describe("[Get By ID Positive]", () => {
		test(
			"Get customer by existing ID",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id = customer._id;
				const receivedCustomer = await customersApi.getById(id, token);
				validateResponse(receivedCustomer, {
					status: STATUS_CODES.OK,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});
				const actualCustomerData = receivedCustomer.body.Customer;
				expect(actualCustomerData).toEqual(customer);
			},
		);
	});

	test.describe("[Get By ID Negative]", () => {
		test(
			"Get customer by non-existing ID",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id = customer._id;
				const generatedId = new ObjectId().toHexString();
				const receivedCustomer = await customersApi.getById(generatedId, token);
				validateResponse(receivedCustomer, {
					status: STATUS_CODES.NOT_FOUND,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND(generatedId),
				});
			},
		);

		test(
			"Get customer by existing ID without token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id = customer._id;
				const receivedCustomer = await customersApi.getById(id, "");
				validateResponse(receivedCustomer, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);

		test(
			"Get customer by existing ID with invalid token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id = customer._id;
				const receivedCustomer = await customersApi.getById(id, token + "1");
				validateResponse(receivedCustomer, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_TOKEN,
				});
			},
		);
	});
});
