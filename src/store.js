import { createStore } from 'vuex';
import { markRaw } from 'vue'

export const store = createStore({
	state: {
		formKind: '',
		gradesCollections: {},
		systemInfo: {},
		output: {},
		records: [],
	},
	mutations: {
		setSystemInfo(state, val) {
			state.systemInfo = markRaw(val);
		},
		setOutput(state, val) {
			state.output = markRaw(val);
		},
		setFormKind(state, val) {
			state.formKind = val;
		},
		updateRecords(state, { item = {}, execution }) {
			if (execution === 'add') {
				state.records.push(item);
			}
			if (execution === 'backward') {
				state.records.pop();
			}
			if (execution === 'reset') {
				state.records = [];
			}
		}
	},
	actions: {
		async getSystemInfo({ commit }) {
			uni.getSystemInfo({
				success(res) {
					commit('setSystemInfo', res);
				}
			});
		}
	},
	getters: {
		deviceGeo(state) {
			return {
				windowHeight: `${state.systemInfo.windowHeight * (750 / state.systemInfo.windowWidth)}rpx`,
				windowWidth: `${state.systemInfo.windowWidth * (750 / state.systemInfo.windowWidth)}rpx`,
			}
		},
		flex4Question(state) {
			let showItemCount;
			let totalMargin;
			const height4question = state.systemInfo.windowHeight * (750 / state.systemInfo.windowWidth) - 350;
			if (height4question >= 150 * 6 + 20 * 5) {
				showItemCount = state.formKind === '60' ? 5 : 4;
				totalMargin = state.formKind === '60' ? height4question - 150 * 6 : height4question - 150 * 5 - 220;
				return {
					QUESTION_HEIGHT: `${height4question}rpx`,
					QUESTION_MARGIN: `${Math.floor(totalMargin / showItemCount)}rpx !important`,
					QUESTION_COUNTS: 6
				}
			}
			showItemCount = state.formKind === '60' ? 4 : 3;
			totalMargin = state.formKind === '60' ? height4question - 150 * 5 : height4question - 150 * 4 - 220;
			return {
				QUESTION_HEIGHT: `${height4question}rpx`,
				QUESTION_MARGIN: `${Math.floor(totalMargin / showItemCount)}rpx !important`,
				QUESTION_COUNTS: 5
			}
		},
		finalOutput(state) {
			let temp = []
			const qoute = state.output;
			Object.keys(qoute).forEach(key => {
				temp.push({ type: key, value: qoute[key] })
			})
			temp = temp.sort((a, b) => b.value - a.value);
			return temp;
		},
		finalOutput20(state) {
			let tempMap = new Map();
			['D', 'I', 'S', 'C'].forEach(key => {
				tempMap.set(key, 0);
			});
			tempMap = state.output.reduce((pre, cur) => {
				const value = pre.get(cur.answer) + 1;
				pre.set(cur.answer, value);
				return pre;
			}, tempMap);

			let output = []
			tempMap.forEach((value, key) => {
				output.push({
					value,
					type: key,
				})
			});
			output = output.sort((a, b) => b.value - a.value);
			return output;
		}
	}
})
