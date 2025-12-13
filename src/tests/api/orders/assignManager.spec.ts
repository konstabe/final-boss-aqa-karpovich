import { ERROR_MESSAGES } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { customerOrdersSchema } from "data/schemas/orders/getCustomerOrders.schema";
import { getOrdersSchema } from "data/schemas/orders/getOrder.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { IOrder } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders]", () => {
	let token = "";
	let id_customer = "";
	let id_product = "";
	let id_order = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ productsApiService, customersApiService, ordersApiService }) => {
		if (id_order) await ordersApiService.deleteOrder(token, id_order);
		id_order = "";
		if (id_customer) await customersApiService.delete(id_customer, token);
		id_customer = "";
		if (id_product) await productsApiService.delete(token, id_product);
		id_product = "";
	});

	test.describe("[Assign a manager to an order]", () => {
		test("Assign a manager", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const orderData: IOrder = {
				customer: id_customer,
				products: [id_product],
			};

			const createOrderForCustomer = await ordersApi.create(orderData, token);
			id_order = createOrderForCustomer.body.Order._id;

			const manager_id = "692337cd1c508c5d5e95332d";

			const assignManager = await ordersApi.assignManagerToOrder(id_order, manager_id, token);
			validateResponse(assignManager, {
				status: STATUS_CODES.OK,
				schema: getOrdersSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const assignManagerFromResponse = assignManager.body.Order.assignedManager?._id;
			expect(assignManagerFromResponse).toEqual(manager_id);
		});

		test("Assign same manager again", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const orderData: IOrder = {
				customer: id_customer,
				products: [id_product],
			};

			const createOrderForCustomer = await ordersApi.create(orderData, token);
			id_order = createOrderForCustomer.body.Order._id;

			const manager_id = "692337cd1c508c5d5e95332d";
			await ordersApi.assignManagerToOrder(id_order, manager_id, token);

			const assignManager = await ordersApi.assignManagerToOrder(id_order, manager_id, token);
			validateResponse(assignManager, {
				status: STATUS_CODES.OK,
				schema: getOrdersSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const assignManagerFromResponse = assignManager.body.Order.assignedManager?._id;
			expect(assignManagerFromResponse).toEqual(manager_id);
		});

		test("Assign different manager to an order", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const orderData: IOrder = {
				customer: id_customer,
				products: [id_product],
			};

			const createOrderForCustomer = await ordersApi.create(orderData, token);
			id_order = createOrderForCustomer.body.Order._id;

			const manager1_id = "692337cd1c508c5d5e95332d";
			await ordersApi.assignManagerToOrder(id_order, manager1_id, token);

			const manager2_id = "692337cd1c508c5d5e95333f";

			const assignManager = await ordersApi.assignManagerToOrder(id_order, manager2_id, token);
			validateResponse(assignManager, {
				status: STATUS_CODES.OK,
				schema: getOrdersSchema,
				IsSuccess: true,
				ErrorMessage: null,
			});

			const assignManagerFromResponse = assignManager.body.Order.assignedManager?._id;
			expect(assignManagerFromResponse).toEqual(manager2_id);
		});

		test("Assign a manager without TOKEN", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const orderData: IOrder = {
				customer: id_customer,
				products: [id_product],
			};

			const createOrderForCustomer = await ordersApi.create(orderData, token);
			id_order = createOrderForCustomer.body.Order._id;

			const manager_id = "692337cd1c508c5d5e95332d";

			const assignManager = await ordersApi.assignManagerToOrder(id_order, manager_id, "");
			expect(assignManager.status).toBe(STATUS_CODES.UNAUTHORIZED);
		});

		test("Assign a manager to non-existent order", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const manager_id = "692337cd1c508c5d5e95332d";

			const assignManager = await ordersApi.assignManagerToOrder("693d353f1c666c5d5ebe6bb0", manager_id, token);
			validateResponse(assignManager, {
				status: STATUS_CODES.NOT_FOUND,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.ORDER_NOT_FOUND("693d353f1c666c5d5ebe6bb0"),
			});
		});

		test("Assign non-existent manager", async ({ customersApiService, productsApi, ordersApi }) => {
			const customer = await customersApiService.create(token);
			id_customer = customer._id;

			const createdProduct = await productsApi.create(generateProductData(), token);

			id_product = createdProduct.body.Product._id;

			const orderData: IOrder = {
				customer: id_customer,
				products: [id_product],
			};

			const createOrderForCustomer = await ordersApi.create(orderData, token);
			id_order = createOrderForCustomer.body.Order._id;

			const manager_id = "111111cd1c508c5d5e95332d";

			const assignManager = await ordersApi.assignManagerToOrder(id_order, manager_id, token);
			validateResponse(assignManager, {
				status: STATUS_CODES.NOT_FOUND,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.MANAGER_NOT_FOUND(manager_id),
			});
		});
	});
});
