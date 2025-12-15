export enum NOTIFICATIONS {
	PRODUCT_CREATED = "Product was successfully created",
	PRODUCT_DELETED = "Product was successfully deleted",
	PRODUCT_EDITED = "Product was successfully updated",
	CREATED_FAIL_BAD_REQUEST = "CREATED_FAIL_BAD_REQUEST",
	CREATED_FAIL_INCORRET_REQUEST_BODY = "Incorrect request body",
	CUSTOMER_CREATED = "Customer was successfully created",
	COMMENT_WAS_NOT_FOUND = "Comment was not found",
}

export const ERROR_MESSAGES = {
	UNAUTHORIZED: "Not authorized",
	PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
	PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
	INVALID_TOKEN: "Invalid access token",
	CONFLICT: (email: string) => `Customer with email '${email}' already exists`,
	CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
	CUSTOMER_NOT_FOUND_WITH_ID: (id: string) => `Not found customer with ID: ${id}`,
	ORDER_NOT_FOUND: (id: string) => `Order with id '${id}' wasn't found`,
	MANAGER_NOT_FOUND: (id: string) => `Manager with id '${id}' wasn't found`,
	INVALID_ORDER_STATUS: "Invalid order status",
	CANT_PROCESS_ORDER_WITHOUT_DELIVERY: "Can't process order. Please, schedule delivery",
	CANT_REOPEN_NOT_CANCELLED: "Can't reopen not canceled order",
};
