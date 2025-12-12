export enum NOTIFICATIONS {
	PRODUCT_CREATED = "Product was successfully created",
	PRODUCT_DELETED = "Product was successfully deleted",
	PRODUCT_EDITED = "Product was successfully updated",
	CREATED_FAIL_BAD_REQUEST = "CREATED_FAIL_BAD_REQUEST",
	CREATED_FAIL_INCORRET_REQUEST_BODY = "Incorrect request body",
	CUSTOMER_CREATED = "Customer was successfully created",
}

export const ERROR_MESSAGES = {
	UNAUTHORIZED: "Not authorized",
	PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
	PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
	INVALID_TOKEN: "Invalid access token",
	CONFLICT: (email: string) => `Customer with email '${email}' already exists`,
	CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
	ORDER_NOT_FOUND: (id: string) => `Not found customer with ID: ${id}`,
	INVALID_ORDER_STATUS: "Invalid order status",
};
