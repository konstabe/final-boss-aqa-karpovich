import { CustomersApiService } from "api/services/customers.service";
import { OrdersApiService } from "api/services/orders.service";
import { ProductsApiService } from "api/services/products.service";
import { IOrderFromResponse, IOrderWithCustomerAndProducts } from "data/types/order.types";
import { IProductFromResponse } from "data/types/product.types";
import { ORDER_STATUS } from "data/orders/orderStatus";
import { expect } from "fixtures/api.fixture";
import { createDeliveryDetails } from "utils/getRandom.utils";

export class Flow {
	constructor(
		private readonly customersApiService: CustomersApiService,
		private readonly productsApiService: ProductsApiService,
		private readonly ordersApiService: OrdersApiService,
	) {}

	async createOrder(token: string, productsCount: number = 1) {
		const customer = await this.customersApiService.create(token);

		const products = [];
		for (let i = 0; i < productsCount; i++) {
			products.push(await this.productsApiService.create(token));
		}

		const order = await this.ordersApiService.createDraftNew(token, {
			customer: customer._id,
			products: products.map((p) => p._id),
		});

		return {
			customer,
			products,
			order,
		};
	}

	private filterValidIds(ids: Array<string | undefined>): string[] {
		return ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
	}

	async cleanup(
		token: string,
		params: {
			orderIds?: Array<string | undefined>;
			productIds?: Array<string | undefined>;
			customerIds?: Array<string | undefined>;
		},
	) {
		const orderIds = this.filterValidIds(params.orderIds ?? []);
		const productIds = this.filterValidIds(params.productIds ?? []);
		const customerIds = this.filterValidIds(params.customerIds ?? []);

		await Promise.all([
			...orderIds.map((id) => this.ordersApiService.deleteOrder(token, id)),
			...productIds.map((id) => this.productsApiService.delete(token, id)),
			...customerIds.map((id) => this.customersApiService.delete(id, token)),
		]);

		if (params.orderIds) params.orderIds.length = 0;
		if (params.productIds) params.productIds.length = 0;
		if (params.customerIds) params.customerIds.length = 0;
	}

	async createOrderData(token: string, numberOfProducts: number): Promise<IOrderWithCustomerAndProducts> {
		const customer = await this.customersApiService.create(token);

		const productsIds: string[] = [];
		const productsData: IProductFromResponse[] = [];

		for (let i = 0; i < numberOfProducts; i++) {
			const product = await this.productsApiService.create(token);
			productsIds.push(product._id);
			productsData.push(product);
		}

		return {
			customer: customer._id,
			products: productsIds,
			customerData: customer,
			productsData,
		};
	}

	async createDraft(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const { customer, products } = await this.createOrderData(token, numberOfProducts);
		return await this.ordersApiService.createDraftNew(token, { customer, products });
	}

	async createDraftWithDelivery(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraft(token, numberOfProducts);
		const deliveryDetails = createDeliveryDetails(order);
		const orderWithDelivery = await this.ordersApiService.updateDeliveryDetails(order._id, deliveryDetails, token);

		if (!orderWithDelivery.delivery) {
			throw new Error(`createDraftWithDelivery failed: delivery was not set for order ${order._id}`);
		}

		return orderWithDelivery;
	}

	async processOrder(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.createDraftWithDelivery(token, numberOfProducts);
		const orderInProcess = await this.ordersApiService.updateOrderStatus(
			order._id,
			ORDER_STATUS.IN_PROGRESS,
			token,
		);
		expect(orderInProcess.status).toBe(ORDER_STATUS.IN_PROGRESS);

		return orderInProcess;
	}

	async allReceived(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.processOrder(token, numberOfProducts);
		const productsId = order.products.map((product) => product._id);
		const received = await this.ordersApiService.markOrdersAsReceived(order._id, productsId, token);
		expect(received.status).toBe(ORDER_STATUS.RECEIVED);
		const productsArray = received.products;
		const areAllReceived = productsArray.every((product) => product.received === true);
		if (!areAllReceived) {
			throw new Error("Not all products were marked as received");
		}

		return received;
	}

	async orderWithAssignedManager(
		token: string,
		numberOfProducts: number,
		managerId: string,
	): Promise<IOrderFromResponse> {
		const order = await this.createDraftWithDelivery(token, numberOfProducts);
		const assigned = await this.ordersApiService.assignManagerToOrder(order._id, managerId, token);
		return assigned;
	}

	async cancelOrderInProgress(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const order = await this.processOrder(token, numberOfProducts);
		const changedStatus = await this.ordersApiService.updateOrderStatus(order._id, ORDER_STATUS.CANCELED, token);
		expect(changedStatus.status).toBe(ORDER_STATUS.CANCELED);

		return changedStatus;
	}

	async reopenOrderInProgress(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
		const canceled = await this.cancelOrderInProgress(token, numberOfProducts);
		const changedStatus = await this.ordersApiService.updateOrderStatus(canceled._id, ORDER_STATUS.DRAFT, token);
		expect(changedStatus.status).toBe(ORDER_STATUS.DRAFT);

		return changedStatus;
	}

	async fullDelete(token: string, ordersId: string[], customersId: string[], productsId: string[]) {
		if (ordersId.length > 0) {
			await Promise.all(ordersId.map((id) => this.ordersApiService.deleteOrder(token, id)));
		}

		if (productsId.length > 0) {
			await Promise.all(productsId.map((id) => this.productsApiService.delete(token, id)));
		}

		if (customersId.length > 0) {
			await Promise.all(customersId.map((id) => this.customersApiService.delete(id, token)));
		}

		ordersId.length = 0;
		productsId.length = 0;
		customersId.length = 0;
	}
}
