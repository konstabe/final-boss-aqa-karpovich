import { DELIVERY_CONDITION } from "data/orders/deliveryCondition";
import { addressSchema } from "./address.schema";

export const deliverySchema = {
	type: "object",
	properties: {
		finalDate: { type: "string" },
		condition: {
			type: "string",
			enum: Object.values(DELIVERY_CONDITION),
		},
		address: addressSchema,
	},
	required: ["finalDate", "condition", "address"],
};
