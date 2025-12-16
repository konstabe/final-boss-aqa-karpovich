import { IOrderFromResponse, IOrderDelivery, IAddress } from "data/types/order.types.js";
import _ from "lodash";
import { getRandomFutureDate } from "./generateData.utils.js";

export function getRandomItemsFromArray<T>(array: T[], numberOfItems: number): T[] {
	const arr = [...array];
	const result: T[] = [];
	for (let i = 0; i < numberOfItems; i++) {
		const index = Math.floor(Math.random() * arr.length);
		result.push(arr[index]!);
		arr.splice(index, 1);
	}
	return result;
}

export function createDeliveryDetails(order: IOrderFromResponse): IOrderDelivery {
	const address: IAddress = _.pick(order.customer, ["country", "city", "house", "flat", "street"]);
	return {
		finalDate: getRandomFutureDate(),
		condition: "Pickup",
		address: address,
	};
}
