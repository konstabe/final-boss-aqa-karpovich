export const sortingSchema = {
  type: "object",
  properties: {
    sortField: {
      type: "string",
    },
    sortOrder: {
      type: "string",
    },
  },
  required: ["sortField", "sortOrder"],
};