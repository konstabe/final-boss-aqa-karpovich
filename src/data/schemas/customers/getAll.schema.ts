import { COUNTRY } from "../../salesPortal/customers/country";
import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { sortingSchema } from "../product/sorting.shema";
import { customerSchema } from "./customer.schema";

export const getAllCustomerSchema = {
  type: "object",
  properties: {
    Customers: { 
        type: "array", 
        items: customerSchema,
        },
        total: {
            type: "number",
        },
        page: {
            type: "number",
        },
        limit: {
            type: "number",
        },
        search: {
            type: "string",
        },
        country: {
            type: "array",
            items: Object.values(COUNTRY),
        },
        sorting: sortingSchema,     
    ...obligatoryFieldsSchema,
  },
  required: ["Customer", "total", "page", "limit", "search", "country", "sorting", ...obligatoryRequredFields],
};