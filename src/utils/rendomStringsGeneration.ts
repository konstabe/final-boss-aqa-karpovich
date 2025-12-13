import _ from "lodash";

export function randomString(length: number): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return _.times(length, () => _.sample(chars)!).join("");
}
