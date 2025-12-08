import { COUNTRIES } from "data/customers/countries";
import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";

export const customerSchema = {
	$id: "customerSchema",
	type: "object",
	properties: {
		_id: { type: "string" },
		email: { type: "string" },
		name: { type: "string" },
		country: {
			type: "string",
			enum: Object.values(COUNTRIES),
		},
		city: { type: "string" },
		street: { type: "string" },
		house: { type: "number" },
		flat: { type: "number" },
		phone: { type: "string" },
		createdOn: { type: "string" },
		notes: { type: "string" },
	},
	required: ["_id", "email", "name", "country", "city", "street", "house", "flat", "phone", "createdOn"],
	additionalProperties: false,
}

export const customerAllSchema = {
	$id: "customerAllSchema",
	type: "object",
	properties: {
		status: { type: "number", const: 200 },

		body: {
			type: "object",
			properties: {
				Customers: {
					type: "array",
					items: { $ref: "customerSchema" }, // <- БЕЗ #
				},
				total: { type: "number" },
				page: { type: "number" },
				limit: { type: "number" },
				search: { type: "string" },
				country: {
					type: "array",
					items: { type: "string" },
				},
				sorting: {
					type: "object",
					properties: {
						sortField: { type: "string" },
						sortOrder: { type: "string", enum: ["asc", "desc"] },
					},
					required: ["sortField", "sortOrder"],
				},
				IsSuccess: { type: "boolean" },
				ErrorMessage: { type: ["string", "null"] },
			},
			required: [
				"Customers",
				"total",
				"page",
				"limit",
				"search",
				"country",
				"sorting",
				"IsSuccess",
				"ErrorMessage",
			],
		},
	},
	required: ["status", "body"],
};

export const customerSearchSchema = {
	type: "object",
	properties: {
		Customers: {
			type: "array",
			items: customerSchema,
		},

		total: { type: "number" },
		page: { type: "number" },
		limit: { type: "number" },
		search: { type: "string" },

		country: {
			type: "array",
			items: {
				type: "string",
				enum: Object.values(COUNTRIES),
			},
		},

		sorting: {
			type: "object",
			properties: {
				sortField: { type: "string" },
				sortOrder: { type: "string", enum: ["asc", "desc"] },
			},
			required: ["sortField", "sortOrder"],
			additionalProperties: false,
		},
		...obligatoryFieldsSchema,
	},

	required: ["Customers", "total", "page", "limit", "search", "country", "sorting", ...obligatoryRequiredFields],
	additionalProperties: false,
};
