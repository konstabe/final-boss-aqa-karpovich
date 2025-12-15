import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";

export const getNotificationSchema = {
	type: "object",
	properties: {
		_id: { type: "string" },
		userId: { type: "string" },
		type: { type: "string" },
		orderId: { type: "string" },
		message: { type: "string" },
		read: { type: "boolean" },
		createdAt: { type: "string" },
		expiresAt: { type: "string" },
	},
	required: ["_id", "userId", "type", "orderId", "message", "read", "createdAt", "expiresAt"],
};

export const getnotificationsSchema = {
	type: "object",
	properties: {
		Notifications: { type: "array", items: getNotificationSchema },
		...obligatoryFieldsSchema,
	},
	required: ["Notifications", ...obligatoryRequiredFields],
	additionalProperties: false,
};
