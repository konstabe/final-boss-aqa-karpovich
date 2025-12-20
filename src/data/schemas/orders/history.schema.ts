import { ORDER_STATUS } from "data/orders/orderStatus";
import { productForOrdersSchema } from "./productForOrders.schema";
import { assignedManagerSchema } from "./assignedManager.schema";
import { deliverySchema } from "./delivery.schema";

export const historySchema = {
	type: "object",
	properties: {
		status: {
			type: "string",
			enum: Object.values(ORDER_STATUS),
		},
		customer: {
			type: "string",
		},
		products: {
			type: "array",
			items: productForOrdersSchema,
		},
		total_price: {
			type: "number",
		},
		delivery: {
			oneOf: [deliverySchema, { type: "null" }],
		},
		changedOn: {
			type: "string",
		},
		action: {
			type: "string",
		},
		performer: assignedManagerSchema,
		assignedManager: {
			oneOf: [assignedManagerSchema, { type: "null" }],
		},
	},
	required: [
		"status",
		"customer",
		"products",
		"total_price",
		"delivery",
		"changedOn",
		"action",
		"performer",
		"assignedManager",
	],
};
