import { STATUS_CODES } from "data/statusCodes";
import { SortOrder } from "data/types/core.types";
import { IProductFromResponse, ProductsSortField } from "data/types/product.types";

interface IProductsSearch {
	title: string;
	sortField: ProductsSortField;
	errorMessage: string | null;
	statusCode: STATUS_CODES;
}

interface IProductsSorted {
	title: string;
	sortField: ProductsSortField;
	sortOrder: SortOrder;
	errorMessage: string | null;
	statusCode: STATUS_CODES;
}

export const searchForProduct: IProductsSearch[] = [
	{
		sortField: "name",
		title: "Search by name",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "manufacturer",
		title: "Search by price",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "price",
		title: "Search by manufacturer",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
];

export const sortedForProductAsc: IProductsSorted[] = [
	{
		sortField: "createdOn",
		sortOrder: "asc",
		title: "SortField: createdOn, sortOrder: asc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "manufacturer",
		sortOrder: "asc",
		title: "SortField: manufacturer, sortOrder: asc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "price",
		sortOrder: "asc",
		title: "SortField: price, sortOrder: asc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "name",
		sortOrder: "asc",
		title: "SortField: name, sortOrder: asc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "createdOn",
		sortOrder: "desc",
		title: "SortField: createdOn, sortOrder: desc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "manufacturer",
		sortOrder: "desc",
		title: "SortField: manufacturer, sortOrder: desc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "price",
		sortOrder: "desc",
		title: "SortField: price, sortOrder: desc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
	{
		sortField: "name",
		sortOrder: "desc",
		title: "SortField: name, sortOrder: desc",
		errorMessage: null,
		statusCode: STATUS_CODES.OK,
	},
];
