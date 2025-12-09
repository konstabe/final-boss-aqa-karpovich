import { OrdersApi } from "api/api/orders.api";
import { orderResponseSchema } from "data/schemas/orders/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class OrdersApiService {
	constructor(private ordersApi: OrdersApi) {}

	@logStep("Create product via API")
	//async create(token: string, orderData: IOrder) # add generated orderDAta
	async create(token: string) {
		const response = await this.ordersApi.create("4324f24324", ["69382c061c508c5d5e9cb9f7"], token);
		validateResponse(response, {
			status: STATUS_CODES.CREATED,
			IsSuccess: true,
			ErrorMessage: null,
			schema: orderResponseSchema,
		});
		return response.body.Order;
	}
}
