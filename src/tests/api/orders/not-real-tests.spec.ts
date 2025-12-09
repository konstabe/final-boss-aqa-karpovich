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

	test("Delete Order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const createdOrder = await ordersApi.create(order, token);
		const response = await ordersApi.delete(createdOrder.body.Order._id, token);
		validateResponse(response, {
			status: STATUS_CODES.DELETED,
		});
	});

	test("Assign Manager To Order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const createdOrder = await ordersApi.create(order, token);
		const userId = "692337cd1c508c5d5e953327";
		const response = await ordersApi.assignManagerToOrder(createdOrder.body.Order._id, userId, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Unassign Manager To Order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const createdOrder = await ordersApi.create(order, token);
		const userId = "692337cd1c508c5d5e953327";
		await ordersApi.assignManagerToOrder(createdOrder.body.Order._id, userId, token);
		const unAssignResp = await ordersApi.unAssignManagerToOrder(createdOrder.body.Order._id, token);
		validateResponse(unAssignResp, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Add Comment to Order", async ({ customersApiService, productsApiService, ordersApi }) => {
		const customer = await customersApiService.create(token);
		customersId.push(customer._id);
		const product = await productsApiService.create(token);
		productsId.push(product._id);

		const order: IOrder = {
			customer: customer._id,
			products: [product._id],
		};
		const createdOrder = await ordersApi.create(order, token);
		const response = await ordersApi.addCommentToOrder(createdOrder.body.Order._id, "jljklkl", token);
		validateResponse(response, {
			status: STATUS_CODES.OK,

			IsSuccess: true,
			ErrorMessage: null,
		});
	});
});
