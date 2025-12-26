export function parseSummaryCell<TLabel, TValue>(
	rawText: string,
	mapLabel: (raw: string) => TLabel,
	mapValue: (raw?: string) => TValue,
): { label: TLabel; value: TValue } {
	const lines = rawText
		.split("\n")
		.map((s) => s.trim())
		.filter(Boolean);

	return {
		label: mapLabel(lines[0] || ""),
		value: mapValue(lines[1]),
	};
}
