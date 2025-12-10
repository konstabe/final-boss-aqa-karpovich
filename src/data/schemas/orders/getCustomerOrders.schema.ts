import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";
import { orderSchema } from "./order.schema";

export const customerOrdersSchema = {
	type: "object",
	properties: {
		Orders: {
			type: "array",
			items: orderSchema,
		},
		...obligatoryFieldsSchema,
	},
	required: ["Orders", ...obligatoryRequiredFields],
};
