import { productSchema } from "../product/product.schema";
import { assignedManagerSchema } from "./assignedManager.schema";

export const historySchema = {
	type: "object",
	properties: {
		status: { type: "string" },
		customer: {
			type: "string",
		},
		products: {
			type: "array",
			items: productSchema,
		},
		total_price: {
			type: "number",
		},
		delivery: {
			type: ["object", "null"],
		},
		createdOn: {
			type: "string",
		},
		action: {
			type: "number",
		},
		performer: {
			type: ["object", "null"],
		},
	},
	required: ["status", "customer", "products", "total_price", "delivery", "createdOn", "action", "performer"],
};
