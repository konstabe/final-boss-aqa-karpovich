import { faker } from "@faker-js/faker";
import { ERROR_MESSAGES, NOTIFICATIONS } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { STATUS_CODES } from "data/statusCodes";
import { IOrder } from "data/types/order.types";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Comments] [Delete Comment By Id]", () => {
	let token = "";
	let id_customer = "";
	let id_product = "";
	let id_order = "";
	let id_comment = "";

	test.beforeAll(async ({ loginApiService, customersApiService, productsApi, ordersApi, ordersApiService }) => {
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

		const comment = await ordersApiService.addComment(token, faker.string.alphanumeric({ length: 75 }), id_order);
		if (comment.body.Order.comments?.[0]?._id) {
			id_comment = comment.body.Order.comments?.[0]?._id;
		}
	});

	test.afterAll(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token, [id_order], [id_customer], [id_product]);
	});

	test("Delete comment by valid id", async ({ ordersApi }) => {
		const deleteComment = await ordersApi.deleteCommentFromOrder(id_order, id_comment, token);
		expect(deleteComment.status).toBe(STATUS_CODES.DELETED);
	});

	test("Delete comment by valid without auth token", async ({ ordersApi }) => {
		const deleteComment = await ordersApi.deleteCommentFromOrder(id_order, id_comment, "");
		validateResponse(deleteComment, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
		});
	});

	test("Delete comment by invalid id", async ({ ordersApi }) => {
		const _id = "6894b2471c508c5d5e93e111";
		const deleteComment = await ordersApi.deleteCommentFromOrder(id_order, _id, token);
		validateResponse(deleteComment, {
			status: STATUS_CODES.BAD_REQUEST,
			IsSuccess: false,
			ErrorMessage: NOTIFICATIONS.COMMENT_WAS_NOT_FOUND,
		});
	});
});
