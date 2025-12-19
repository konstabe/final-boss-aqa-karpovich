import { ERROR_MESSAGES } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { getOrdersSchema } from "data/schemas/orders/getOrder.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IOrder } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Unassign a manager from an order]", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test("Unassign a manager", async ({ customersApiService, productsApi, ordersApi }) => {
		const customer = await customersApiService.create(token);
		const id_customer = customer._id;

		const createdProduct = await productsApi.create(generateProductData(), token);

		const id_product = createdProduct.body.Product._id;

		const orderData: IOrder = {
			customer: id_customer,
			products: [id_product],
		};

		const createOrderForCustomer = await ordersApi.create(orderData, token);
		const id_order = createOrderForCustomer.body.Order._id;

		const manager_id = "692337cd1c508c5d5e95332d";
		await ordersApi.assignManagerToOrder(id_order, manager_id, token);

		const unAssignManager = await ordersApi.unAssignManagerToOrder(id_order, token);
		console.log(unAssignManager);
		validateResponse(unAssignManager, {
			status: STATUS_CODES.OK,
			schema: getOrdersSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		expect(unAssignManager.body.Order.assignedManager ?? null).toBeNull();
	});

	test("Unassign a manager without TOKEN", async ({ customersApiService, productsApi, ordersApi }) => {
		const customer = await customersApiService.create(token);
		const id_customer = customer._id;

		const createdProduct = await productsApi.create(generateProductData(), token);

		const id_product = createdProduct.body.Product._id;

		const orderData: IOrder = {
			customer: id_customer,
			products: [id_product],
		};

		const createOrderForCustomer = await ordersApi.create(orderData, token);
		const id_order = createOrderForCustomer.body.Order._id;

		const manager_id = "692337cd1c508c5d5e95332d";
		await ordersApi.assignManagerToOrder(id_order, manager_id, token);

		const unAssignManager = await ordersApi.unAssignManagerToOrder(id_order, "");
		expect(unAssignManager.status).toBe(STATUS_CODES.UNAUTHORIZED);
	});

	test("Unassign a manager from non-existent order", async ({ ordersApi }) => {
		const nonExistentOrderId = "693d353f1c666c5d5ebe6bb0";
		const unAssignManager = await ordersApi.unAssignManagerToOrder(nonExistentOrderId, token);
		validateResponse(unAssignManager, {
			status: STATUS_CODES.NOT_FOUND,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.ORDER_NOT_FOUND(nonExistentOrderId),
		});
	});
});
