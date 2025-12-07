import { generateCustomerData } from "data/customers/generateCustomerData";
import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { ICustomer } from "data/types/customer.types";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
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

	test.describe("[Create Positive]", () => {
		test(
			"Create a customer with valid data with all fields",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi }) => {
				const customerData = generateCustomerData();
				const createdCustomer = await customersApi.create(customerData, token);
				validateResponse(createdCustomer, {
					status: STATUS_CODES.CREATED,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				id = createdCustomer.body.Customer._id;

				const actualProductData = createdCustomer.body.Customer;
				expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(customerData);
			},
		);

		test(
			"Create a customer with minimal required fields",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi }) => {
				const customerData = generateCustomerData({ notes: undefined });
				const createdCustomer = await customersApi.create(customerData, token);
				validateResponse(createdCustomer, {
					status: STATUS_CODES.CREATED,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				id = createdCustomer.body.Customer._id;

				const actualProductData = createdCustomer.body.Customer;
				expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(customerData);
			},
		);
	});

	test.describe("[Create Negative]", () => {
		const requiredFields: (keyof ICustomer)[] = [
			"city",
			"country",
			"email",
			"flat",
			"house",
			"name",
			"phone",
			"street",
		];
		for (const field of requiredFields) {
			test(
				`Create a customer with empty required field ${field}`,
				{ tag: [TAGS.API, TAGS.REGRESSION] },
				async ({ customersApi }) => {
					const customerData = generateCustomerData({ [field]: "" });
					const createdCustomer = await customersApi.create(customerData, token);
					validateResponse(createdCustomer, {
						status: STATUS_CODES.BAD_REQUEST,
						IsSuccess: false,
						ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
					});
				},
			);
		}

		test(
			"Create a customer without authorization token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi }) => {
				const customerData = generateCustomerData();
				const createdCustomer = await customersApi.create(customerData, "");
				validateResponse(createdCustomer, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);

		test("Create a customer with invalid token", { tag: [TAGS.API, TAGS.REGRESSION] }, async ({ customersApi }) => {
			const customerData = generateCustomerData();
			const createdCustomer = await customersApi.create(customerData, token + "1");
			validateResponse(createdCustomer, {
				status: STATUS_CODES.UNAUTHORIZED,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.INVALID_TOKEN,
			});
		});

		test(
			"Create a customer with an email that already exists",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { email, _id } = await customersApiService.create(token);
				id = _id;
				const newCustomerData = generateCustomerData({ email: email });
				const createdCustomerWithTheSameEmail = await customersApi.create(newCustomerData, token);
				validateResponse(createdCustomerWithTheSameEmail, {
					status: STATUS_CODES.CONFLICT,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CONFLICT(email),
				});
			},
		);

		test(
			"Create a customer with empty request body",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi }) => {
				const createdCustomer = await customersApi.create({} as unknown as ICustomer, token);
				validateResponse(createdCustomer, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
				});
			},
		);
	});
});
