<template>
	<view class="content" :style="{ height: windowGeo.windowHeight }" @click="setDefault">
		<text class="restNums">{{headLine}}</text>
		<img class="img img_left" src="@/static/left_small.png" alt="">
		<img class="img img_right" src="@/static/right_small.png" alt="">
		<view v-show="answerList.value.length !== totalCounts" class="queryOptions">
			<view v-for="question in currentQuestions.value" :key="question.id" class="question_box"
				:show="question.answer">
				<uni-transition ref="ani" custom-class="transition" :mode-class="animationKind(question.isShow)" :styles="{}"
					:show="question.isShow">
					<!-- 问题区域 / 60题版本 -->
					<view
						v-if="routeQuery.includes('60')"
						:class="{
							row: true,
							row_selected: selectedIndex.value === question.id,
							row_notSelected:
								selectedIndex.value !== question.id && selectedIndex.value !== -1,
							row_yes: question.answer === 'left' && selectedIndex.value === question.id,
							row_no: question.answer === 'right' && selectedIndex.value === question.id
						}" 
						:style="{ 
							marginTop: flexMargin,
						}" 
						:data-id="question.id"
						@click.stop="onClick">
						<!-- 符号 -->
						<view class="icons" @click.stop="setAnswer('left', question)" style="backgroundColor: var(--box_yes);"
							:class="{ 'show_icon': selectedIndex.value === question.id}">
							<uni-icons color="var(--box_normal)" type="checkmarkempty" size="16">
							</uni-icons>
						</view>

						<text>{{ question.question }}</text>

						<!-- 符号 -->
						<view class="icons" @click.stop="setAnswer('right', question)" style="backgroundColor: var(--box_no);"
							:class="{ 'show_icon': selectedIndex.value === question.id}">
							<uni-icons type="closeempty" color="var(--box_normal)" size="16">
							</uni-icons>
						</view>
					</view>

					<!-- 问题区域 / 20题版本 -->
					<view
						v-else
						:class="{
							row: false,
							row_selected: selectedIndex.value === question.id,
							row_notSelected: selectedIndex.value !== question.id && selectedIndex.value !== -1,
						}" 
						:style="{ 
							marginTop: flexMargin,
						}" 
						:data-id="question.id">
						<view class="row quertion-title" @click.stop="">
							<uni-icons v-show="question.id > 1" @click.stop="setPreviousAnswer(question)" type="back" color="var(--btn_color)" size="30" style="margin: 0 10px;">
							</uni-icons>
							<text>{{question.title}}</text>
							<uni-icons v-show="selectedIndex.value !== -1" @click.stop="setAnswer(selectedIndex.value, question)" :type="question.id !== totalCounts.value ? 'forward' : 'checkbox-filled'" color="var(--btn_color)" size="30" style="margin: 0 10px;">
							</uni-icons>
						</view>
						
						<view 
							v-for="option in question.options"
							:key="option.label"
							@click.stop="onClick"
							class="row quertion-options"
							:data-id="option.value"
							:style="{ marginTop: flexMargin }">
							<uni-icons
								:type="option.value === selectedIndex.value ? 'heart-filled' : 'heart'"
								:color="option.value === selectedIndex.value ? 'var(--btn_color)' : 'var(--box_icon)'"
								size="22"
								style="marginRight: 10px;">
							</uni-icons>
							<text class="quertion-options__item">{{option.label}}</text>
						</view>
					</view>
				</uni-transition>
			</view>
		</view>
		<view
			v-if="answerList.value.length === totalCounts"
			style="marginTop: 350rpx;display: flex; flex-direction: column;justify-content: center;">
			<ad adpid="1260193687" @load="onAdShow" style="margin: 0 auto; width: 100%;"/>
			<text v-if="!showSubmitButton" style="margin: 0 auto;">分析中...约{{countDonwNum}}秒后自动跳转！</text>
			<text class="button-submit" v-if="showSubmitButton" @click="submit">查看结果</text>
		</view>
	</view>
