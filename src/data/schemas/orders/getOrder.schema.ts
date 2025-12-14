import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";
import { orderSchemaWithCustomerData } from "./order.schema";

export const getOrdersSchema = {
	type: "object",
	properties: {
		Order: orderSchemaWithCustomerData,
		...obligatoryFieldsSchema,
	},
	required: ["Order", ...obligatoryRequiredFields],
};

export const getAllOrdersSchema = {
	type: "object",
	properties: {
		Orders: {
			type: "array",
			items: getOrdersSchema,
		},
		...obligatoryFieldsSchema,
	},
};
