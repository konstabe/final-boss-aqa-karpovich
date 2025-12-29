import { ObjectId } from "bson";
import { generateCustomerResponseData } from "data/customers/generateCustomerData";
import { generateProductResponseData } from "data/products/generateProductData";
import { generateDeliveryData } from "./generateDeliveryData";
import { faker } from "@faker-js/faker";
import { ORDER_STATUS } from "./orderStatus";
import { IOrderDelivery, IOrderResponse } from "data/types/order.types";
import { generateOrderHistoryByStatuses } from "./generateOrderHistorydata";

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
			history: generateOrderHistoryByStatuses([
				ORDER_STATUS.DRAFT, //работает
				//ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
				// ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED,
				// ORDER_HISTORY_ACTIONS.DELIVERY_EDITED,
				// ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED,
				// ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED,
				// ORDER_HISTORY_ACTIONS.REOPENED,
			]),
			assignedManager: null,
		},
		IsSuccess: true,
		ErrorMessage: null,
	};
}
