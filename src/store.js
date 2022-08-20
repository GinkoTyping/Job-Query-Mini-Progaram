import { createStore } from 'vuex';
import { markRaw } from 'vue'

export const store = createStore({
	state: {
		gradesCollections: {},
		systemInfo: {},
		output: {}
	},
	mutations: {
		setSystemInfo(state, val) {
			state.systemInfo = markRaw(val);
		},
		setOutput(state, val) {
			state.output = markRaw(val);
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
			const height4question = state.systemInfo.windowHeight * (750 / state.systemInfo.windowWidth) - 350
			if (height4question >= 150 * 6 + 20 * 5) {
				return {
					QUESTION_HEIGHT: `${height4question}rpx`,
					QUESTION_MARGIN: `${Math.floor((height4question - 150 * 6) / 5)}rpx`,
					QUESTION_COUNTS: 6
				}
			}
			return {
				QUESTION_HEIGHT: `${height4question}rpx`,
				QUESTION_MARGIN: `${Math.floor((height4question - 150 * 5) / 4)}rpx`,
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
		}
	}
})