</template>

<script>
export default {
	name: "queryOptions",
};
</script>

<script setup>
import { computed, reactive, nextTick, ref } from "vue";
import { onShareAppMessage } from "@/utils/useShare";
import { useStore } from "vuex";
import { onLoad } from "@dcloudio/uni-app";
import { initQuestions } from "../../utils/form.js";
import init20Questions from "../../utils/form-20";
import { useGetType } from "../../utils/getResult.js";
const store = useStore();

/**
 * 初始化高度、问题单列表
 */
// 高度 —— 总界面
const windowGeo = computed(() => store.getters.deviceGeo);
const flex4Question = computed(() => store.getters.flex4Question);
const flexMargin = computed(() => flex4Question.value.QUESTION_MARGIN);

// 切换题目时的动画
const animationKind = computed(() => {
	return isShow => {
		if (routeQuery.value.includes('20')) {
			return isShow ? ['fade', 'slide-right'] : ['fade', 'slide-left'];
		}
		return ['fade', 'zoom-in'];
	}
})

const currentQuestions = reactive({ value: [] });
const orginQestions = reactive({value: []});
const totalCounts = ref(-1);


// 答案统计
const answerList = reactive({ value: [] });
const records = computed(() => store.state.records);
const routeQuery = ref('');
const headLine = computed(() => {
	if (answerList.value.length + 1 > totalCounts.value) {
		return '问卷已完成!'
	}
	return `当前第 ${answerList.value.length + 1} 题/总共 ${totalCounts.value} 题`
})
onLoad((option = 'reset') => {
	routeQuery.value = option.isReset;

	orginQestions.value = option.isReset.includes('60') ? initQuestions().slice(0) : init20Questions.questions.slice(0);
	totalCounts.value = orginQestions.value.length;
	if (option.isReset.includes('continue')) {
		answerList.value.push(...records.value);
		const savedId = records.value.map(item => item.id);
		orginQestions.value = orginQestions.value.filter(question => !savedId.includes(question.id));
	} else {
		store.commit('updateRecords', { execution: 'reset' });
	}
	// 问题单列表
	const eachSize = option.isReset.includes('60') ? flex4Question.value.QUESTION_COUNTS : 1;
	currentQuestions.value = orginQestions.value.splice(0, eachSize).map((question) => {
		return {
			...question,
			answer: "none",
			isShow: true,
		};
	});
})

// 选项样式 ———— 控制
const selectedIndex = reactive({ value: -1 });
const isSelected = computed(() => {
	return id => {
		return id === selectedIndex.value;
	}
})
const boxColor = reactive({ value: "var(--box_normal)" });
const isIconShow = reactive({ value: 'none' });

// 重置选择项
const setDefault = () => {
	currentQuestions.value.forEach((question) => {
		if (question.answer !== "pending") {
			question.answer = "pending";
		}
	});
	selectedIndex.value = -1;
};
// 事件
const onClick = e => {
	selectedIndex.value = e.currentTarget.dataset.id;
};

