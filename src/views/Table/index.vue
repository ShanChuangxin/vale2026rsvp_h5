<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { getUserInfoAPI } from '@/apis/user';
import { useUserStore } from '@/stores/user';


// 监测手机宽高比进行提醒
onMounted(() => {
  if (window.innerWidth > window.innerHeight) {
    Toast({
      message: "请在手机或者竖屏下使用",
      duration: 3000
    })
  }
});

// 加载用户信息
const userStore = useUserStore();
onMounted(async () => {
    if (userStore.userInfo.user_id) {
        const res = await getUserInfoAPI({user_id: userStore.userInfo.user_id})
        console.log("获取到的用户信息为：", res);
        if (res.data.errcode == 0) {
            // 先更新进本地存储
            userStore.setUserInfo(res.data.data.user_info);
            // 更新桌号
            tableNum.value = userStore.userInfo.table_num;
            calPostion(); // 更新页面显示内容
            if (!tableNum.value) {
              Toast("桌号还未分配\nTable number not yet assigned, please check back shortly.");
            }
        } else {
            console.log(res.data.errmsg);
            Toast("网络异常，请稍后重试");
        }
    } else {
        // Toast("请重新填写信息");
        router.replace('/register');
    }
})

// 座位定义
const tableNum = ref(0);  // 座位号
const tablePosition = ref('back'); // front为前，left为左，right为右，back为后
// 根据座位号计算区域
function calPostion() {
  // 定义座位所在区域
  const frontArea = [1, 2, 3];
  const backArea = [5, 6, 7, 8, 9, 10, 11, 33, 35, 36, 37, 38];
  const leftArea = [12, 15, 16, 20, 21, 22, 27, 28, 29, 39, 40];
  const rightArea = [17, 18, 19, 23, 25, 26, 30, 31, 32, 42, 43]
  // 计算座位区域
  if (frontArea.includes(tableNum.value)) {  // 前排
    tablePosition.value = "front";
  } else if (backArea.includes(tableNum.value)) { // 后排
    tablePosition.value = "back";
  } else if (leftArea.includes(tableNum.value)) {  // 左排
    tablePosition.value = "left";
  } else if (rightArea.includes(tableNum.value)) {  // 右排
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
function backHome() {
  router.replace('/home')
}


</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/table/header.jpg" class="head-img"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    
    <!-- 桌号显示 -->
    <div class="table-num-container">
      <div class="table-num-title"></div>
      <div class="num-container">
        <div class="table-num">{{ tableNum }}</div>
      </div>
    </div>

    <!-- 位置提示 -->
    <div class="table-tips">
      <div v-if="tablePosition=='left'" class="tips-left"></div>
      <div v-if="tablePosition=='right'" class="tips-right"></div>
      <div v-if="tablePosition=='front'" class="tips-front"></div>
      <div v-if="tablePosition=='back'" class="tips-back"></div>
    </div>

    <!-- 座位区域 -->
    <div class="table-position">
      <div v-if="tablePosition=='left'" class="position-left"></div>
      <div v-if="tablePosition=='right'" class="position-right"></div>
      <div v-if="tablePosition=='front'" class="position-front"></div>
      <div v-if="tablePosition=='back'" class="position-back"></div>
    </div>
                    
    <!-- 返回主页按钮 -->
    <!-- <div class="home-btn" :class="{press: isBtnPressed}" @touchstart="onBtnTouchStart" @touchend="onBtnTouchEnd" @click="backHome"></div> -->
    <div class="home-btn" @click="backHome"></div>


  </div>
</template>


<style lang="scss" scoped>
.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    // height: 100vh;
    max-width: 1280px;
    // height: 100vh;
    // overflow: hidden;
    background-color: white;
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
    // 桌号显示
    .table-num-container {
      position: relative;
      margin-top: .4rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 88%;
      // background-color: pink;
      .table-num-title {
        width: 4.36rem;
        height: .5666rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/table-title.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .num-container {
        position: absolute;
        top: -.15rem;
        left : 1.5rem;
        width: 2.0266rem;
        height: .7733rem;
        border: .0266rem solid #E0E0E0;
        border-radius: .1781rem;
        box-shadow: 0 0 .1333rem rgba(0,0,0,.05);
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        .table-num {
          color: #E8A713;
          font-weight: 500;
          font-size: .48rem;

        }
      }
    }
    // 位置提示
    .table-tips {
      margin-top: .7rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 90%;
      height: 2.5rem;
      // background-color: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      .tips-left {
        width: 1.88rem;
        height: 2.4266rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/tips-left.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .tips-right {
        width: 1.7466rem;
        height: 2.4rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/tips-right.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .tips-front {
        width: 2.08rem;
        height: .7733rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/tips-front.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .tips-back {
        width: 3.2666rem;
        height: 2.4rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/tips-back.png") top center no-repeat;
        background-size: 100% 100%;
      }
    }
    // 座位区域
    .table-position {
      margin-top: .7rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 2.5rem;
      // background-color: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      .position-left {
        width: 4.7066rem;
        height: 2.8666rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/position-left.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .position-right {
        width: 4.7066rem;
        height: 2.8666rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/position-right.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .position-front {
        width: 4.7066rem;
        height: 2.8666rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/position-front.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .position-back {
        width: 4.7066rem;
        height: 2.8666rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/position-back.png") top center no-repeat;
        background-size: 100% 100%;
      }
    }
    // 返回主页按钮
    .home-btn {
      margin-top: .7rem;
      margin-bottom: .7rem;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/home-default.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .home-btn.press {
      width: 4.36rem;
      height: .72rem;;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/table/home-pressed.png") top center no-repeat;
      background-size: 100% 100%;
    }


 
    


}
</style>