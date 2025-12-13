import { COUNTRIES } from "data/customers/countries";
import { ICreatedOn, ID, SortOrder } from "./core.types";
import { IResponseFields } from "./core.types";

export interface ICustomer {
	email: string;
	name: string;
	country: COUNTRIES;
	city: string;
	street: string;
	house: number;
	flat: number;
	phone: string;
	notes?: string;
}

export interface ICustomerFromResponse extends Required<ICustomer>, ICreatedOn, ID {}

export interface ICustomerResponse extends IResponseFields {
	Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
	Customers: ICustomerFromResponse[];
}

export interface ICustomerInTable extends Pick<ICustomer, "email" | "name" | "country">, ICreatedOn {}

export interface ICustomersSortedResponse extends ICustomerResponse {
	total: number;
	page: number;
	limit: number;
	search: string;
	country: string[];
	sorting: {
		sortField: CustomersSortField;
		sortOrder: SortOrder;
	};
}

export type CustomersSortField = "email" | "name" | "country" | "createdOn";

export interface IGetCustomersParams {
	search: string;
	country: COUNTRIES[];
	sortField: CustomersSortField;
	sortOrder: SortOrder;
	page: number;
	limit: number;
}
