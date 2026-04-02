<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

// 座位定义
const tableNum = ref(20);  // 座位号
const tablePosition = ref('back'); // front为前，left为左，right为右，back为后
// 根据座位号计算区域
function calPostion() {
  if (tableNum.value <= 3) {  // 前排
    tablePosition.value = "front";
  } else if (tableNum.value <= 18) { // 后排
    tablePosition.value = "back";
  } else if (tableNum.value <= 31) {  // 左排
    tablePosition.value = "left";
  } else if (tableNum.value <= 45) {  // 右排
    tablePosition.value = "right"  
  } else {
    console.log("座位号错误");
  }
}
onMounted(() => {
  calPostion();
})

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
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/tips/header.jpg" class="head-img"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    
    <div class="tips-body">
      <div class="tips-title"></div>
      <div class="tel"></div>
      <div class="tel-tips"></div>
      <div class="hospital"></div>

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
    .tips-body {
      margin-top: .4rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 88%;
      // background-color: pink;
      // 标题
      .tips-title {
        width: 4.36rem;
        height: .5533rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/title.png") top center no-repeat;
        background-size: 100% 100%;
      }
      // 电话
      .tel {
        margin-top: .5rem;
        width: 4.36rem;
        height: 1.16rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/tel.png") top center no-repeat;
        background-size: 100% 100%;
      }
      // 电话提示
      .tel-tips {
        margin-top: .2rem;
        width: 4.3133rem;
        height: 1.1066rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/tel-tips.png") top center no-repeat;
        background-size: 100% 100%;
      }
      // 医院
      .hospital {
        margin-top: .2rem;
        width: 4.36rem;
        height: 1.7066rem;;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/hospital.png") top center no-repeat;
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
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/home-default.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .home-btn.press {
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/tips/home-pressed.png") top center no-repeat;
      background-size: 100% 100%;
    }


 
    


}
</style>