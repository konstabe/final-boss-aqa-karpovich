import moment from "moment";

const DATE_AND_TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
const DATE_FORMAT = "YYYY/MM/DD";

export function convertToDateAndTime(value: string | Date) {
	return moment(value).format(DATE_AND_TIME_FORMAT);
}

/**
 *
 * @param {string} value
 * @returns yyyy/mm/dd
 */
export function convertToDate(value: string | Date) {
	return moment(value).format(DATE_FORMAT);
}

/**
 *
 * @param {string} value
 * @returns e.g. October 24, 2024 3:34 PM
 */
export function convertToFullDateAndTime(value: string | Date) {
	return moment(value).format("LLL");
}

/**
 *
 * @param {string} monthYear e.g. "January 2026"
 * @param {string | number} day e.g. "6"
 * @returns yyyy/mm/dd
 */
export function parseDatepickerDate(monthYear: string, day: string) {
	return moment(`${monthYear} ${day}`, "MMMM YYYY D", true).format("YYYY/MM/DD");
}
