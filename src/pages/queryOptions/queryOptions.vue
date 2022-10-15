<template>
  <view class="content"
    :style="{ height: windowGeo.windowHeight }"
    @click="setDefault">
		<text class="restNums">{{answerList.value.length}}/60</text>
		<img class="img img_left" src="@/static/left_small.png" alt="">
		<img class="img img_right" src="@/static/right_small.png" alt="">
		<view class="queryOptions">
			<view
				v-for="(question, index) in currentQuestions.value"
				:key="question.id"
				class="question_box"
				:show="question.answer"
				@change="(val) => onChange(val, question, index)">
				<uni-transition ref="ani" custom-class="transition" :mode-class="['fade', 'zoom-in']" :styles="{}" :show="question.isShow">
					<!-- 问题区域 -->
					<view 
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
						<view class="icons" @click.stop="setAnswer('left', question)" style="backgroundColor: var(--box_yes);" :class="{ 'show_icon': selectedIndex.value === question.id}">
							<uni-icons
								color="var(--box_normal)"
								type="checkmarkempty"
								size="16">
							</uni-icons>
						</view>

						<text>{{ question.question }}</text>
						
						<!-- 符号 -->
						<view class="icons" @click.stop="setAnswer('right', question)" style="backgroundColor: var(--box_no);" :class="{ 'show_icon': selectedIndex.value === question.id}">
							<uni-icons type="closeempty"
								color="var(--box_normal)"
								size="16">
							</uni-icons>
						</view>
					</view>
				</uni-transition>
			</view>
		</view>
  </view>
</template>

<script>
export default {
  name: "queryOptions",
};
</script>

<script setup>
import { computed, reactive, nextTick } from "vue";
import { onShareAppMessage } from "@/utils/useShare"
import { useStore } from "vuex";
import { onLoad } from "@dcloudio/uni-app";
import { initQuestions } from "../../utils/form.js";
import { useGetType } from "../../utils/getResult.js";
const store = useStore();

// 初始化高度、问题单列表
// 高度 —— 总界面
const windowGeo = computed(() => store.getters.deviceGeo);
const flex4Question = computed(() => store.getters.flex4Question);
const flexMargin = computed(() => flex4Question.value.QUESTION_MARGIN);
const currentQuestions = reactive({ value: [] });
let orginQestions = initQuestions().slice(0);

// 答案统计
const answerList = reactive({value : []});
const records = computed(() => store.state.records);
onLoad((option = 'reset') => {
	if (option.isReset === 'continue'){
		answerList.value.push(...records.value);
		const savedId = records.value.map(item => item.id);
		orginQestions = orginQestions.filter(question => !savedId.includes(question.id));
	} else {
		store.commit('updateRecords', { execution: 'reset' });
	}
	// 问题单列表
	currentQuestions.value = orginQestions.splice(0, flex4Question.value.QUESTION_COUNTS).map((question) => {
			return {
				...question,
				answer: "none",
				isShow: true,
			};
		});
})

// 选项样式 ———— 控制
const selectedIndex = reactive({ value: -1 });
const boxColor = reactive({ value: "var(--box_normal)" });
const isIconShow = reactive({value: 'none'});

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
const onChange = (val, question, index) => {
  selectedIndex.value = val === 'none' ? selectedIndex.value : question.id;
  switch (val) {
    case "left":
      boxColor.value = "var(--box_yes)";
      question.answer = "left";
      break;
    case "right":
      boxColor.value = "var(--box_no)";
      question.answer = "right";
      break;
    default:
      boxColor.value = "var(--box_normal)";
      question.answer = "none";
      break;
  }
};
const onClick = e => {
  selectedIndex.value = e.currentTarget.dataset.id;
};

// 选择答案
const setAnswer = (answer, question) => {
	answerList.value.push({id: question.id, answer});
	store.commit('updateRecords', {
		item: {id: question.id, answer},
		execution: 'add',
	});

	question.isShow = false
	selectedIndex.value = -1;
	const deleteIndex = currentQuestions.value.findIndex( curQuestion => curQuestion.id === question.id);
	if (currentQuestions.value.length){
		setTimeout(() => {
			currentQuestions.value.splice(deleteIndex, 1);
			// 等待删除完成之后，再添加新的
			nextTick(() => {
				if (currentQuestions.value.length){
					currentQuestions.value.push(...orginQestions.splice(0, 1).map(question => ({
						...question,
						answer: "none",
						isShow: true,
					})));
				} else {
					store.commit('setOutput', useGetType(answerList.value))
					uni.navigateTo({ url: '../queryOutput/queryOutput' });
				}
			})
		}, 300);
	}
}



</script>

<style lang="scss" scoped>
.content {
  --box_normal: #{$uni-bg-color};
  --box_yes: #{$uni-color-success};
  --box_no: #{$uni-color-error};
  --box_icon: #{$uni-bg-color-main};
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
	.question_wrapper {
		position: relative;
		
	}
  .queryOptions {
		margin-top: 350rpx;
    flex-direction: column;
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