import { obligatoryFieldsSchema, obligatoryRequiredFields } from "../core.schema";
import { productSchema } from "./product.schema";

export const getAllProductSchema = {
  type: "object",
  properties: {
    Products: { 
        type: "array", 
        items: productSchema,
        },     
    ...obligatoryFieldsSchema,
  },
  required: ["Products", ...obligatoryRequiredFields],
};

