import { expect, test } from "fixtures/api.fixture";
import { generateProductData } from "data/products/generateProductData";
import { randomString } from "utils/randomStringsGeneration";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCodes";
import { orderByIdSchema } from "data/schemas/orders/getOrderById.schema";
import { negativeCasesAddComment } from "data/orders/addCommentNegativeCases";
import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";

test.describe("[API] [Sales Portal] [Orders] [Comments] [Add Comment]", () => {
	let token = "";
	let idCustomer = "";
	let idProduct = "";
	let idOrder = "";
	const idsComment: string[] = [];

	test.beforeAll(async ({ loginApiService, customersApiService, productsApi, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const customer = await customersApiService.create(token);
		idCustomer = customer._id;
		const productData = generateProductData();
		const createdProduct = await productsApi.create(productData, token);

		idProduct = createdProduct.body.Product._id;

		const createOrderForCustomer = await ordersApiService.createDraft(token, 2);
		idOrder = createOrderForCustomer._id;
	});

	test.afterEach(async ({ ordersApiService }) => {
		for (const id_comment of idsComment) {
			await ordersApiService.deleteComment(token, id_comment, idOrder);
		}
		idsComment.length = 0;
	});

	test.afterAll(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, [idOrder], [idCustomer], [idProduct]);
	});

	test("Add comment with valid length", async ({ ordersApi }) => {
		const commentValue = randomString(75);
		const addedComment = await ordersApi.addCommentToOrder(idOrder, commentValue, token);

		validateResponse(addedComment, {
			status: STATUS_CODES.OK,
			schema: orderByIdSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		expect(commentValue).toBe(addedComment.body.Order.comments?.[0]?.text);
		const firstId = addedComment.body.Order.comments?.[0]?._id;
		if (firstId) {
			idsComment.push(firstId);
		}
	});

	test("Add 2 valid comments", async ({ ordersApi }) => {
		const commentValueFirst = randomString(1);
		const commentValueSecond = randomString(250);
		const addedCommentFirst = await ordersApi.addCommentToOrder(idOrder, commentValueFirst, token);
		const addedCommentSecond = await ordersApi.addCommentToOrder(idOrder, commentValueSecond, token);

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
			idsComment.push(firstId);
		}
		if (secondId) {
			idsComment.push(secondId);
		}
	});

	test("Add comment without auth token", async ({ ordersApi }) => {
		const commentValue = randomString(75);
		const addedComment = await ordersApi.addCommentToOrder(idOrder, commentValue, "");
		validateResponse(addedComment, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	for (const addCommentNegativeCase of negativeCasesAddComment) {
		test(`Add ${addCommentNegativeCase.description}`, async ({ ordersApi }) => {
			const addedComment = await ordersApi.addCommentToOrder(
				idOrder,
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
