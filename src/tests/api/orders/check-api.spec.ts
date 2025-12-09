import { STATUS_CODES } from "data/statusCodes";
import { IOrder } from "data/types/order.types";
import { test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders]", () => {
	let token = "";
	const productsId: string[] = [];
	const customersId: string[] = [];

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	// test.afterEach(async ({ customersApiService, productsApiService }) => {
	// 	if (customersId.length) {
	// 		for (const id of customersId) {
	// 			await customersApiService.delete(id, token);
	// 		}
	// 	}
	// 	customersId.length = 0;

	// 	if (productsId.length) {
	// 		for (const id of productsId) {
	// 			await productsApiService.delete(id, token);
	// 		}
	// 	}
	// 	productsId.length = 0;
	// });

	test("Create Order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const response = await ordersApi.create(order, token);
		console.log(response);
		validateResponse(response, {
			status: STATUS_CODES.CREATED,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Get Order by Id", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const createdOrder = await ordersApi.create(order, token);
		const response = await ordersApi.getById(createdOrder.body.Order._id, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Update order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		const product1 = await productsApiService.create(token);
		const product2 = await productsApiService.create(token);
		const product3 = await productsApiService.create(token);

		const order: IOrder = {
			customer: customer._id,
			products: [product1._id, product2._id],
		};
		const createdOrder = await ordersApi.create(order, token);

		const newOrder: IOrder = {
			customer: customer._id,
			products: [product2._id, product3._id],
		};
		const response = await ordersApi.update(createdOrder.body.Order._id, newOrder, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	// test("Get customer by id", async ({ customersApi, customersApiService }) => {
	// 	const customer = await customersApiService.create(token);
	// 	id = customer._id;
	// 	const response = await customersApi.getById(id, token);
	// 	validateResponse(response, {
	// 		status: STATUS_CODES.OK,

	// 		IsSuccess: true,
	// 		ErrorMessage: null,
	// 	});

	// 	console.log(response);
	// 	expect(response.body.Customer._id).toEqual(customer._id);
	// });

	// test("Update", async ({ customersApi }) => {
	// 	const customerData = generateCustomerData();
	// 	const createdCustomer = await customersApi.create(customerData, token);
	// 	id = createdCustomer.body.Customer._id;

	// 	const newCustomerData = generateCustomerData();
	// 	const response = await customersApi.update(id, newCustomerData, token);
	// 	validateResponse(response, {
	// 		status: STATUS_CODES.OK,

	// 		IsSuccess: true,
	// 		ErrorMessage: null,
	// 	});

	// 	const updatedCustomer = response.body.Customer;
	// 	expect(_.omit(updatedCustomer, ["_id", "createdOn"])).toEqual(newCustomerData);
	// 	expect(id).toBe(updatedCustomer._id);
	// });

	// test("Search by email", async ({ customersApi }) => {
	// 	const customerData = generateCustomerData();
	// 	const createdCustomer = await customersApi.create(customerData, token);

	// 	const response = await customersApi.getWithFilters(token, { search: createdCustomer.body.Customer.email });

	// 	validateResponse(response, {
	// 		status: STATUS_CODES.OK,
	// 		IsSuccess: true,
	// 		ErrorMessage: null,
	// 	});
	// 	const { limit, search, country, total, page, sorting } = response.body;
	// 	// const found = response.body.Customer.find((el) => el._id === createdCustomer.body.Customer._id);
	// 	// expect.soft(found, `Created product should be in response`).toBeTruthy();
	// 	expect.soft(limit, `Limit should be ${limit}`).toBe(10);
	// 	expect.soft(search).toBe(createdCustomer.body.Customer.email);
	// 	expect.soft(country).toEqual([]);
	// 	expect.soft(page).toBe(1);
	// 	expect.soft(sorting).toEqual({ sortField: "createdOn", sortOrder: "desc" });
	// 	expect.soft(total).toBeGreaterThanOrEqual(1);
	// });
});
