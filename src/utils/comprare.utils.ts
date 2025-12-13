type Comparable = string | number | Date | boolean | null | undefined;

export function compareValues(a: Comparable, b: Comparable): number {
	//null / undefined
	const aNull = a === null || a === undefined;
	const bNull = b === null || b === undefined;
	if (aNull || bNull) return Number(aNull) - Number(bNull);

	//Date
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() - b.getTime();
	}

	//Number
	if (typeof a === "number" && typeof b === "number") {
		return a - b;
	}

	//Boolean
	if (typeof a === "boolean" && typeof b === "boolean") {
		return Number(a) - Number(b);
	}

	//String
	return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function returnSortedArrayWithOrder<T>(array: T[], field: keyof T, order: "asc" | "desc" = "asc"): T[] {
	return [...array].sort((a, b) => {
		const aValue = a[field] as Comparable;
		const bValue = b[field] as Comparable;
		const comparison = compareValues(aValue, bValue);
		return order === "asc" ? comparison : -comparison;
	});
}
