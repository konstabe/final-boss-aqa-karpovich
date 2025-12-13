import { expect } from "@playwright/test";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

//регистрация схем для вложенности
export function registerSchema(schema: { $id: string } & object): void {
	if (!ajv.getSchema(schema.$id)) {
		ajv.addSchema(schema);
	}
}

//основной валидатор
export function validateJsonSchema(body: object, schema: object): void {
	const validate = ajv.compile(schema);
	const isValid = validate(body);

	expect.soft(isValid, `Response body should match JSON schema`).toBe(true);

	if (isValid) {
		console.log("Data is valid according to the schema.");
	} else {
		console.log("Data is not valid according to the schema.");
		console.log(validate.errors);
	}
}
