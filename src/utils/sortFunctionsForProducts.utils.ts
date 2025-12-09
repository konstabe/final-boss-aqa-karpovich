import { SortOrder } from "data/types/core.types";
import { IProductFromResponse, ProductsSortField } from "data/types/product.types";

export const sortFunctionsForProducts: Record<
	ProductsSortField,
	(a: IProductFromResponse, b: IProductFromResponse, sortOrder: SortOrder) => number
> = {
	createdOn: (a, b, sortOrder) => {
		const dateA = new Date(a.createdOn).getTime();
		const dateB = new Date(b.createdOn).getTime();
		return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
	},
	manufacturer: (a, b, sortOrder) => {
		const compare = a.manufacturer.localeCompare(b.manufacturer);
		const dateA = new Date(a.createdOn).getTime();
		const dateB = new Date(b.createdOn).getTime();
		return sortOrder === "asc" ? compare || dateA - dateB : -compare || dateB - dateA;
	},
	price: (a, b, sortOrder) => {
		const dateA = new Date(a.createdOn).getTime();
		const dateB = new Date(b.createdOn).getTime();
		return sortOrder === "asc" ? a.price - b.price || dateA - dateB : b.price - a.price || dateB - dateA;
	},
	name: (a, b, sortOrder) => {
		const compare = a.name.localeCompare(b.name);
		const dateA = new Date(a.createdOn).getTime();
		const dateB = new Date(b.createdOn).getTime();
		return sortOrder === "asc" ? compare || dateA - dateB : -compare || dateB - dateA;
	},
};
