export function getDatePlusDays(days: number): string {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date.toISOString().split("T")[0]!;
}

export function getRandomFutureDate(): string {
	const days = Math.floor(Math.random() * 10) + 1;
	return getDatePlusDays(days);
}