// 选择答案
const setAnswer = (answer, question) => {
	if (answer === -1) {
		return;
	}
	question.isShow = false
	selectedIndex.value = -1;
	const deleteIndex = currentQuestions.value.findIndex(curQuestion => curQuestion.id === question.id);
	
	// 备份已完成的题目
	answerList.value.push({
		title: currentQuestions.value[deleteIndex].title,
		options: currentQuestions.value[deleteIndex].options,
		id: question.id,
		answer: answer,
	});
	// 更新vuex
	store.commit('updateRecords', {
		item: {
			id: question.id, 
			answer,
			title: currentQuestions.value[deleteIndex].title,
			options: currentQuestions.value[deleteIndex].options,
		},
		execution: 'add',
	});

	if (currentQuestions.value.length) {
		setTimeout(() => {
			currentQuestions.value.splice(deleteIndex, 1);
			// 等待删除完成之后，再添加新的
			nextTick(() => {
				if (answerList.value.length < totalCounts.value) {
					currentQuestions.value.push(...orginQestions.value.splice(0, 1).map(question => ({
						...question,
						answer: "none",
						isShow: true,
					})));
				} else {
					store.commit('setOutput', routeQuery.value.includes('60') ? useGetType(answerList.value) : answerList.value);
					// uni.navigateTo({ url: '../queryOutput/queryOutput' });
				}
			})
		}, 300);
	}
}
// 回退到上一个题目
const setPreviousAnswer = question => {
	question.isShow = false;
	setTimeout(() => {
		const preQuestion = answerList.value.pop();
		orginQestions.value.unshift(currentQuestions.value.pop());
		store.commit('updateRecords', { execution: 'backward' });
		nextTick(() => {
			currentQuestions.value.push({
				...preQuestion,
				isShow: true,
			});
			selectedIndex.value = preQuestion.answer;
		});
	}, 300);
};

const submit = () => {
	uni.navigateTo({ url: '../queryOutput/queryOutput' });
}

const countDonwNum = ref(3);
const showSubmitButton = ref(false);
const onAdShow = () => {
	const timer = setInterval(() => {
		countDonwNum.value = countDonwNum.value - 1;
		if (!countDonwNum.value) {
			showSubmitButton.value = true;
			clearInterval(timer);
			submit();
		}
	}, 1000);
}


</script>

<style lang="scss" scoped>
.content {
	--box_normal: #{$uni-bg-color};
	--box_yes: #{$uni-color-success};
	--box_no: #{$uni-color-error};
	--box_icon: #{$uni-bg-color-main};
	--text_color: #{$uni-text-color};
	--btn_color: #{$uni-btn-color};
	overflow-y: hidden;
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
	background-color: $uni-bg-color-main;

	.restNums {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		background-color: $uni-btn-color;
		padding: 10rpx;
		border-radius: 20rpx;
		color: $uni-text-color;
	}
	.button-submit {
		margin: 50rpx auto 0;
		padding: 20rpx;
		font-size: 50rpx;
		font-weight: 600;
		background-color: $uni-btn-color;
		border-radius: 20rpx;
		color: $uni-text-color;
	}

	.question_wrapper {
		position: relative;

	}

	.queryOptions {
		margin-top: 350rpx;
		flex-direction: column;

		.quertion-title {
			padding: 0 10rpx;
			height: 210rpx !important;
		}

		.quertion-options {
			padding: 0 30rpx;
			background-color: $uni-bg-color !important;
			justify-content: flex-start !important;
			.quertion-options__item {
				text-align: left;
				margin: 0;
			}
		}

		.question_box {

			&:first-child .row,
			&:first-child .slot_btn {
				margin-top: 0 !important;
			}

			.icons {
				margin: 0 20rpx;
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background-color: red;
				display: none;
			}

			.show_icon {
				display: flex;
				flex: none;
				align-items: center;
				justify-content: center;
			}
		}

		.slot_btn {
			box-sizing: border-box;
			width: 150rpx;
			display: flex;
			align-items: center;

			text {
				color: $uni-text-color;
				margin: 0 auto;
				font-weight: 600;
			}
		}

		.row {
			color: $uni-text-color;
			border-radius: 30rpx;
			height: 150rpx;
			text-align: center;
			line-height: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 600;
			background-color: $uni-color-primary;

			text {
				margin: 0 auto;
				text-align: center;
			}
		}

		.row_selected {
			height: 210rpx !important;
			background-color: $uni-bg-color;
		}

		.row_notSelected {
			height: 135rpx !important;
		}

		.row_yes {
			background-color: $uni-color-primary;
		}

		.row_no {
			background-color: $uni-color-error;
		}
	}

	.img {
		position: absolute;
		top: 50rpx;
		width: 300rpx;
		height: 300rpx;
		background-size: contain;
	}

	.img_right {
		right: 0;
	}
}
</style>