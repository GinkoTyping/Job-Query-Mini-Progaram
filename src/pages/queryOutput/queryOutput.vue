<template>
	<view class="queryOutput" :style="{ height: windowGeo.windowHeight }">
		<view class="title">
			<text>{{currentType.name}}</text>
			<uni-icons type="vip-filled" size="30" color="rgb(41,121,255)" style="position: absolute;"></uni-icons>
		</view>
		<uni-section class="mb-10" title="你的职业" type="line" titleColor="#001858" titleFontSize="16px">
			<view :style="{height: `${halfHeight}rpx`}">
				<qiun-data-charts type="word" :opts="opts4Job" :chartData="charData4Job" background="#fef6e4" />
			</view>
		</uni-section>
		<uni-section class="mb-10" title="性格趋势图" type="line" titleColor="#001858" titleFontSize="16px">
			<view :style="{height: `${halfHeight}rpx`}">
				<qiun-data-charts type="pie" :opts="opts4Circle" :chartData="charData4Circle" background="#fef6e4" />
			</view>
		</uni-section>
		<ad-rewarded-video
			v-if="!moreInfo.value.good.series.length && currentFormKind.includes('20')"
			class="button-show-more"
			adpid="1739644109"
			:loadnext="true" 
			v-slot:default="{loading, error}"
			@close="onAdClose">
			<button :disabled="loading" :loading="loading">点击观看10秒广告后，即可查看完整分析！</button>
      <view v-if="error">{{error}}</view>
		</ad-rewarded-video>
		<uni-section class="mb-10" title="详细描述" type="line" titleColor="#001858" titleFontSize="16px">
			<uni-card style="margin-bottom: 0 !important">
				<text class="uni-body" user-select>{{currentType.desc}}</text>
			</uni-card>
		</uni-section>
		<uni-section v-show="moreInfo.value.good.series.length" class="mb-10" title="优点" type="line" titleColor="#001858"
			titleFontSize="16px">
			<view :style="{height: `${halfHeight}rpx`}">
				<qiun-data-charts type="word" :opts="opts4Job" :chartData="moreInfo.value.good" background="#fef6e4" />
			</view>
		</uni-section>
		<uni-section v-show="moreInfo.value.good.series.length" class="mb-10" title="缺点" type="line" titleColor="#001858"
			titleFontSize="16px">
			<view :style="{height: `${halfHeight}rpx`}">
				<qiun-data-charts type="word" :opts="opts4Job" :chartData="moreInfo.value.bad" background="#fef6e4" />
			</view>
		</uni-section>
		<uni-section v-show="moreInfo.value.good.series.length" class="mb-10" title="一些建议" type="line" titleColor="#001858"
			titleFontSize="16px">
			<uni-card>
				<text class="uni-body">{{moreInfo.value.desc}}</text>
			</uni-card>
		</uni-section>
		
	</view>
</template>

<script setup>
import { computed, reactive } from "vue";
import { onShareAppMessage } from "@/utils/useShare";
import { useStore } from "vuex";
import { onLoad } from "@dcloudio/uni-app";
import { initResult } from "../../utils/form.js";
import init20Questions from "../../utils/form-20";
const store = useStore();
const currentFormKind = computed(() => store.state.formKind);
const allTypes = computed(() => {
	return store.state.formKind.includes('60') ? initResult() : init20Questions.result;
});

const windowGeo = computed(() => store.getters.deviceGeo);
const halfHeight = (Number(windowGeo.value.windowHeight.replace('rpx', '')) - 80 - 50 * 3 - 40) / 2;
const finalOutput = computed(() => store.state.formKind.includes('60') ? store.getters.finalOutput : store.getters.finalOutput20);
const currentType = computed(() => {
	const type = finalOutput.value[0].type;
	return allTypes.value[type];
})

