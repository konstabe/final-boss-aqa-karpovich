/**
 * Converts an object of request parameters into a URL query string.
 *
 * @param params - An object where keys are parameter names and values are parameter values.
 *                 Values can be either strings or arrays of strings.
 * @returns A string representing the URL query parameters, with parameters
 *          properly encoded and concatenated by '&'. If no parameters are provided,
 *          returns an empty string.
 */

export function convertRequestParams<T extends Record<string, string | number | Array<string | number>>>(params: T) {
	if (!params) return "";

	const searchParams = new URLSearchParams();

	for (const key of Object.keys(params)) {
		const value = params[key];

		if (Array.isArray(value)) {
			for (const v of value) {
				searchParams.append(key, String(v));
			}
		} else {
			searchParams.append(key, String(value));
		}
	}

	return `?${searchParams.toString()}`;
}
