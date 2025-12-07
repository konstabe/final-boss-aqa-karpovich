import { ProductsApi } from "api/api/product.api";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/product/create.schema";
import { getProductSchema } from "data/schemas/product/get.schema";
import { getAllProductSchema } from "data/schemas/product/getAll.shema";
import { STATUS_CODES } from "data/statusCodes";
import { IGetProductsParams, IProduct } from "data/types/product.types";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class ProductsApiService {
	constructor(private productsApi: ProductsApi) {}

	@logStep("Create product via API")
	async create(token: string, productData?: Partial<IProduct>) {
		const data = generateProductData(productData);
		const response = await this.productsApi.create(data, token);
		validateResponse(response, {
			status: STATUS_CODES.CREATED,
			IsSuccess: true,
			ErrorMessage: null,
			schema: createProductSchema,
		});
		return response.body.Product;
	}

	@logStep("Update product via API")
	async update(_id: string, token: string, productData?: Partial<IProduct>) {
		const data = generateProductData(productData);
		const response = await this.productsApi.update(_id, data, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			IsSuccess: true,
			ErrorMessage: null,
			schema: createProductSchema,
		});
		return response.body.Product;
	}

	@logStep("Get all products via API")
	async getAll(token: string) {
		const response = await this.productsApi.getAll(token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			IsSuccess: true,
			ErrorMessage: null,
			schema: getAllProductSchema,
		});
		return response.body.Products;
	}

	@logStep("Get product by ID via API")
	async getById(_id: string, token: string) {
		const response = await this.productsApi.getById(_id, token);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			IsSuccess: true,
			ErrorMessage: null,
			schema: getProductSchema,
		});
		return response.body.Product;
	}

	@logStep("Get product by sorting via API")
	async getSorted(token: string, params?: Partial<IGetProductsParams>) {
		const response = await this.productsApi.getSorted(token, params);
		validateResponse(response, {
			status: STATUS_CODES.OK,
			IsSuccess: true,
			ErrorMessage: null,
			schema: getAllProductSchema,
		});
		return response.body.Products;
	}

	@logStep("Delete product via API")
	async delete(token: string, id: string) {
		const response = await this.productsApi.delete(id, token);
		validateResponse(response, {
			status: STATUS_CODES.DELETED,
		});
	}
}
