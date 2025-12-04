import { faker } from "@faker-js/faker";
import { MANUFACTURERS } from "./manufacturers";
import { ObjectId } from "bson";
import { IProduct, IProductFromResponse } from "../../types/product.types";
import { getRandomEnumValue } from "../../../utils/enum.utils";

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