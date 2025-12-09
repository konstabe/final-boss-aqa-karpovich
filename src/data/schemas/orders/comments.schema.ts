export const commentsSchema = {
	type: "object",
	properties: {
		text: { type: "string" },
		createdOn: {
			type: "string",
		},
		_id: {
			type: "string",
		},
	},
	required: ["text", "createdOn", "_id"],
};
