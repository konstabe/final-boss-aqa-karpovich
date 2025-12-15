import { faker } from "@faker-js/faker";

export function randomString(length: number): string {
	return faker.string.alphanumeric({ length: length });
}
