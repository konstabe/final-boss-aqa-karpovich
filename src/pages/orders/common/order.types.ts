export type OrderSummaryTitle = "Order Status" | "Total Price" | "Delivery" | "Created On";
export type OrderSummaryItem = {
	label: OrderSummaryTitle;
	value: string | null;
};

export type CustomerDetailsTitle =
	| "Email"
	| "Name"
	| "Country"
	| "City"
	| "Street"
	| "House"
	| "Flat"
	| "Phone"
	| "CreatedOn"
	| "Notes";

export type ProductDetailsTitle = "Name" | "Price" | "Manufacturer" | "Notes";

export type DeliveryDetailsTitle = "Delivery Type" | "Delivery Date" | "Country" | "City" | "Street" | "House" | "Flat";

export type HistoryChange = {
	previous: string;
	current: string;
};
