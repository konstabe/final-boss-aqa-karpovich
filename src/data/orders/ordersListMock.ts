import { ORDER_STATUS } from "./orderStatus";

export const ordersListDataForMock = [
	{
		title: "Draft order without delivery and manager",
		order: {
			status: ORDER_STATUS.DRAFT,
			delivery: null,
			assignedManager: null,
		},
	},
	{
		title: "Draft order with delivery and without manager",
		order: {
			status: ORDER_STATUS.DRAFT,
			assignedManager: null,
		},
	},
	{
		title: "Draft order with delivery and with manager",
		order: {
			status: ORDER_STATUS.DRAFT,
		},
	},
	{
		title: "Order in progress without manager",
		order: {
			status: ORDER_STATUS.IN_PROGRESS,
			assignedManager: null,
		},
	},
	{
		title: "Order in progress with manager",
		order: {
			status: ORDER_STATUS.IN_PROGRESS,
		},
	},
	{
		title: "Canceled order",
		order: {
			status: ORDER_STATUS.CANCELED,
			delivery: null,
		},
	},
	{
		title: "Partially received order",
		order: {
			status: ORDER_STATUS.PARTIALLY_RECEIVED,
		},
	},
	{
		title: "Received order",
		order: {
			status: ORDER_STATUS.RECEIVED,
		},
	},
];
