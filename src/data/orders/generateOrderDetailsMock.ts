import { ObjectId } from "bson";
import { generateCustomerResponseData } from "data/customers/generateCustomerData";
import { generateProductResponseData } from "data/products/generateProductData";
import { generateDeliveryData } from "./generateDeliveryData";
import { faker } from "@faker-js/faker";
import { ORDER_STATUS } from "./orderStatus";
import { IOrderDelivery, IOrderResponse } from "data/types/order.types";

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
			history: [], //можно добавить
			assignedManager: null,
		},
		IsSuccess: true,
		ErrorMessage: null,
	};
}
