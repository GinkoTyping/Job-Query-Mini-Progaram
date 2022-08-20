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
        @click="push2Query">开始测试</button>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { onShareAppMessage } from "@/utils/useShare"
const store = useStore();

const windowGeo = computed(() => store.getters.deviceGeo);
onMounted(() => { });
const push2Query = () => {
  uni.navigateTo({ url: "../queryOptions/queryOptions" });
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
</style>
