import { faker } from "@faker-js/faker";
import { COUNTRY } from "./country";
import { ObjectId } from "bson";
import { ICustomer, ICustomerFromResponse } from "../../types/customer.types";
import { getRandomEnumValue } from "../../../utils/enum.utils";

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.string.alphanumeric({ length: 25 }) + `@test.com`,
    name: faker.commerce.product(),
    country: getRandomEnumValue(COUNTRY),
    city: faker.string.alpha({ length: 20 }),
    street: faker.string.alphanumeric({ length: 25 }) + faker.number.int({ min: 1, max: 100000 }),
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 35 }),
    phone: `+` + faker.number.int({ min: 1000000000, max: 99999999999999999999 }).toString(),
    notes: faker.string.alphanumeric({ length: 250 }),
    ...params,
  };
}

export function generateCustomerResponseData(params?: Partial<ICustomer>): ICustomerFromResponse {
  const initial = generateCustomerData(params);
  return {
    _id: new ObjectId().toHexString(),
    email: initial.email,
    name: initial.name,
    country: initial.country,
    city: initial.city,
    street: initial.street,
    house: initial.house,
    flat: initial.flat,
    phone: initial.phone,
    createdOn: new Date().toISOString(),
    notes: initial.notes!,
  };
}