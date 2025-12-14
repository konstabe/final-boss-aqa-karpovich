import { ICreatedOn, ID, IResponseFields, SortOrder } from "./core.types";
import { ICustomer, ICustomerFromResponse } from "./customer.types";
import { IProductForOrder, IProductFromResponse } from "./product.types";
import { ORDER_HISTORY_ACTIONS } from "data/orderHistoryActions";
import { ROLE } from "data/roles";

export interface IOrder {
	customer: string;
	products: string[];
}

export type OrderStatus = "Draft" | "In Process" | "Received" | "Partially Received" | "Canceled";
export type ConditionDelivery = "Delivery" | "Pickup";

export type IAddress = Pick<ICustomer, "country" | "city" | "house" | "flat" | "street">;

export interface IOrderDelivery {
	address: IAddress;
	finalDate: string;
	condition: ConditionDelivery;
}

export interface IOrderBase {
	status: OrderStatus;
	customer: ICustomerFromResponse;
	products: IProductForOrder[];
	delivery: IOrderDelivery | null;
	total_price: number;
	assignedManager: null | IOrderPerformer;
}

export interface IOrderPerformer extends ID, ICreatedOn {
	username: string;
	firstName: string;
	lastName: string;
	roles: ROLE[];
}

export interface IOrderHistory extends Omit<IOrderBase, "customer"> {
	customer: string;
	changedOn: string;
	action: ORDER_HISTORY_ACTIONS;
	performer: IOrderPerformer | null;
	assignedManager: IOrderPerformer | null;
}

export interface IComments extends ID, ICreatedOn {
	text: string;
}

export interface IOrderFromResponse extends IOrderBase, ICreatedOn, ID {
	comments: IComments[];
	history: IOrderHistory[];
}

export interface IOrderResponse extends IResponseFields {
	Order: IOrderFromResponse;
}

export interface ICustomerOrdersResponse extends IResponseFields {
	Orders: IOrderFromResponse[];
}

export interface IOrderWithCustomerAndProducts extends IOrder {
	customerData: ICustomer;
	productsData: IProductFromResponse[];
}

export type OrderSortField = "createdOn" | "total_price" | "status";

export interface IGetOrdersQuery {
	search?: string;
	status?: OrderStatus[];
	sortField?: OrderSortField;
	sortOrder?: SortOrder;
}
