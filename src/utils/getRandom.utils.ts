export function getRandomItemsFromArray<T>(array: T[], numberOfItems: number): T[] {
	const arr = [...array];
	const result: T[] = [];
	for (let i = 0; i < numberOfItems; i++) {
		const index = Math.floor(Math.random() * arr.length);
		result.push(arr[index]!);
		arr.splice(index, 1);
	}
	return result;
}
