import { ERROR_MESSAGES } from "data/notifications";
import { generateDeliveryData } from "data/orders/generateDeliveryData";
import { getOrdersSchema } from "data/schemas/orders/getOrder.schema";
import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API] [Sales Portal] [Orders] [Update delivery details of an order]", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.afterEach(async ({ ordersApiService }) => {
		await ordersApiService.fullDelete(token);
	});

	test("Update delivery details of an order", async ({ ordersApi, ordersApiService }) => {
		const createOrderForCustomer = await ordersApiService.createDraft(token, 1);
		const id_order = createOrderForCustomer._id;

		const delivaryData = generateDeliveryData();

		const deliveryDetails = await ordersApi.updateDeliveryDetails(id_order, delivaryData, token);
		validateResponse(deliveryDetails, {
			status: STATUS_CODES.OK,
			schema: getOrdersSchema,
			IsSuccess: true,
			ErrorMessage: null,
		});

		const deliveryDetailsFromResponse = deliveryDetails.body.Order.delivery;
		console.log(deliveryDetailsFromResponse);
		expect(deliveryDetailsFromResponse).toMatchObject({ ...delivaryData });
	});

	test("Update delivery details to non-existent order", async ({ ordersApi }) => {
		const delivaryData = generateDeliveryData();

		const deliveryDetails = await ordersApi.updateDeliveryDetails("693d353f1c666c5d5ebe6bb0", delivaryData, token);
		validateResponse(deliveryDetails, {
			status: STATUS_CODES.NOT_FOUND,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.ORDER_NOT_FOUND("693d353f1c666c5d5ebe6bb0"),
		});
	});

	test("Update delivery details without invalid delivery date", async ({ ordersApi, ordersApiService }) => {
		const createOrderForCustomer = await ordersApiService.createDraft(token, 1);
		const id_order = createOrderForCustomer._id;

		const deliveryData = {
			finalDate: "",
			address: {
				country: "Belarus",
				city: "Roelchester",
				street: "County Road",
				house: 17,
				flat: 525,
			},
			condition: "Pickup",
		};

		const deliveryDetails = await ordersApi.updateDeliveryDetails(id_order, deliveryData, token);
		validateResponse(deliveryDetails, {
			status: STATUS_CODES.BAD_REQUEST,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.INVALID_DELIVERY_DATE,
		});
	});

	test("Update delivery details of an order without TOKEN", async ({ ordersApi, ordersApiService }) => {
		const createOrderForCustomer = await ordersApiService.createDraft(token, 1);
		const id_order = createOrderForCustomer._id;

		const delivaryData = generateDeliveryData();

		const deliveryDetails = await ordersApi.updateDeliveryDetails(id_order, delivaryData, "");
		validateResponse(deliveryDetails, {
			status: STATUS_CODES.UNAUTHORIZED,
			IsSuccess: false,
			ErrorMessage: ERROR_MESSAGES.NOT_AUTHORIZED,
		});
	});
});
