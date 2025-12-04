
import { COUNTRY } from "../salesPortal/customers/country";
import { ID, IResponseFields } from "./core.types";

export interface ICustomer {
    email: string;
    name: string;
    country: COUNTRY;
    city: string;
    street: string;
    house: number;
    flat: number;
    phone: string;
    notes?: string;
}

export interface ICreatedOn {
  createdOn: string;
}


export interface ICustomerFromResponse extends Required<ICustomer>, ICreatedOn, ID {}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}