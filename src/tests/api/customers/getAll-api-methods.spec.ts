import { customerAllSchema, customerSchema } from "data/schemas/customers/customer.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { SortOrder } from "data/types/core.types";
import { CustomersSortField, ICustomerFromResponse } from "data/types/customer.types";
import { expect, test } from "fixtures/api.fixture";
import { returnSortedArrayWithOrder } from "utils/comprare.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { validateJsonSchema, registerSchema } from "utils/validation/validateSchema.utils";

test.describe("Get customers all", () => {
	let token = "";

	test.beforeAll(async ({ loginApiService }) => {
		token = await loginApiService.loginAsAdmin();
	});

	test.describe("positive", () => {
		let createdCustomer: ICustomerFromResponse;

		test.beforeEach(async ({ customersApiService }) => {
			createdCustomer = await customersApiService.create(token);
		});

		test("get list with created customer", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.getAll(token);

			registerSchema(customerSchema);
			validateJsonSchema(response, customerAllSchema);

			const exists = response.body.Customers.some((c: ICustomerFromResponse) => c._id === createdCustomer._id);
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

						const sorted = returnSortedArrayWithOrder(response.body.Customers, field, order);
						expect(response.body.Customers).toEqual(sorted);
					});
				}
			});
		}
	});

	test.describe("negative", () => {
		test("get customers without token", { tag: TAGS.CUSTOMERS }, async ({ customersApi }) => {
			const response = await customersApi.getAll("");
			validateResponse(response, { status: STATUS_CODES.UNAUTHORIZED });
		});
	});
});
