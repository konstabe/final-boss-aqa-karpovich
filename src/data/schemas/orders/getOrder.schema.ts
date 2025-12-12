import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";
import { orderSchema } from "./order.schema";

export const getOrderByOdSchema = {
	type: "object",
	properties: {
		Order: {
			type: "object",
			items: orderSchema,
		},
		...obligatoryFieldsSchema,
	},
	required: ["Order", ...obligatoryRequiredFields],
};
