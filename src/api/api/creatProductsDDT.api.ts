import { faker } from "@faker-js/faker";
import { NOTIFICATIONS } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";
import { MANUFACTURERS } from "data/products/manufacturers";
import { STATUS_CODES } from "data/statusCodes";
import { IProduct } from "data/types/product.types";
import { getRandomEnumValue } from "utils/enum.utils";

interface ICreateProductData {
	title: string;
	productData: IProduct;
	successMessage: string | null;
	statusCode: STATUS_CODES;
}

const productData = generateProductData();

export const validTestDataForProduct: ICreateProductData[] = [
	{
		productData: {
			name: faker.string.alphanumeric({ length: 3 }),
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 1,
			amount: 0,
			notes: "",
		},
		title: "Create product with 3 characters value in product name",
		successMessage: null,
		statusCode: STATUS_CODES.CREATED,
	},
	{
		productData: {
			name: faker.string.alphanumeric({ length: 40 }),
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 99999,
			amount: 999,
			notes: faker.string.alphanumeric({ length: 250 }),
		},
		title: "Create product with 40 characters value in product name",
		successMessage: null,
		statusCode: STATUS_CODES.CREATED,
	},
	{
		productData: {
			name: productData.name,
			manufacturer: productData.manufacturer,
			price: productData.price,
			amount: productData.amount,
			notes: faker.string.alphanumeric({ length: 250 }),
		},
		title: "Creat product with valid productData",
		successMessage: null,
		statusCode: STATUS_CODES.CREATED,
	},
];

export const invalidTestDataForProduct: ICreateProductData[] = [
	{
		productData: {
			name: faker.string.alphanumeric({ length: 41 }),
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 1,
			amount: 0,
			notes: "",
		},
		title: "Create product with 41 characters value in product name",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
	{
		productData: {
			name: productData.name,
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 100000,
			amount: 0,
			notes: "",
		},
		title: "Creat product with invalid price = 100000",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
	{
		productData: {
			name: productData.name,
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 1,
			amount: -5,
			notes: "",
		},
		title: "Creat product with invalid amount = -5",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
	{
		productData: {
			name: productData.name,
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 1,
			amount: 88,
			notes: "erre>dfg",
		},
		title: "Creat product with invalid notes",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
	{
		productData: { name: "", manufacturer: getRandomEnumValue(MANUFACTURERS), price: 1, amount: 0, notes: "" },
		title: "Creat product without name",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
	{
		productData: {
			name: productData.name,
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			price: 0,
			amount: 0,
			notes: "",
		},
		title: "Creat product with invalid price = 0",
		successMessage: NOTIFICATIONS.CREATED_FAIL_INCORRET_REQUEST_BODY,
		statusCode: STATUS_CODES.BAD_REQUEST,
	},
];
