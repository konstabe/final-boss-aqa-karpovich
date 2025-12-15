import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures/api.fixture";
import { randomString } from "utils/randomStringsGeneration";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Comments] [Delete Comment By Id]", () => {
	let token = "";
	let idCustomer = "";
	let idProduct = "";
	let idOrder = "";
	let idComment = "";

	test.beforeAll(async ({ loginApiService, customersApiService, productsApi, ordersApiService }) => {
		token = await loginApiService.loginAsAdmin();
		const customer = await customersApiService.create(token);
		idCustomer = customer._id;
		const productData = generateProductData();
		const createdProduct = await productsApi.create(productData, token);

		idProduct = createdProduct.body.Product._id;

		const createOrderForCustomer = await ordersApiService.createDraft(token, 2);
		idOrder = createOrderForCustomer._id;

		const comment = await ordersApiService.addComment(token, randomString(75), idOrder);
		if (comment.body.Order.comments?.[0]?._id) {
			idComment = comment.body.Order.comments?.[0]?._id;
		}
	});

	test.afterAll(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, [idOrder], [idCustomer], [idProduct]);
	});

	test("Delete comment by valid id", async ({ ordersApi }) => {
		const deleteComment = await ordersApi.deleteCommentFromOrder(idOrder, idComment, token);
		expect(deleteComment.status).toBe(STATUS_CODES.DELETED);
	});

	test("Delete comment by valid id without auth token", async ({ ordersApi }) => {
		const deleteComment = await ordersApi.deleteCommentFromOrder(idOrder, idComment, "");
		validateResponse(deleteComment, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	test("Delete comment by invalid id", async ({ ordersApi }) => {
		const _id = "6894b2471c508c5d5e93e111";
		const deleteComment = await ordersApi.deleteCommentFromOrder(idOrder, _id, token);
		validateResponse(deleteComment, {
			status: STATUS_CODES.BAD_REQUEST,
			IsSuccess: false,
			ErrorMessage: NOTIFICATIONS.COMMENT_WAS_NOT_FOUND,
		});
	});
});
