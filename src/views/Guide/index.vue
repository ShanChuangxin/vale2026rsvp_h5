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
function backHome() {
  router.push('/home')
}

// 表单提交
function backToIndex() {
  // undo
  
  console.log('返回主页');
}

</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/guide/header.jpg" class="head-img"></img>
    </div>
    
    <div class="guide-body">
      <div class="guide-title"></div>
      <div class="content"></div>
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
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .head-img{
        width: 100%;
      }
    }

    // 温馨提示体
    .guide-body {
      margin-top: .4rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
      // background-color: pink;
      // 标题
      .guide-title {
        margin-left: .4rem;
        width: 4.36rem;
        height: .5533rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/guide/title.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .content {
        margin-top: .4rem;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 5rem;
        height: 14.0933rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/guide/content.png") top center no-repeat;
        background-size: 100% 100%;
      }
       
    }
 
    // 返回主页按钮
    .home-btn {
      margin-top: .7rem;
      // margin-bottom: .7rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/home-default.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .home-btn.press {
      // margin-top: .7rem;
      // margin-bottom: .7rem;
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/agenda/home-pressed.png") top center no-repeat;
      background-size: 100% 100%;
    }

}
</style>