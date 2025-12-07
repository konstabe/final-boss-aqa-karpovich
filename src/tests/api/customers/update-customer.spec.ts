import { COUNTRIES } from "data/customers/countries";
import { generateCustomerData } from "data/customers/generateCustomerData";
import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { ICustomer } from "data/types/customer.types";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { getDifferentEnumValue } from "utils/enum.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers]", () => {
	let token = "";
	let ids: string[] = [];

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

	test.describe("[Update Positive]", () => {
		test(
			"Update a customer with valid data for all fields",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { _id } = await customersApiService.create(token);
				ids.push(_id);
				const newCustomerData = generateCustomerData();
				const updatedCustomer = await customersApi.update(_id, newCustomerData, token);
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.OK,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const actualProductData = updatedCustomer.body.Customer;
				expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(newCustomerData);
			},
		);

		test(
			"Update a customer with valid data with minimal required fields",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { _id, ...originalData } = await customersApiService.create(token);
				ids.push(_id);
				const newCustomerData = generateCustomerData();
				const newCustomerDataTheSameNotes = { ...newCustomerData, notes: originalData.notes };
				const updatedCustomer = await customersApi.update(_id, newCustomerDataTheSameNotes, token);
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.OK,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const actualProductData = updatedCustomer.body.Customer;
				expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(newCustomerDataTheSameNotes);
			},
		);

		const fieldsForUpdate: (keyof ICustomer)[] = [
			"city",
			"country",
			"email",
			"flat",
			"house",
			"name",
			"phone",
			"street",
			"notes",
		];
		for (const field of fieldsForUpdate) {
			test(
				`Update a customer with field ${field}`,
				{ tag: [TAGS.API, TAGS.REGRESSION] },
				async ({ customersApi, customersApiService }) => {
					const { _id, ...originalData } = await customersApiService.create(token);
					ids.push(_id);
					let newValue;
					if (field === "country") {
						newValue = getDifferentEnumValue(COUNTRIES, originalData.country);
					} else {
						newValue = generateCustomerData()[field];
					}
					const newCustomerData = { ...originalData, [field]: newValue };
					const updatedCustomer = await customersApi.update(_id, newCustomerData, token);
					validateResponse(updatedCustomer, {
						status: STATUS_CODES.OK,
						schema: createCustomerSchema,
						IsSuccess: true,
						ErrorMessage: null,
					});

					const actualProductData = updatedCustomer.body.Customer;
					expect(_.omit(actualProductData, ["_id"])).toEqual(newCustomerData);
				},
			);
		}
	});

	test.describe("[Update Negative]", () => {
		test(
			"Update a customer without authorization token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { _id } = await customersApiService.create(token);
				ids.push(_id);
				const newCustomerData = generateCustomerData();
				const updatedCustomer = await customersApi.update(_id, newCustomerData, "");
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);

		test(
			"Update a customer with invalid token",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { _id } = await customersApiService.create(token);
				ids.push(_id);
				const newCustomerData = generateCustomerData();
				const updatedCustomer = await customersApi.update(_id, newCustomerData, token + "1");
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.INVALID_TOKEN,
				});
			},
		);

		test(
			"Update a customer with empty request body",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const { _id } = await customersApiService.create(token);
				ids.push(_id);
				const updatedCustomer = await customersApi.update(_id, {} as unknown as ICustomer, token);
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.BAD_REQUEST,
					IsSuccess: false,
					ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
				});
			},
		);

		test(
			"Update a customer using an email that already exists",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer1 = await customersApiService.create(token);
				ids.push(customer1._id);
				const existsEmail = customer1.email;
				const customer2 = await customersApiService.create(token);
				const newCustomerData = generateCustomerData({ email: existsEmail });
				ids.push(customer2._id);
				const updatedCustomer = await customersApi.update(customer2._id, newCustomerData, token);
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.CONFLICT,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.CONFLICT(existsEmail),
				});
			},
		);
	});
});
