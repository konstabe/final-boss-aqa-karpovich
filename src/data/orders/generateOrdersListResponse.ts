import { faker } from "@faker-js/faker";
import { ObjectId } from "bson";
import { generateCustomerResponseData } from "data/customers/generateCustomerData";
import { generateProductDataForOrder } from "data/products/generateProductData";
import {
	IOrderDitailsMock,
	IOrderInTable,
	IOrderMock,
	IOrderMockForDitails,
	IOrdersMock,
} from "data/types/order.types";
import { IProductForOrder } from "data/types/product.types";
import { convertToDateAndTime } from "utils/date.utils";
import { convertToDate } from "utils/date.utils";
import { ORDER_STATUS } from "./orderStatus";

export function generateOrderMock({
	status,
	delivery,
	assignedManager,
}: Pick<IOrderMock, "status"> & Partial<Pick<IOrderMock, "delivery" | "assignedManager">>): IOrderMock {
	return {
		_id: new ObjectId().toHexString(),
		status,
		customer: {
			email: faker.internet.email(),
		},
		delivery: delivery === undefined ? { finalDate: new Date().toISOString() } : delivery,
		total_price: faker.number.int({ min: 1, max: 100000 }),
		createdOn: new Date().toISOString(),
		assignedManager:
			assignedManager === undefined
				? {
						firstName: faker.person.firstName(),
						lastName: faker.person.lastName(),
					}
				: assignedManager,
	};
}
export function generateOrdersListUIMock(orders: IOrderMock[]): IOrdersMock {
	return {
		Orders: orders,
		total: orders.length,
		page: 1,
		limit: 10,
		search: "",
		status: [],
		sorting: {
			sortField: "createdOn",
			sortOrder: "desc",
		},
		IsSuccess: true,
		ErrorMessage: null,
	};
}

export function mapRespToTable(orderMock: IOrderMock): IOrderInTable {
	return {
		_id: orderMock._id,
		email: orderMock.customer.email,
		price: orderMock.total_price,
		delivery: orderMock.delivery ? convertToDate(orderMock.delivery.finalDate) : "-",
		status: orderMock.status,
		assignedManager: orderMock.assignedManager
			? `${orderMock.assignedManager!.firstName} ${orderMock.assignedManager!.lastName}`
			: "-",
		createdOn: convertToDateAndTime(orderMock.createdOn),
	};
}

export function generateOrderDetailsMock({
	status,
}: Pick<IOrderMockForDitails, "status"> & Partial<Pick<IProductForOrder, "received">>): IOrderMockForDitails {
	const product = generateProductDataForOrder();
	return {
		_id: new ObjectId().toHexString(),
		status,
		customer: generateCustomerResponseData(),
		products: [product],
		total_price: faker.number.int({ min: 1, max: 100000 }),
		delivery: null,
		createdOn: new Date().toISOString(),
		comments: [],
		history: [],
		assignedManager: null,
	};
}

export function generateOrderDetailsMockResponse(
	params?: Partial<IOrderMockForDitails> & Pick<IOrderMockForDitails, "status">,
): IOrderDitailsMock {
	const { status, ...otherParams } = params || {};

	const order = generateOrderDetailsMock({
		status: status || ORDER_STATUS.DRAFT,
	});

	const finalOrder = { ...order, ...otherParams };

	return {
		IsSuccess: true,
		ErrorMessage: null,
		Order: finalOrder,
	};
}
