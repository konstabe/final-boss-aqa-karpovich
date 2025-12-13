import { customerAllSchema, customerSchema } from "data/schemas/customers/customer.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { SortOrder } from "data/types/core.types";
import { CustomersSortField } from "data/types/customer.types";
import { expect, test } from "fixtures/api.fixture";
import { compareValues } from "utils/comprare.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { validateJsonSchema, registerSchema } from "utils/validation/validateSchema.utils";

test.describe("Get customers all", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.describe("positive", () => {
		let createdCustomer: any;

		test.beforeEach(async ({ customersApiService }) => {
			createdCustomer = await customersApiService.create(token);
		});

		test("get list with created customer", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.getAll(token);

			registerSchema(customerSchema);
			validateJsonSchema(response, customerAllSchema);

			const exists = response.body.Customers.some((c: any) => c._id === createdCustomer._id);
			expect(exists).toBe(true);
		});

		const fields: CustomersSortField[] = ["email", "name", "country", "createdOn"];
		const orders: SortOrder[] = ["asc", "desc"];

		for (const field of fields) {
			test(`sort by ${field}`, async ({ customersApiService }) => {
				for (const order of orders) {
					await test.step(`sort order ${order}`, async () => {
						const response = await customersApiService.getAll(token, {
							sortField: field,
							sortOrder: order,
						});

						validateResponse(response, { status: STATUS_CODES.OK });

						const sorted = [...response.body.Customers].sort((a, b) => {
							const base = compareValues(a[field], b[field]);
							return order === "asc" ? base : -base;
						});
						console.log(response.body.Customers);
						expect(response.body.Customers).toEqual(sorted);
					});
				}
			});
		}
	});

	test.describe("negative", () => {
		test("no token", { tag: TAGS.CUSTOMERS }, async ({ customersApi }) => {
			const response = await customersApi.getAll("");
			expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
		});
	});
});
