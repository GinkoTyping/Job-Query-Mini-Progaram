import { createStore } from 'vuex';
import { markRaw } from 'vue'

export const store = createStore({
	state: {
		gradesCollections: {},
		userInfo: {},
		systemInfo: {},
	},
	mutations: {
		setUserInfo(state, val) {
			state.userInfo = val;
		},
		setSystemInfo(state, val) {
			state.systemInfo = markRaw(val);
		}
	},
	actions: {
		async getUserInfo({ commit }, val) {
			if (uni.getUserInfo){
				uni.getUserInfo({
					success(res) {
						commit('setUserInfo', res.userInfo)
					}
				})
			}
		},
		async getSystemInfo({ commit }) {
			uni.getSystemInfo({
				success(res) {
					commit('setSystemInfo', res);
				}
			});
		}
	},
	getters: {
		userAvatar(state) {
			return state.userInfo.avatarUrl;
		},
		userName(state) {
			return state.userInfo.nickName;
		},
		deviceGeo(state) {
			return {
				windowHeight: `${state.systemInfo.windowHeight* (750 / state.systemInfo.windowWidth)}rpx`,
				windowWidth: `${state.systemInfo.windowWidth* (750 / state.systemInfo.windowWidth)}rpx`,
			}
		},
		flex4Question(state) {
			const height4question = state.systemInfo.windowHeight* (750 / state.systemInfo.windowWidth) - 350
			if (height4question >= 150*6 + 20*5){
				return {
					QUESTION_HEIGHT: `${height4question}rpx`,
					QUESTION_MARGIN: `${Math.floor((height4question - 150*6)/5)}rpx`,
					QUESTION_COUNTS: 6
				}
			}
			return {
				QUESTION_HEIGHT: `${height4question}rpx`,
				QUESTION_MARGIN: `${Math.floor((height4question - 150*5)/4)}rpx`,
				QUESTION_COUNTS: 5
			}
		},
	}
})
