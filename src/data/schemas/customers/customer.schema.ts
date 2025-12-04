import { COUNTRY } from "../../salesPortal/customers/country";

export const customerSchema = {
  type: "object",
  properties: {
    _id: { 
        type: "string" 
    },
    email: {
        type: "string"
    },
    name: { 
        type: "string" 
    },
    country: {
      type: "string",
      enum: Object.values(COUNTRY),
    },
    city: {
      type: "string",
    },
    street: {
      type: "string",
    },
    house: {
      type: "number",
    },
    flat: {
      type: "number",
    },
    phone: {
      type: "string",
    },
    createdOn: {
      type: "string",
    },
    notes: {
      type: "string",
    },
  },
  required: ["email", "name", "country", "city", "street", "house", "flat", "phone", "createdOn", "notes", "_id"],
  additionalProperties: false,
};
