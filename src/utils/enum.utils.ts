export function getRandomEnumValue<T extends object>(enumObject: T): T[keyof T] {
	const values = Object.values(enumObject);
	const randomIndex = Math.floor(Math.random() * values.length);
	return values[randomIndex];
}

export function getDifferentEnumValue<T extends object>(enumObject: T, currentValue: T[keyof T]): T[keyof T] {
	let newValue = getRandomEnumValue(enumObject);
	while (newValue === currentValue) {
		newValue = getRandomEnumValue(enumObject);
	}
	return newValue;
}
