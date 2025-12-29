import { IOrderHistory } from "data/types/order.types";
import { ORDER_STATUS } from "./orderStatus";
import { ObjectId } from "bson";
import { faker } from "@faker-js/faker";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUS_TO_HISTORY_ACTION } from "data/orderHistoryActions";
import { generateProductResponseData } from "data/products/generateProductData";
import { IOrderPerformer } from "data/types/order.types";
import { ROLE } from "data/roles";

export function generateOrderPerformer(overrides: Partial<IOrderPerformer> = {}): IOrderPerformer {
	return {
		_id: overrides._id ?? new ObjectId().toHexString(),
		createdOn: overrides.createdOn ?? new Date().toISOString(),
		username: overrides.username ?? faker.internet.email(),
		firstName: overrides.firstName ?? faker.person.firstName(),
		lastName: overrides.lastName ?? faker.person.lastName(),
		roles: [ROLE.USER],
	};
}

export type OrderHistoryOverrides = Partial<IOrderHistory>;

export function generateOrderHistoryItem(overrides: OrderHistoryOverrides = {}): IOrderHistory {
	return {
		status: overrides.status ?? ORDER_STATUS.DRAFT,
		customer: overrides.customer ?? new ObjectId().toHexString(),

		products: overrides.products ?? [{ ...generateProductResponseData(), received: false }],

		total_price: overrides.total_price ?? faker.number.int({ min: 1, max: 100000 }),

		delivery: overrides.delivery ?? null,

		changedOn: overrides.changedOn ?? new Date().toISOString(),

		action: overrides.action ?? ORDER_HISTORY_ACTIONS.CREATED,

		performer: overrides.performer ?? generateOrderPerformer(),

		assignedManager: overrides.assignedManager ?? null,
	};
}

export function generateOrderHistoryByStatuses(
	statuses: ORDER_STATUS[],
	baseOverrides: Omit<OrderHistoryOverrides, "status" | "action"> = {},
): IOrderHistory[] {
	return statuses.map((status, index) =>
		generateOrderHistoryItem({
			...baseOverrides,
			status,
			action: ORDER_STATUS_TO_HISTORY_ACTION[status],
			changedOn: new Date(Date.now() + index * 1000).toISOString(),
		}),
	);
}

// export function generateOrderHistoryByActions(
//   actions: ORDER_HISTORY_ACTIONS[],
//   baseOverrides: Omit<OrderHistoryOverrides, 'status' | 'action'> = {},
// ): IOrderHistory[] {
//   return actions.map((action, index) => {
//     const status = Object.entries(ORDER_STATUS_TO_HISTORY_ACTION).find(([_, actionsArray]) =>
//       Array.isArray(actionsArray) ? actionsArray.includes(action) : actionsArray === action
//     )?.[0] as ORDER_STATUS;

//     return generateOrderHistoryItem({
//       ...baseOverrides,
//       status,
//       action,
//       changedOn: new Date(Date.now() + index * 1000).toISOString(),
//     });
//   });
// }
