import { productSchema } from "../product/product.schema";
import { assignedManagerSchema } from "./assignedManager.schema";
import { commentsSchema } from "./comments.schema";
import { historySchema } from "./history.schema";

export const orderSchema = {
	type: "object",
	properties: {
		_id: { type: "string" },
		status: {
			type: "string",
		},
		customer: {
			type: "string",
		},
		products: {
			type: "array",
			items: productSchema,
		},
		delivery: {
			type: ["object", "null"],
		},
		total_price: {
			type: "number",
		},
		createdOn: {
			type: "string",
		},
		comments: {
			type: "array",
			items: commentsSchema,
		},
		history: {
			type: "array",
			items: historySchema,
		},
		assignedManager: {
			type: ["object", "null"],
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
