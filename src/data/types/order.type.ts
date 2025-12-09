export interface IOrder {
	customer: string;
	products: string[];
	status: string;
	delivery: null;
	total_pric: number;
	createdOn: "2025-12-09T12:25:55.000Z";
	comments: [];
	histor: string[];
	assignedManager: null;
	_id: string;
}
// export interface IOrderFromResponse extends Required<IOrder>{}

// export interface IOrderResponse extends IResponseFields {
//     Order: IOrderFromResponse;
// }
