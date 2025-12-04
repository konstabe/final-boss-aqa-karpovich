import { productSchema } from "./product.schema";
import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";

export const getAllProductSchema = {
  type: "object",
  properties: {
    Products: { 
        type: "array", 
        items: productSchema,
        },     
    ...obligatoryFieldsSchema,
  },
  required: ["Products", ...obligatoryRequredFields],
};

