<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { scanCheckAPI } from '@/apis/user'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'


// 监测手机宽高比进行提醒
onMounted(() => {
  if (window.innerWidth > window.innerHeight) {
    Toast({
      message: "请在手机或者竖屏下使用",
      duration: 3000
    })
  }
});



// 按钮事件
const isBtnPressed = ref(false);
// yes按钮按下的事件
function onBtnTouchStart() {
    isBtnPressed.value = true;
    console.log("按钮按下");
}
// yes按钮松开的事件
function onBtnTouchEnd() {
    isBtnPressed.value = false;
    console.log("按钮松开");
}
// 跳转到首页
const router = useRouter();
// 返回主页
function backHome() {
  router.push('/home')
}


</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/agenda/header.jpg" class="head-img"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    
    <div class="agenda-body">
      <div class="agenda-title"></div>
      <div class="date-5-13"></div>
      <div class="date-5-14"></div>
      <div class="date-5-15"></div>
    </div>

    
                    
    <!-- 返回主页按钮 -->
    <div class="home-btn" :class="{press: isBtnPressed}" @touchstart="onBtnTouchStart" @touchend="onBtnTouchEnd" @click="backHome"></div>


  </div>
</template>


<style lang="scss" scoped>
.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    height: 100vh;
    max-width: 1280px;
    // height: 100vh;
    // overflow: hidden;
    // background-color: #F5F7F6;
    // 顶部区域
    .head-container {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .head-img{
        width: 100%;
      }
      .back-home {
        position: absolute;
        top: .26rem;
        right: .26rem;
        width: .84rem;
        height: .4rem;
        // background-color: pink;
      }
    }

    // 温馨提示体
    .agenda-body {
      margin-top: .4rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 88%;
      // background-color: pink;
      // 标题
      .agenda-title {
        width: 4.36rem;
        height: .5533rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/title.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .date-5-13 {
        margin-top: .4rem;
        width: 4.36rem;
        height: 6.76rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/5-13.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .date-5-14 {
        margin-top: .4rem;
        width: 4.36rem;
        height: 11.56rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/5-14.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .date-5-15 {
        margin-top: .4rem;
        width: 4.36rem;
        height: 8.92rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/5-15.png") top center no-repeat;
        background-size: 100% 100%;
      }
      
    }
 
    // 返回主页按钮
    .home-btn {
      margin-top: .7rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/home-default.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .home-btn.press {
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/home-pressed.png") top center no-repeat;
      background-size: 100% 100%;
    }

}
</style>