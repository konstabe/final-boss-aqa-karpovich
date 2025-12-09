import { IResponseFields } from "./core.types";

export interface IOrder {
	customer: string;
	products: string[];
}
export interface IOrderFromResponse extends Required<IOrder> {
	status: string;
	delivery: null;
	total_pric: number;
	createdOn: string;
	comments: [];
	histor: string[];
	assignedManager: null;
	_id: string;
}
export interface IOrderResponse extends IResponseFields {
	Order: IOrderFromResponse;
}
