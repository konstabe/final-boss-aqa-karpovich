import { faker } from "@faker-js/faker";
import { ObjectId } from "bson";
import { getRandomEnumValue } from "../../utils/enum.utils";
import { MANUFACTURERS } from "./manufacturers";
import { IProduct, IProductForOrder, IProductFromResponse, IProductsResponse } from "data/types/product.types";

export function generateProductData(params?: Partial<IProduct>): IProduct {
	return {
		amount: faker.number.int({ min: 0, max: 999 }),
		name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
		manufacturer: getRandomEnumValue(MANUFACTURERS),
		price: faker.number.int({ min: 1, max: 99999 }),
		notes: faker.string.alphanumeric({ length: 250 }),
		...params,
	};
}

export function generateProductResponseData(params?: Partial<IProduct>): IProductFromResponse {
	const initial = generateProductData(params);
	return {
		_id: new ObjectId().toHexString(),
		name: initial.name,
		amount: initial.amount,
		price: initial.price,
		manufacturer: initial.manufacturer,
		createdOn: new Date().toISOString(),
		notes: initial.notes!,
	};
}

export function generateProductDataForOrder(params?: Partial<IProduct>): IProductForOrder {
	return {
		_id: new ObjectId().toHexString(),
		name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
		amount: faker.number.int({ min: 0, max: 999 }),
		price: faker.number.int({ min: 1, max: 99999 }),
		manufacturer: getRandomEnumValue(MANUFACTURERS),
		notes: faker.string.alphanumeric({ length: 250 }),
		received: false,
		...params,
	};
}

export function generateAllProductsForOrderPage(numberOfProducts: number): IProductsResponse {
	const products: IProductFromResponse[] = [];

	for (let i = 0; i < numberOfProducts; i++) {
		products.push({
			_id: new ObjectId().toHexString(),
			name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
			amount: faker.number.int({ min: 0, max: 999 }),
			price: faker.number.int({ min: 1, max: 99999 }),
			manufacturer: getRandomEnumValue(MANUFACTURERS),
			notes: faker.string.alphanumeric({ length: 250 }),
			createdOn: new Date().toISOString(),
		});
	}

	return {
		Products: products,
		IsSuccess: true,
		ErrorMessage: null,
	};
}