// ---------------- chart ---------------- 
let charData4Job = reactive({ series: [] });
let charData4Circle = reactive({ series: [{ data: [] }] });
const mapCallBack = (item, index) => {
	let textSize
	if (!index) {
		textSize = 20;
	} else if (index <= 2) {
		textSize = 16;
	} else if (index <= 5) {
		textSize = 14;
	} else {
		textSize = 12;
	}
	return {
		name: item,
		textSize,
		data: undefined,
	}
};
onLoad(() => {
	charData4Job.series = finalOutput.value
		.slice(0, 2)
		.reduce((pre, cur, index) => {
			if (index) {
				pre.push(...allTypes.value[cur.type].jobs.slice(0, 3));
			} else {
				pre.push(...allTypes.value[cur.type].jobs);
			}
			return pre;
		}, [])
		.map((item, index) => mapCallBack(item, index));
	charData4Circle.series[0].data = finalOutput.value.map(item => ({
		name: allTypes.value[item.type].name.slice(0, 3),
		value: item.value >= 0 ? item.value : 0,
	}));
});

const moreInfo = reactive({ value: { good: { series: [] }, bad: { series: [] }, desc: '' } });
const setMoreInfo = () => {
	moreInfo.value.good.series.push(...currentType.value.more.good.map((item, index) => mapCallBack(item, index)));
	moreInfo.value.bad.series.push(...currentType.value.more.bad.map((item, index) => mapCallBack(item, index)).slice(0, 8));
	moreInfo.value.desc = currentType.value.more.desc;
}

// 看完广告
const onAdClose = e => {
	const detail = e.detail;
	if (detail && detail.isEnded) {
		moreInfo.value.good.series.push(...currentType.value.more.good.map((item, index) => mapCallBack(item, index)));
		moreInfo.value.bad.series.push(...currentType.value.more.bad.map((item, index) => mapCallBack(item, index)).slice(0, 8));
		moreInfo.value.desc = currentType.value.more.desc;
	}
}

// 布局样式配置
const opts4Job = {
	color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
	padding: undefined,
	extra: {
		word: {
			type: "normal",
			autoColors: false
		}
	}
}
const opts4Circle = {
	color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
	padding: [5, 5, 5, 5],
	extra: {
		pie: {
			activeOpacity: 0.5,
			activeRadius: 10,
			offsetAngle: 0,
			labelWidth: 15,
			border: true,
			borderWidth: 3,
			borderColor: "#FFFFFF",
			linearType: "custom"
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	background-color: $uni-bg-color !important;
}

.queryOutput {
	background-color: $uni-bg-color;
}

text {
	color: $uni-text-color;
}

.title {
	font-size: 40rpx;
	line-height: 60rpx;
	font-weight: 600;
	padding: 10rpx 30rpx;
	position: relative;
}

.jobs {
	display: flex;
	flex-wrap: wrap;
	padding: 0 30rpx;

	view {
		font-weight: 600;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		background-color: $uni-btn-color;
		color: $uni-text-color;
	}
}

.button-show-more {
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20rpx;
	margin: 0 auto;
	background-color: $uni-bg-color;
	text, button {
		border: none;
		font-size: 30rpx;
		font-weight: 600;
		background-color: transparent;
		background-color:  $uni-btn-color;
		color: #001858;
	}
}
</style>
<style lang="scss">
.uni-card {
	background-color: $uni-bg-color !important;
	border: 1px solid $uni-text-color !important;
	margin-bottom: 0 !important;
}

.mb-10 .uni-section {
	background-color: $uni-bg-color;
}

.uni-section-header {
	box-sizing: border-box;
	height: 50rpx !important;
}

.uni-section__content-title span {
	font-weight: 600;
}

.mb-10 .uni-section__content-title {
	font-weight: 600;
}

.graph {
	padding: 0 60rpx 60rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;

	view {
		width: 30rpx;
		background-color: $uni-btn-color;
		position: relative;

		text {
			width: 100rpx;
			display: inline-block;
			position: absolute;
			bottom: 0;
			transform: translate(-25%, 100%);
		}
	}
}
</style>