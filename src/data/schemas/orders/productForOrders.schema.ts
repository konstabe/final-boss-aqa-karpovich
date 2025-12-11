import { MANUFACTURERS } from "data/products/manufacturers";

export const productForOrdersSchema = {
	type: "object",
	properties: {
		_id: { type: "string" },
		name: {
			type: "string",
		},
		amount: {
			type: "number",
		},
		price: {
			type: "number",
		},
		notes: {
			type: "string",
		},
		manufacturer: {
			type: "string",
			enum: Object.values(MANUFACTURERS),
		},
		received: {
			type: "boolean",
		},
	},
	required: ["_id", "name", "amount", "price", "manufacturer", "received"],
};
