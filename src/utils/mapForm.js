export const getRandom = (list) => {
	return list.sort(() => Math.random() - 0.5).slice(0, 10);
}