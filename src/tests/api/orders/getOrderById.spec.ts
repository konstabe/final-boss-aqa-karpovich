import { ERROR_MESSAGES } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { orderByIdSchema } from "data/schemas/orders/getOrderById.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IOrder } from "data/types/order.types";
import { test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Get Oreder By Id]", () => {
	let token = "";
	let id_customer = "";
	let id_product = "";
	let id_order = "";

	test.beforeAll(async ({ loginApiService, customersApiService, productsApi, ordersApi }) => {
		token = await loginApiService.loginAsAdmin();
		const customer = await customersApiService.create(token);
		id_customer = customer._id;
		const productData = generateProductData();
		const createdProduct = await productsApi.create(productData, token);

		id_product = createdProduct.body.Product._id;

		const orderData: IOrder = {
			customer: id_customer,
			products: [id_product],
		};

		const createOrderForCustomer = await ordersApi.create(orderData, token);
		id_order = createOrderForCustomer.body.Order._id;
	});

	test.afterAll(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, [id_order], [id_customer], [id_product]);
	});

	test("Get order by valid id", async ({ ordersApi }) => {
		const order = await ordersApi.getById(id_order, token);
		validateResponse(order, {
			status: STATUS_CODES.OK,
			schema: orderByIdSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
	});

	test("Get order by valid without auth token", async ({ ordersApi }) => {
		const order = await ordersApi.getById(id_order, "");
		validateResponse(order, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	test("Get order by invalid id", async ({ ordersApi }) => {
		const _id = "6894b2471c508c5d5e93e111";
		const order = await ordersApi.getById(_id, token);
		validateResponse(order, {
			status: STATUS_CODES.NOT_FOUND,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.ORDER_NOT_FOUND(_id),
		});
	});
});
