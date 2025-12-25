import { ICreatedOn, ID, IResponseFields, SortOrder } from "./core.types";
import { ICustomer, ICustomerFromResponse } from "./customer.types";
import { IProductForOrder, IProductFromResponse } from "./product.types";
import { ORDER_HISTORY_ACTIONS } from "data/orderHistoryActions";
import { ROLE } from "data/roles";
import { ORDER_STATUS } from "data/orders/orderStatus";

export interface IOrder {
	customer: string;
	products: string[];
}

export type OrderStatus = "Draft" | "In Process" | "Received" | "Partially Received" | "Canceled";
export type ConditionDelivery = "Delivery" | "Pickup";

export type IAddress = Pick<ICustomer, "country" | "city" | "house" | "flat" | "street">;

export type LocationDelivery = "Home" | "Other";

export interface IAddressDelivery {
	country: string;
	city: string;
	street: string;
	house: number;
	flat: number;
}

export interface IDelivery {
	address: IAddressDelivery;
	finalDate: string;
	condition: string;
}

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

export type OrdersTableHeader =
	| "Order Number"
	| "Email"
	| "Price"
	| "Delivery"
	| "Status"
	| "Assigned Manager"
	| "Created On";

export interface IOrderInTable extends ICreatedOn, ID {
	email: string;
	price: number;
	delivery: string;
	status: OrderStatus;
	assignedManager: string;
}

export interface ICreatedProductsForOrder {
	productsIds: string[];
	productNames: string[];
}

export interface ICreatedCustomerForOrder {
	customerId: string;
	customerName: string;
	customerEmail: string;
}

export interface IOrderMock {
	_id: string;
	status: ORDER_STATUS;
	customer: {
		email: string;
	};
	delivery: {
		finalDate: string;
	} | null;
	total_price: number;
	createdOn: string;
	assignedManager: {
		firstName: string;
		lastName: string;
	} | null;
}
export interface IOrdersMock extends IResponseFields {
	Orders: IOrderMock[];
	total: number;
	page: number;
	limit: number;
	search: string;
	status: [];
	sorting: {
		sortField: OrderSortField;
		sortOrder: SortOrder;
	};
}

export type OrdersModalName = "reopenModal" | "filterModal" | "exportDataModal"; //добавить createOrderModal
