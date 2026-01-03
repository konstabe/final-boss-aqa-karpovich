import { IOrderDelivery } from "data/types/order.types";
import { convertToDate } from "./date.utils";

export function mapDeliveryInfo(deliveryResp: IOrderDelivery) {
	return {
		"Delivery Type": deliveryResp.condition,
		"Delivery Date": convertToDate(deliveryResp.finalDate),
		Country: deliveryResp.address.country,
		City: deliveryResp.address.city,
		Street: deliveryResp.address.street,
		House: deliveryResp.address.house.toString(),
		Flat: deliveryResp.address.flat.toString(),
	};
}
