import { generateCustomerData } from "data/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCodes";
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

	test("Create Customer", async ({ customersApi }) => {
		const customerData = generateCustomerData();
		const createdCustomer = await customersApi.create(customerData, token);
		validateResponse(createdCustomer, {
			status: STATUS_CODES.CREATED,

			IsSuccess: true,
			ErrorMessage: null,
		});

		id = createdCustomer.body.Customer._id;

		const actualProductData = createdCustomer.body.Customer;
		expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(customerData);
	});

	test("Get All Customers", async ({ customersApi }) => {
		const response = await customersApi.getAll(token);
		console.log(response);
	});

	test("Get customer by id", async ({ customersApi, customersApiService }) => {
		const customer = await customersApiService.create(token);
		id = customer._id;
		const response = await customersApi.getById(id, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});

		console.log(response);
		expect(response.body.Customer._id).toEqual(customer._id);
	});

	test("Update", async ({ customersApi }) => {
		const customerData = generateCustomerData();
		const createdCustomer = await customersApi.create(customerData, token);
		id = createdCustomer.body.Customer._id;

		const newCustomerData = generateCustomerData();
		const response = await customersApi.update(id, newCustomerData, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});

		const updatedCustomer = response.body.Customer;
		expect(_.omit(updatedCustomer, ["_id", "createdOn"])).toEqual(newCustomerData);
		expect(id).toBe(updatedCustomer._id);
	});

	test("Search by email", async ({ customersApi }) => {
		const customerData = generateCustomerData();
		const createdCustomer = await customersApi.create(customerData, token);

		const response = await customersApi.getWithFilters(token, { search: createdCustomer.body.Customer.email });

		validateResponse(response, {
			status: STATUS_CODES.OK,
			IsSuccess: true,
			ErrorMessage: null,
		});
		const { limit, search, country, total, page, sorting } = response.body;
		// const found = response.body.Customer.find((el) => el._id === createdCustomer.body.Customer._id);
		// expect.soft(found, `Created product should be in response`).toBeTruthy();
		expect.soft(limit, `Limit should be ${limit}`).toBe(10);
		expect.soft(search).toBe(createdCustomer.body.Customer.email);
		expect.soft(country).toEqual([]);
		expect.soft(page).toBe(1);
		expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
		expect.soft(total).toBeGreaterThanOrEqual(1);
	});
});
