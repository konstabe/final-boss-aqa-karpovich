/**
 * Converts an object of request parameters into a URL query string.
 *
 * @param params - An object where keys are parameter names and values are parameter values.
 *                 Values can be either strings or arrays of strings.
 * @returns A string representing the URL query parameters, with parameters
 *          properly encoded and concatenated by '&'. If no parameters are provided,
 *          returns an empty string.
 */

type QueryPrimitive = string | number;
type QueryValue = QueryPrimitive | QueryPrimitive[] | undefined | null;

export function convertRequestParams<T extends object>(params: T): string {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		const v = value as QueryValue;

		if (v === null || v === undefined) continue;

		if (Array.isArray(v)) {
			for (const item of v) {
				searchParams.append(key, String(item));
			}
		} else {
			searchParams.append(key, String(v));
		}
	}

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}
