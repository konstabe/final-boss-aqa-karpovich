import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";
import { orderSchema } from "./order.schema";

export const orderResponseSchema = {
	type: "object",
	properties: {
		Order: orderSchema,
		...obligatoryFieldsSchema,
	},
	required: ["Order", ...obligatoryRequiredFields],
	additionalProperties: false,
};
