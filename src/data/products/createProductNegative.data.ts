import { faker } from "@faker-js/faker";

export const negativeCasesProductCreate: {
	description: string;
	testData: {
		name?: string | number;
		price?: number | string;
		amount?: number | string;
		notes?: string;
	};
}[] = [
	{
		description: "name less than min valid length",
		testData: { name: faker.string.alphanumeric({ length: 2 }) },
	},
	{
		description: "name more than max valid length",
		testData: { name: faker.string.alphanumeric({ length: 41 }) },
	},
	{
		description: "name has invalid format",
		testData: { name: faker.number.int({ min: 1, max: 99999 }) },
	},
	{
		description: "name with more than one space",
		testData: {
			name: `${faker.string.alphanumeric({ length: 8 })}  ${faker.string.alphanumeric({ length: 6 })}`,
		},
	},
	{
		description: "price less than min valid",
		testData: { price: 0 },
	},
	{
		description: "price more than max valid",
		testData: { price: 100000 },
	},
	{
		description: "price is not a number",
		testData: { price: faker.string.alphanumeric({ length: 41 }) },
	},
	{
		description: "amount less than min valid",
		testData: { amount: -1 },
	},
	{
		description: "amount more than max valid",
		testData: { amount: 1000 },
	},
	{
		description: "amount is not a number",
		testData: { amount: faker.string.alphanumeric({ length: 41 }) },
	},
	{
		description: "notes length more than max valid",
		testData: { notes: faker.string.alphanumeric({ length: 251 }) },
	},
	{
		description: "notes with < symbol",
		testData: {
			notes: `${faker.string.alphanumeric({ length: 8 })} < ${faker.string.alphanumeric({ length: 6 })}`,
		},
	},
	{
		description: "notes with > symbol",
		testData: {
			notes: `${faker.string.alphanumeric({ length: 8 })} > ${faker.string.alphanumeric({ length: 6 })}`,
		},
	},
];
