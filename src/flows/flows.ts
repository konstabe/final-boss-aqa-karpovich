import { CustomersApiService } from "api/services/customers.service";
import { OrdersApiService } from "api/services/orders.service";
import { ProductsApiService } from "api/services/products.service";

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
}
