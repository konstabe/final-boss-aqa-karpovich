import { ORDER_STATUS } from "data/orders/orderStatus";
import { commentsSchema } from "./comments.schema";
import { historySchema } from "./history.schema";
import { productForOrdersSchema } from "./productForOrders.schema";
import { deliverySchema } from "./delivery.schema";
import { assignedManagerSchema } from "./assignedManager.schema";
import { customerSchema } from "../customers/customer.schema";

export const orderSchema = {
	type: "object",
	properties: {
		_id: { type: "string" },
		status: {
			type: "string",
			enum: Object.values(ORDER_STATUS),
		},
		customer: {
			oneOf: [
				{ type: "string" },
				{
					...customerSchema,
					additionalProperties: true,
				},
			],
		},
		products: {
			type: "array",
			items: productForOrdersSchema,
		},
		delivery: {
			oneOf: [
				deliverySchema,
				{
					type: "array",
					items: deliverySchema,
				},
				{ type: "null" },
			],
		},
		total_price: {
			type: "number",
		},
		createdOn: {
			type: "string",
		},
		comments: {
			oneOf: [
				{
					type: "array",
					items: commentsSchema,
				},
				{ type: "null" },
			],
		},
		history: {
			type: "array",
			items: historySchema,
		},
		assignedManager: {
			oneOf: [
				{
					type: "array",
					items: assignedManagerSchema,
				},
				{ type: "null" },
			],
		},
	},
	required: [
		"_id",
		"status",
		"customer",
		"products",
		"delivery",
		"total_price",
		"createdOn",
		"comments",
		"history",
		"assignedManager",
	],
};
