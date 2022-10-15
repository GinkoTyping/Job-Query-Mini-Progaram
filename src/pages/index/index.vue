<template>
  <view class="content"
    :style="{ height: windowGeo.windowHeight }">
    <img class="bg-img" src="@/static/homepage.jpg"/>
    <view
      class="animate__animated animate__fadeInDown"
      style="display: flex; flex-direction: column; justify-content: center">
			<open-data class="logo" style="border-radius: 50%;" type="userAvatarUrl"></open-data>
			<view class="user-name" style="text-align: center" >
				<text>welcome! </text>
				<open-data type="userNickName"></open-data>
			</view>
    </view>
    <view
      class="text-area animate__animated animate__fadeInUp">
      <button class="btn"
        @click="handleClick">开始测试</button>
    </view>

		<!-- 提示窗示例 -->
		<uni-transition ref="ani" custom-class="transition" :mode-class="['fade', 'zoom-in']" :show="isShowDialog">
			<view class="popover">
				<text class="title">提示</text>
				<text>检测到未完成的测试记录，是否继续测试？</text>
				<view class="footer">
					<text @click="push2Query('reset')">重新测试</text>
					<text @click="push2Query('continue')">继续上次测试</text>
				</view>
			</view>
		</uni-transition>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { onShareAppMessage } from "@/utils/useShare"
const store = useStore();

const windowGeo = computed(() => store.getters.deviceGeo);

const isShowDialog = ref(false);
const hasRecords = computed(() => store.state.records.length > 0);
const handleClick = () => {
	if (hasRecords.value){
		isShowDialog.value = true;
	} else {
		uni.navigateTo({ url: '../queryOptions/queryOptions?isReset=reset' });
	}
}
const push2Query = isReset => {
	isShowDialog.value = false;
  uni.navigateTo({ url: `../queryOptions/queryOptions?isReset=${isReset}` });
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
	height: 300rpx;
	box-sizing: border-box;
	transform: translate(-50%, -50%);
	background-color:$uni-color-primary;
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
		text {
			width: 50%;
			line-height: 70rpx;
			&:nth-child(2) {
				position: relative;
				background-color: $uni-color-error;
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
		
	}
}
</style>
