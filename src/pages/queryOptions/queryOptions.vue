<template>
  <view class="content"
    :style="{ height: windowGeo.windowHeight }"
    @click="setDefault">
		<text class="restNums">{{answerList.value.length}}/60</text>
		<img class="img img_left" src="@/static/left_small.png" alt="">
		<img class="img img_right" src="@/static/right_small.png" alt="">
		<uni-swipe-action
			class="queryOptions">
			<uni-swipe-action-item
				v-for="(question, index) in currentQuestions.value"
				:key="question.id"
				class="question_box"
				:show="question.answer"
				@change="(val) => onChange(val, question, index)">

				<!-- 符合 -->
				<template v-slot:left>
					<view class="slot_btn"
						@click.stop="setAnswer('left', question.id)"
						:style="{backgroundColor: 'var(--box_yes)', marginTop: flexMargin}">
						<text>符合</text>
					</view>
				</template>

				<!-- 不符合 -->
				<template v-slot:right>
					<view class="slot_btn"
						@click.stop="setAnswer('right', question.id)"
						:style="{backgroundColor: 'var(--box_no)', marginTop: flexMargin}">
						<text>不符合</text>
					</view>
				</template>

				<!-- 问题区域 -->
				<view 
					:class="{
						row: true,
						row_selected: selectedIndex.value === question.id,
						row_notSelected:
							selectedIndex.value !== question.id && selectedIndex.value !== -1,
						animate__animated: true, 
						animate__fadeInUp: true,
						animate__fadeOutLeft: currentFadingOptions.direction === 'right' && currentFadingOptions.id === question.id,
						animate__fadeOutRight: currentFadingOptions.direction === 'left' && currentFadingOptions.id === question.id,
						row_yes: question.answer === 'left' && selectedIndex.value === question.id,
						row_no: question.answer === 'right' && selectedIndex.value === question.id
					}" 
					:style="{ 
						marginTop: flexMargin,
						animationDuration: '0.2s'
						}"
					:data-id="question.id"
					@click.stop="onClick">
					<!-- 符号 -->
					<view class="icons" :class="{ 'show_icon': selectedIndex.value === question.id}">
						<uni-icons
							color="var(--box_icon)"
							type="arrow-right"
							size="16">
						</uni-icons>
						<uni-icons
							color="var(--box_yes)"
							type="checkmarkempty"
							size="16">
						</uni-icons>
					</view>

					<text>{{ question.question }}</text>
					
					<!-- 符号 -->
					<view class="icons" :class="{ 'show_icon': selectedIndex.value === question.id}">
						<uni-icons type="closeempty"
							color="var(--box_no)"
							size="16">
						</uni-icons>
						<uni-icons type="arrow-left"
							color="var(--box_icon)"
							size="16">
						</uni-icons>
					</view>
				</view>

			</uni-swipe-action-item>
		</uni-swipe-action>
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
import { onReady } from "@dcloudio/uni-app";
import { initQuestions } from "../../utils/form.js";
import { useGetType } from "../../utils/getResult.js";
const store = useStore();

// 初始化高度、问题单列表
// 高度 —— 总界面
const windowGeo = computed(() => store.getters.deviceGeo);
const flex4Question = computed(() => store.getters.flex4Question);
const flexMargin = computed(() => flex4Question.value.QUESTION_MARGIN);
const currentQuestions = reactive({ value: [] });
const orginQestions = initQuestions().slice(0);

onReady(()=>{
	// 问题单列表
	currentQuestions.value = orginQestions.splice(0, flex4Question.value.QUESTION_COUNTS).map((question) => {
		return {
			...question,
			answer: "none",
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

// 答案统计
const answerList = reactive({value : []});
const currentFadingOptions = reactive({id: -1, direction:''})
// 选择答案
const setAnswer = (answer, id) => {
	answerList.value.push({id, answer});
	currentFadingOptions.id = id;
	currentFadingOptions.direction = answer;
	selectedIndex.value = -1;
	const deleteIndex = currentQuestions.value.findIndex( question => id === question.id)
	if (currentQuestions.value.length){
		setTimeout(() => {
			currentQuestions.value.splice(deleteIndex, 1);
			// 等待删除完成之后，再添加新的
			nextTick(() => {
				if (currentQuestions.value.length){
					currentQuestions.value.push(...orginQestions.splice(0, 1).map(question => ({
					...question,
					answer: "none",
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
  --box_yes: #{$uni-color-primary};
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
    display: flex;
    flex-direction: column;
    .question_box {
      &:first-child .row,
      &:first-child .slot_btn {
        margin-top: 0 !important;
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
      height: 150rpx;
      text-align: center;
      line-height: 50rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
			background-color: $uni-bg-color;
			text {
				margin: 0 auto;
				text-align: center;
			}
			.icons {
				display: none;
			}
			.show_icon {
				display: block;
			}
    }
    .row_selected {
      height: 210rpx !important;
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