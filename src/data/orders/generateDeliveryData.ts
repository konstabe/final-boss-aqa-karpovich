import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/customers/countries";
import { IDelivery } from "data/types/order.types";
import { getRandomEnumValue } from "utils/enum.utils";
import { DELIVERY_CONDITION } from "./deliveryCondition";

export function generateDeliveryData(params?: Partial<IDelivery>): IDelivery {
	return {
		finalDate: new Date().toISOString(),
		address: {
			country: getRandomEnumValue(COUNTRIES),
			city: faker.location.city(),
			street: faker.location.street(),
			house: faker.number.int({ min: 1, max: 50 }),
			flat: faker.number.int({ min: 1, max: 1000 }),
		},
		condition: getRandomEnumValue(DELIVERY_CONDITION),
		...params,
	};
}
