import { obligatoryFieldsSchema, obligatoryRequredFields } from "./core.schema";
import { userSchema } from "./users.schema";

export const loginSchema = {
  type: "object",
  properties: {
    User: userSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["User", ...obligatoryRequredFields],
};