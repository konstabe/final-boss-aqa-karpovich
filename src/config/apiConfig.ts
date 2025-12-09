import { SALES_PORTAL_API_URL } from "./env";

export const apiConfig = {
	baseUrl: SALES_PORTAL_API_URL,
	endpoints: {
		login: "/api/login",
		productsAll: "/api/products/all",
		products: "/api/products",
		productById: (id: string) => `/api/products/${id}/`,
		metrics: "/api/metrics",
		customers: "/api/customers",
		customerById: (id: string) => `/api/customers/${id}`,
		customersAll: "/api/customers/all",
		orders: "/api/orders",
		orderById: (id: string) => `/api/orders/${id}`,
		assignManagerToOrder: (orderId: string, managerId: string) =>
			`/api/orders/${orderId}/assign-manager/${managerId}`,
		unAssignManagerToOrder: (orderId: string) => `/api/orders/${orderId}/unassign-manager`,
		addCommentToOrder: (orderId: string) => `/api/orders/${orderId}/comments`,
	},
};
