import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";

export const errorOrderSchema = {
	type: "object",
	properties: {
		...obligatoryFieldsSchema,

		SchemaErrors: {
			type: "array",
			items: {
				type: "object",
				properties: {
					instancePath: { type: "string" },
					schemaPath: { type: "string" },
					keyword: { type: "string" },
					params: {
						type: "object",
						additionalProperties: true,
					},
					message: { type: "string" },
				},
				required: ["instancePath", "schemaPath", "keyword", "params", "message"],
				additionalProperties: false,
			},
		},
	},
	required: [...obligatoryRequiredFields, "SchemaErrors"],

	additionalProperties: false,
};
