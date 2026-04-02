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

// 用户信息
const user = ref({
  // 个人信息
  name: 'David Wang',
  gender: '男 / Male',
  company_name: '淡水河谷中国',
  department: '技术服务部',
  job_title: '高级工程师',
  email: 'david@example.com',
  // 行程信息-抵达
  arrival_date: '2026/05/13',
  arrival_transport: '航班/Flight',
  pickup_required: '是/Yes',
  transport_number: 'MU1234',
  arrival_hour: '12',
  arrival_min: '30',
  // 行程信息-返程
  departure_date: '2026/05/15',
  departure_transport: '大理站 / Dali Railway Station',
  dropoff_required: '是/Yes',
  departure_hour: '14',
  departure_min: '00',
  // 酒店信息
  checkin_date: '2026/05/13',
  checkout_date: '2026/05/15',
  // 活动行程安排
  attend_welcome_dinner: '是 / Yes',
  attend_gala_dinner: '否 / No',
  cloth_size: 'M(50-60kg)',
  remarks: 'xxx'
})


// 页面跳转
const router = useRouter();
// 返回主页
function backHome() {
  router.replace('/home')
  
  console.log('返回主页');
}

</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/success/header.jpg" class="head-img"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    
    <!-- 提交成功提示 -->
    <div class="tips-submit-success"></div>

    <!-- 返回主页按钮 -->
    <div class="btn-home" @click="backHome">
      <div class="home"></div>
    </div>

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

    .tips-submit-success {
      margin-left: 50%;
      transform: translateX(-50%);
      width: 5rem;
      height: 7.0133rem;
      background: url("https://www.1024.art/projects/static/vale2026rsvp/images/success/tips-submit-success.png") top center no-repeat;
      background-size: 100% 100%;
    }

    // 返回主页按钮
    .btn-home {
      margin: .5rem 0 .5rem 50%;
      transform: translateX(-50%);
      width: 4.36rem;
      height: .72rem;
      border: 0;
      border-radius: .1781rem;
      background-color: #007E7A;
      display: flex;
      justify-content: center;
      align-items: center;
      .home {
          width: .4133rem;
          height: .34rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/success/btn-home.png") top center no-repeat;
          background-size: 100% 100%;
      }
    }
    


}
</style>