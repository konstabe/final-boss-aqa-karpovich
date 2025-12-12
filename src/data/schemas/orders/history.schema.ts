import { ORDER_STATUS } from "data/orders/orderStatus";
import { productForOrdersSchema } from "./productForOrders.schema";
import { DELIVERY_CONDITION } from "data/orders/deliveryCondition";
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
			oneOf: [
				deliverySchema,
				{
					type: "string",
					enum: Object.values(DELIVERY_CONDITION),
				},
				{ type: "null" },
			],
		},
		changedOn: {
			type: "string",
		},
		action: {
			type: "string",
		},
		performer: {
			type: "object",
			items: assignedManagerSchema,
		},
		assignedManager: {
			oneOf: [
				{
					type: "object",
					items: assignedManagerSchema,
				},
				{ type: "null" },
			],
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
