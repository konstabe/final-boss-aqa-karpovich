import { expect, test } from "fixtures/api.fixture";
import { generateProductData } from "data/products/generateProductData";
import { IOrder } from "data/types/order.types";
import { randomString } from "utils/rendomStringsGeneration";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCodes";
import { orderByIdSchema } from "data/schemas/orders/getOrderById.schema";
import { negativeCasesAddComment } from "data/orders/addCommentNegativeCases";
import { faker } from "@faker-js/faker";
import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";

test.describe("[API] [Sales Portal] [Orders] [Comments] [Add Comment]", () => {
	let token = "";
	let id_customer = "";
	let id_product = "";
	let id_order = "";
	const ids_comment: string[] = [];

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

	test.afterEach(async ({ ordersApiService }) => {
		for (const id_comment of ids_comment) {
			await ordersApiService.deleteComment(token, id_comment, id_order);
		}
		ids_comment.length = 0;
	});

	test.afterAll(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, [id_order], [id_customer], [id_product]);
	});

	test("Add comment with valid length", async ({ ordersApi }) => {
		const commentValue = faker.string.alphanumeric({ length: 75 });
		const addedComment = await ordersApi.addCommentToOrder(id_order, commentValue, token);

		validateResponse(addedComment, {
			status: STATUS_CODES.OK,
			schema: orderByIdSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		expect(commentValue).toBe(addedComment.body.Order.comments?.[0]?.text);
		const firstId = addedComment.body.Order.comments?.[0]?._id;
		if (firstId) {
			ids_comment.push(firstId);
		}
	});

	test("Add 2 valid comments", async ({ ordersApi }) => {
		const commentValueFirst = faker.string.alphanumeric({ length: 1 });
		const commentValueSecond = faker.string.alphanumeric({ length: 250 });
		const addedCommentFirst = await ordersApi.addCommentToOrder(id_order, commentValueFirst, token);
		const addedCommentSecond = await ordersApi.addCommentToOrder(id_order, commentValueSecond, token);

		validateResponse(addedCommentFirst, {
			status: STATUS_CODES.OK,
			schema: orderByIdSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});
		validateResponse(addedCommentSecond, {
			status: STATUS_CODES.OK,
			schema: orderByIdSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		expect(commentValueFirst).toBe(addedCommentSecond.body.Order.comments?.[0]?.text);
		expect(commentValueSecond).toBe(addedCommentSecond.body.Order.comments?.[1]?.text);
		const firstId = addedCommentFirst.body.Order.comments?.[0]?._id;
		const secondId = addedCommentFirst.body.Order.comments?.[1]?._id;
		if (firstId) {
			ids_comment.push(firstId);
		}
		if (secondId) {
			ids_comment.push(secondId);
		}
	});

	test("Add comment without auth token", async ({ ordersApi }) => {
		const commentValue = randomString(75);
		const addedComment = await ordersApi.addCommentToOrder(id_order, commentValue, "");
		validateResponse(addedComment, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	for (const addCommentNegativeCase of negativeCasesAddComment) {
		test(`Add ${addCommentNegativeCase.description}`, async ({ ordersApi }) => {
			const addedComment = await ordersApi.addCommentToOrder(
				id_order,
				addCommentNegativeCase.testData.comment,
				token,
			);
			console.log(addedComment);
			validateResponse(addedComment, {
				status: addCommentNegativeCase.testData.responseCode,
				IsSuccess: false,
				ErrorMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
			});
		});
	}
});
