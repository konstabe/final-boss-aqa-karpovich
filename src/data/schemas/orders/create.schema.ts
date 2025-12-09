import { MANUFACTURERS } from "data/products/manufacturers";
import { obligatoryFieldsSchema } from "../core.schema";
import { customerSchema } from "../customers/customer.schema";

export const orderResponseSchema = {
	type: "object",
	properties: {
		Order: {
			type: "object",
			properties: {
				_id: { type: "string" },
				status: { type: "string" },

				customer: customerSchema,

				products: {
					type: "array",
					items: {
						type: "object",
						properties: {
							_id: { type: "string" },
							name: { type: "string" },
							amount: { type: "number" },
							price: { type: "number" },
							manufacturer: {
								type: "string",
								enum: Object.values(MANUFACTURERS),
							},
							notes: { type: "string" },
							received: { type: "boolean" },
						},
						required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
						additionalProperties: false,
					},
				},

				delivery: { type: ["null", "object"] },

				total_price: { type: "number" },
				createdOn: { type: "string" },

				comments: {
					type: "array",
					items: {},
				},

				history: {
					type: "array",
					items: {
						type: "object",
						properties: {
							status: { type: "string" },
							customer: { type: "string" },
							products: {
								type: "array",
								items: {
									type: "object",
									properties: {
										_id: { type: "string" },
										name: { type: "string" },
										amount: { type: "number" },
										price: { type: "number" },
										manufacturer: { type: "string" },
										notes: { type: "string" },
										received: { type: "boolean" },
									},
									required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
									additionalProperties: false,
								},
							},
							total_price: { type: "number" },
							delivery: { type: ["null", "object"] },
							changedOn: { type: "string" },
							action: { type: "string" },

							performer: {
								type: "object",
								properties: {
									_id: { type: "string" },
									username: { type: "string" },
									firstName: { type: "string" },
									lastName: { type: "string" },
									roles: {
										type: "array",
										items: { type: "string" },
									},
									createdOn: { type: "string" },
								},
								required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
								additionalProperties: false,
							},

							assignedManager: { type: ["null", "string"] },
						},
						required: [
							"status",
							"customer",
							"products",
							"total_price",
							"delivery",
							"changedOn",
							"action",
							"performer",
							"assignedManager",
						],
						additionalProperties: false,
					},
				},

				assignedManager: { type: ["null", "string"] },
			},
			required: [
				"_id",
				"status",
				"customer",
				"products",
				"delivery",
				"total_price",
				"createdOn",
				"comments",
				"history",
				"assignedManager",
			],
			additionalProperties: false,
		},
		...obligatoryFieldsSchema,
	},

	required: ["Order", "IsSuccess", "ErrorMessage"],
	additionalProperties: false,
};
