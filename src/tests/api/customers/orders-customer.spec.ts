import { ERROR_MESSAGES } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { customerOrdersSchema } from "data/schemas/orders/getCustomerOrders.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { IOrder } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Customers]", () => {
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

	test.describe("[Customer Orders]", () => {
		test("Get orders for non-existent customer", { tag: [TAGS.API, TAGS.REGRESSION] }, async ({ customersApi }) => {
			const _id = "6894b2471c508c5d5e93e111";
			const getCustomerOrders = await customersApi.getOrdersForCustomer(_id, token);
			validateResponse(getCustomerOrders, {
				status: STATUS_CODES.NOT_FOUND,
				IsSuccess: false,
				ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND_WITH_ID(_id),
			});
		});

		test(
			"Get list of orders for customer without Orders",
			{ tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService }) => {
				const customer = await customersApiService.create(token);
				id_customer = customer._id;

				const getCustomerOrders = await customersApi.getOrdersForCustomer(id_customer, token);
				validateResponse(getCustomerOrders, {
					status: STATUS_CODES.OK,
					schema: customerOrdersSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});
			},
		);

		test(
			"Get orders for customer",
			{ tag: [TAGS.API, TAGS.REGRESSION, TAGS.SMOKE] },
			async ({ customersApi, customersApiService, productsApi, ordersApi }) => {
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

				const getCustomerOrders = await customersApi.getOrdersForCustomer(id_customer, token);
				validateResponse(getCustomerOrders, {
					status: STATUS_CODES.OK,
					schema: customerOrdersSchema,
					IsSuccess: true,
					ErrorMessage: null,
				});

				const ordersFromResponse = getCustomerOrders.body.Orders;
				expect(ordersFromResponse.some((order) => order._id === id_order)).toBe(true);
			},
		);

		test(
			"Get orders for customer  without TOKEN",
			{ tag: [TAGS.API, TAGS.REGRESSION] },
			async ({ customersApi, customersApiService, productsApi, ordersApi }) => {
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

				const getCustomerOrders = await customersApi.getOrdersForCustomer(id_customer, "");
				validateResponse(getCustomerOrders, {
					status: STATUS_CODES.UNAUTHORIZED,
					IsSuccess: false,
					ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
				});
			},
		);
	});
});
