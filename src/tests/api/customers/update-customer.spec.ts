import { COUNTRIES } from "data/customers/countries";
import { generateCustomerData } from "data/customers/generateCustomerData";
// import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "data/types/customer.types";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { getDifferentEnumValue } from "utils/enum.utils";
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

	test.describe("[Update Positive]", () => {
		test("Update a customer with valid data for all fields", async ({ customersApi, customersApiService }) => {
			const { _id } = await customersApiService.create(token);
			id = _id;
			const newCustomerData = generateCustomerData();
			const updatedCustomer = await customersApi.update(id, newCustomerData, token);
			validateResponse(updatedCustomer, {
				status: STATUS_CODES.OK,
				schema: createCustomerSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const actualProductData = updatedCustomer.body.Customer;
			expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(newCustomerData);
		});

		test("Update a customer with valid data with minimal required fields", async ({
			customersApi,
			customersApiService,
		}) => {
			const { _id, ...originalData } = await customersApiService.create(token);
			id = _id;
			const newCustomerData = generateCustomerData();
			const newCustomerDataTheSameNotes = { ...newCustomerData, notes: originalData.notes };
			const updatedCustomer = await customersApi.update(id, newCustomerDataTheSameNotes, token);
			validateResponse(updatedCustomer, {
				status: STATUS_CODES.OK,
				schema: createCustomerSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const actualProductData = updatedCustomer.body.Customer;
			expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(newCustomerDataTheSameNotes);
		});

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
			test(`Update a customer with field ${field}`, async ({ customersApi, customersApiService }) => {
				const { _id, ...originalData } = await customersApiService.create(token);
				id = _id;
				let newValue;
				if (field === "country") {
					newValue = getDifferentEnumValue(COUNTRIES, originalData.country);
				} else {
					newValue = generateCustomerData()[field];
				}
				const newCustomerData = { ...originalData, [field]: newValue };
				const updatedCustomer = await customersApi.update(id, newCustomerData, token);
				validateResponse(updatedCustomer, {
					status: STATUS_CODES.OK,
					schema: createCustomerSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const actualProductData = updatedCustomer.body.Customer;
				expect(_.omit(actualProductData, ["_id"])).toEqual(newCustomerData);
			});
		}
	});

	test.describe("[Update Negative]", () => {});
});
