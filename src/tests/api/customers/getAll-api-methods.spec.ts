import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/api.fixture";
import _ from "lodash";

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

			expect(response.status).toBe(STATUS_CODES.OK);
			expect(Array.isArray(response.body.Customers)).toBe(true);

			const sample = response.body.Customers.find((c: any) => c._id === createdCustomer._id);
			expect(_.omit(sample, ["_id", "createdOn"])).toMatchObject(_.omit(createdCustomer, ["_id", "createdOn"]));

			const exists = response.body.Customers.some((c: any) => c._id === createdCustomer._id);
			expect(exists).toBe(true);
		});

		test("get sorted list", { tag: TAGS.CUSTOMERS }, async ({ customersApiService }) => {
			const response = await customersApiService.getAll(token, { sortField: "email", sortOrder: "asc" });

			expect(response.status).toBe(STATUS_CODES.OK);
			expect(Array.isArray(response.body.Customers)).toBe(true);

			const emails = response.body.Customers.map((c: any) => c.email);
			const sortedEmails = [...emails].sort((a, b) => a.localeCompare(b));

			expect(emails).toEqual(sortedEmails);
		});
	});

	test.describe("negative", () => {
		test("no token", { tag: TAGS.CUSTOMERS }, async ({ customersApi }) => {
			const response = await customersApi.getAll("");
			expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
		});
	});
});
