import { faker } from "@faker-js/faker";
import { ICustomer } from "data/types/customer.types";
import { COUNTRIES } from "./countries";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
	return {
		email: faker.internet.email(),
		name: faker.person.firstName() + " " + faker.person.lastName(),
		country: getRandomEnumValue(COUNTRIES),
		city: faker.location.city(),
		street: faker.location.street(),
		house: faker.number.int({ min: 1, max: 50 }),
		flat: faker.number.int({ min: 1, max: 1000 }),
		phone: faker.phone.number({ style: "international" }),
		notes: faker.string.alphanumeric({ length: 250 }),
		...params,
	};
}
