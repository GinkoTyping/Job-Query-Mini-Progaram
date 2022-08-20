const list_Normal = {
	incrementList: [7, 19, 29, 39, 41, 51, 57],
	decrementList: [5, 18, 40]
}
const list_Reality = {
	incrementList: [2, 13, 22, 36, 43],
	decrementList: [14, 23, 44, 47, 48]
}
const list_Research = {
	incrementList: [6, 8, 20, 30, 31, 42],
	decrementList: [21, 55, 56, 58]
}
const list_Management = {
	incrementList: [11, 24, 28, 35, 38, 46, 60],
	decrementList: [3, 16, 25]
}
const list_Social = {
	incrementList: [26, 37, 52, 59],
	decrementList: [1, 12, 15, 27, 45, 53]
}
const list_Art = {
	incrementList: [4, 9, 10, 17, 33, 34, 49, 50, 54],
	decrementList: [32]
}

const executor = (type, typeList, question) => {
	if (typeList.incrementList.includes(question.id)) {
		return {
			type,
			executeType: question.answer === 'left' ? 'increment' : ''
		}
	}
	return {
		type,
		executeType: question.answer === 'right' ? 'decrement' : ''
	}
}

export const useGetType = answersArr => {
	const ouput = {
		type_Normal: 0,
		type_Reality: 0,
		type_Research: 0,
		type_Management: 0,
		type_Social: 0,
		type_Art: 0,
	}
	answersArr.forEach(question => {
		let execution = {};

		switch (true) {
			case [...list_Normal.incrementList, ...list_Normal.decrementList].includes(question.id):
				execution = executor('Normal', list_Normal, question);
				break;
			case [...list_Reality.incrementList, ...list_Reality.decrementList].includes(question.id):
				execution = executor('Reality', list_Reality, question);
				break;
			case [...list_Research.incrementList, ...list_Research.decrementList].includes(question.id):
				execution = executor('Research', list_Research, question);
				break;
			case [...list_Management.incrementList, ...list_Management.decrementList].includes(question.id):
				execution = executor('Management', list_Management, question);
				break;
			case [...list_Social.incrementList, ...list_Social.decrementList].includes(question.id):
				execution = executor('Social', list_Social, question);
				break;
			case [...list_Art.incrementList, ...list_Art.decrementList].includes(question.id):
				execution = executor('Art', list_Art, question);
				break;
			default:
				break;
		}

		if (execution.executeType) {
			if (execution.executeType === 'increment') {
				ouput[`type_${execution.type}`] = ouput[`type_${execution.type}`] + 1;
			}
			if (execution.executeType === 'decrement') {
				ouput[`type_${execution.type}`] = ouput[`type_${execution.type}`] - 1;
			}
		}


	})

	return ouput;
}