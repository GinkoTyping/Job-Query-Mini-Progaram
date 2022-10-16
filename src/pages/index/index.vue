<template>
	<view class="content" :style="{ height: windowGeo.windowHeight }">
		<img class="bg-img" src="@/static/homepage.jpg" />
		<view class="animate__animated animate__fadeInDown"
			style="display: flex; flex-direction: column; justify-content: center">
			<img class="logo" src="@/static/homebg.jpg" style="border-radius: 50%;" />
			<view class="user-name" style="text-align: center">
				<text>Welcome!</text>
			</view>
		</view>
		<view class="text-area animate__animated animate__fadeInUp">
			<button class="btn" @click="handleClick">开始测试</button>
		</view>

		<!-- 提示窗示例 -->
		<uni-transition ref="ani" custom-class="transition" :mode-class="['fade', 'zoom-in']" :show="isShowDialog">
			<view class="popover" :style="{height: dialogConfig.height}">
				<text class="title">提示</text>
				<text>{{dialogConfig.desc}}</text>
				<view class="footer">
					<text @click="push2Query('left')">{{dialogConfig.buttons.left}}</text>
					<text v-if="currentStatus === 'reset'" @click="push2Query('right')">{{dialogConfig.buttons.right}}</text>
					<ad-interstitial v-else style="width: 50%; border: none;" adpid="1238214729" :loadnext="true"
						v-slot:default="{loading}" @close="push2Query('right')">
						<button :disabled="loading" :loading="loading">{{dialogConfig.buttons.right}}</button>
					</ad-interstitial>
				</view>
			</view>
		</uni-transition>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { onShareAppMessage } from "@/utils/useShare";
const store = useStore();

const windowGeo = computed(() => store.getters.deviceGeo);

const isShowDialog = ref(false);
const currentStatus = ref('reset');
const currentFormKind = computed(() => store.state.formKind);

const dialogConfig = computed(() => {
	if (currentStatus.value === 'reset') {
		return {
			desc: "请选择测试类型!",
			height: '250rpx',
			buttons: {
				left: "精准版(60题)",
				right: "精简版(20题)",
			}
		}
	}
	return {
		desc: "检测到未完成的测试记录，是否继续测试？",
		height: '300rpx',
		buttons: {
			left: "重新测试",
			right: `继续上次(${hasRecords.value}/${currentFormKind.value})`,
		}
	}
})
const hasRecords = computed(() => store.state.records.length);
const handleClick = () => {
	isShowDialog.value = true;
	if (hasRecords.value) {
		currentStatus.value = 'continue';
	}
}
const push2Query = position => {
	if (currentStatus.value === 'continue') {
		const isReset = position === 'left' ? 'reset' : 'continue';
		if (position === 'left') {
			currentStatus.value = 'reset';
			return;
		}
		isShowDialog.value = false;
		uni.navigateTo({ url: `../queryOptions/queryOptions?isReset=${isReset}_${currentFormKind.value}` });
	} else {
		const kind = position === 'left' ? '60' : '20';
		store.commit('setFormKind', kind);
		isShowDialog.value = false;
		uni.navigateTo({ url: `../queryOptions/queryOptions?isReset=reset_${kind}` });
	}
};
</script>

<style lang="scss" scoped>
@keyframes scrollToUp {
	0% {
		top: 0;
	}

	100% {
		top: -100%;
	}
}

::v-deep .transition {
	position: fixed;
	width: 70%;
	left: 50%;
	top: 50%;
}

.content {
	overflow-y: hidden;
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
	display: flex;
	flex-direction: column;
	align-items: space-bettwen;
	justify-content: space-between;

	.bg-img {
		position: absolute;
		background-repeat: repeat;
		width: 100%;
		height: 200%;
		top: 0;
		z-index: -1;
		animation: scrollToUp 10s linear 1s infinite;
	}

	.user-name {
		display: inline;
		color: $uni-text-color;
		background-color: $uni-bg-color-main;
		margin: 0 auto;
		padding: 5rpx 20rpx;
		border-radius: 10rpx;
	}
}

.logo {
	overflow: hidden;
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 10rpx;
	border-radius: 50%;
}

.text-area {
	display: flex;
	justify-content: center;
	margin-bottom: 300rpx;
}

.btn {
	background-color: $uni-btn-color !important;
	color: $uni-text-color;
	font-weight: 600;
}

.popover {
	box-sizing: border-box;
	transform: translate(-50%, -50%);
	background-color: $uni-color-primary;
	border-radius: 30rpx;
	padding: 0 20rpx;
	color: $uni-text-color;

	text {
		display: block;
		text-align: center;
	}

	.title {
		font-size: 16px;
		line-height: 80rpx;
		font-weight: 600;
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 70rpx;
		display: flex;
		left: 0rpx;
		justify-content: space-between;

		&::before {
			position: absolute;
			content: '';
			width: 100%;
			height: 1rpx;
			left: 0rpx;
			top: -1rpx;
			border-top: 1rpx black solid;
		}

		text,
		button {
			margin: 0;
			padding: 0;
			width: 50%;
			height: 70rpx;
			line-height: 70rpx;

			&:nth-child(2) {
				position: relative;
				background-color: $uni-color-error;
				border-bottom-right-radius: 30rpx;

				&::after {
					position: absolute;
					content: '';
					width: 1rpx;
					height: 70rpx;
					border-left: 1rpx black solid;
					left: 0;
					top: 0;
				}
			}
		}

		button {
			border: none;
			width: 100%;
			border-radius: 0;
			border-bottom-right-radius: 30rpx;
			background-color: $uni-btn-color;
			font-size: 32rpx;
		}

	}
}
</style>
