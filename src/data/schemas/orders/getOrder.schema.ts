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
