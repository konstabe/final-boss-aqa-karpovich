import { faker } from "@faker-js/faker";
import { STATUS_CODES } from "data/statusCodes";

export const negativeCasesAddComment = [
	{
		description: "empty comment",
		testData: { comment: "", responseCode: STATUS_CODES.BAD_REQUEST },
	},
	{
		description: "comment longer than 250 symbols",
		testData: { comment: faker.string.alphanumeric({ length: 251 }), responseCode: STATUS_CODES.BAD_REQUEST },
	},
	{
		description: "comment with > symbol",
		testData: {
			comment: `<script>${faker.string.alphanumeric({ length: 200 })} >`,
			responseCode: STATUS_CODES.BAD_REQUEST,
		},
	},
	{
		description: "comment with < symbol",
		testData: {
			comment: `${faker.string.alphanumeric({ length: 200 })} <`,
			responseCode: STATUS_CODES.BAD_REQUEST,
		},
	},
];
