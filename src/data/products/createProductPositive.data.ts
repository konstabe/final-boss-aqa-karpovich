import { faker } from "@faker-js/faker";

export const positiveCasesProductCreate: {
	description: string;
	testData: {
		name?: string;
		price?: number;
		amount?: number;
		notes?: string;
	};
}[] = [
	{
		description: "name with min valid length",
		testData: { name: faker.string.alphanumeric({ length: 3 }) },
	},
	{
		description: "name with max valid length",
		testData: { name: faker.string.alphanumeric({ length: 40 }) },
	},
	{
		description: "name with only one space",
		testData: {
			name: `${faker.string.alphanumeric({ length: 8 })} ${faker.string.alphanumeric({ length: 6 })}`,
		},
	},
	{
		description: "min valid price",
		testData: { price: 1 },
	},
	{
		description: "max valid price",
		testData: { price: 99999 },
	},
	{
		description: "min valid amount",
		testData: { amount: 0 },
	},
	{
		description: "max valid amount",
		testData: { amount: 999 },
	},
	{
		description: "empty notes",
		testData: { notes: "" },
	},
	{
		description: "max valid notes length",
		testData: { notes: faker.string.alphanumeric({ length: 250 }) },
	},
];
