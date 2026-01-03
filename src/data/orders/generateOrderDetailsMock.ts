import { ObjectId } from "bson";
import { generateCustomerResponseData } from "data/customers/generateCustomerData";
import { generateProductResponseData } from "data/products/generateProductData";
import { generateDeliveryData } from "./generateDeliveryData";
import { faker } from "@faker-js/faker";
import { ORDER_STATUS } from "./orderStatus";
import { IOrderDelivery, IOrderResponse } from "data/types/order.types";
import { generateOrderHistoryByActions } from "./generateOrderHistorydata";
import { ORDER_HISTORY_ACTIONS } from "data/orderHistoryActions";

export function generateOrderDetailsMockWithDelivery(status: ORDER_STATUS, received: boolean): IOrderResponse {
	return {
		Order: {
			_id: new ObjectId().toHexString(),
			status: status,
			customer: generateCustomerResponseData(),
			products: [{ ...generateProductResponseData(), received: received }],
			delivery: generateDeliveryData() as IOrderDelivery,
			total_price: faker.number.int({ min: 1, max: 100000 }),
			createdOn: new Date().toISOString(),
			comments: [],
			history: generateOrderHistoryByActions([
				ORDER_HISTORY_ACTIONS.CREATED,
				ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
				ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED,
				ORDER_HISTORY_ACTIONS.DELIVERY_EDITED,
				ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED,
				ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED,
				ORDER_HISTORY_ACTIONS.REOPENED,
				ORDER_HISTORY_ACTIONS.PROCESSED,
				ORDER_HISTORY_ACTIONS.RECEIVED,
				ORDER_HISTORY_ACTIONS.RECEIVED_ALL,
				ORDER_HISTORY_ACTIONS.CANCELED,
				ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED,
			]),
			assignedManager: null,
		},
		IsSuccess: true,
		ErrorMessage: null,
	};
}
