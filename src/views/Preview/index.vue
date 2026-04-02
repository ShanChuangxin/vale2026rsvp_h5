<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getUserInfoAPI } from '@/apis/user'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'


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
  user_id: '',
  // 个人信息
  name: '',
  gender: '',
  company_name: '',
  department: '',
  job_title: '',
  email: '',
  // 行程信息-抵达
  arrival_date: '',
  arrival_transport: '',
  pickup_required: '',
  transport_number: '',
  arrival_hour: null as number | null,
  arrival_min: null as number | null,
  // 行程信息-返程
  departure_date: '',
  departure_transport: '',
  dropoff_required: '',
  departure_hour: null as number | null,
  departure_min: null as number | null,
  // 酒店信息
  checkin_date: '',
  checkout_date: '',
  // 活动行程安排
  attend_welcome_dinner: '',
  attend_gala_dinner: '',
  cloth_size: '',
  remarks: ''
})

// 页面进来直接获取用户信息
const userStore = useUserStore();
onMounted(async () => {
    if (userStore.userInfo.user_id) {
        const res = await getUserInfoAPI({user_id: userStore.userInfo.user_id})
        console.log("获取到的用户信息为：", res);
        if (res.data.errcode == 0) {
            // 先更新进本地存储
            userStore.setUserInfo(res.data.data.user_info);

            // 填充到页面里
            // 个人信息
            user.value.user_id = userStore.userInfo.user_id;
            user.value.name = userStore.userInfo.name;
            user.value.gender = userStore.userInfo.gender;
            user.value.company_name = userStore.userInfo.company_name;
            user.value.department = userStore.userInfo.department;
            user.value.job_title = userStore.userInfo.job_title;
            user.value.email = userStore.userInfo.email;
            // 行程信息-抵达
            user.value.arrival_date = userStore.userInfo.arrival_date;
            user.value.arrival_transport = userStore.userInfo.arrival_transport;
            user.value.pickup_required = userStore.userInfo.pickup_required;
            user.value.transport_number = userStore.userInfo.transport_number;
            user.value.arrival_hour = userStore.userInfo.arrival_hour;
            user.value.arrival_min = userStore.userInfo.arrival_min;
            // 行程信息-返程
            user.value.departure_date = userStore.userInfo.departure_date;
            user.value.departure_transport = userStore.userInfo.departure_transport;
            user.value.dropoff_required = userStore.userInfo.dropoff_required;
            user.value.departure_hour = userStore.userInfo.departure_hour;
            user.value.departure_min = userStore.userInfo.departure_min;
            // 酒店信息
            user.value.checkin_date = userStore.userInfo.checkin_date;
            user.value.checkout_date = userStore.userInfo.checkout_date;
            // 活动行程安排
            user.value.attend_welcome_dinner = userStore.userInfo.attend_welcome_dinner;
            user.value.attend_gala_dinner = userStore.userInfo.attend_gala_dinner;
            user.value.cloth_size = userStore.userInfo.cloth_size;
            user.value.remarks = userStore.userInfo.remarks;

        } else {
            console.log(res.data.errmsg);
            Toast("网络异常，请稍后重试");
        }
    } else {
        // Toast("请重新填写信息");
        router.push('/register');
    }
})

// 页面跳转
const router = useRouter();
// 上一步：活动行程安排页面
function toPlanPage() {
  router.push("/plan")
}

// 表单提交
function makesureInfo() {
  
  console.log('确认信息');

  // 提交服务器
  // 不需要提交服务器

  // 跳转到提交成功页面
  router.push('/success');
}

// 跳转到首页
function backHome() {
  router.push('/home')
}
</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/preview/header.jpg" class="head-img"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    <!-- 信息区域 -->
    <div class="info-container">
      <!-- 提示 -->
      <div class="tips-preview"></div>
      <!-- 个人信息预览 -->
      <div class="profile-container">
        <div class="profile-title"></div>
        <div class="info-item">
          <div class="label-name"></div>
          <div class="info-detail"> {{ user.name }} </div>
        </div>
        <div class="info-item">
          <div class="label-gender"></div>
          <div class="info-detail"> {{ user.gender }} </div>
        </div>
        <div class="info-item">
          <div class="label-company"></div>
          <div class="info-detail"> {{ user.company_name }} </div>
        </div>
        <div class="info-item">
          <div class="label-department"></div>
          <div class="info-detail"> {{ user.department }} </div>
        </div>
        <div class="info-item">
          <div class="label-job-title"></div>
          <div class="info-detail"> {{ user.job_title }} </div>
        </div>
        <div class="info-item">
          <div class="label-email"></div>
          <div class="info-detail"> {{ user.email }} </div>
        </div>
      </div>
      <!-- 行程信息-抵达 -->
      <div class="arrival-container">
        <div class="arrival-title"></div>
        <div class="info-item">
          <div class="label-arrival-date"></div>
          <div class="info-detail"> {{ user.arrival_date }} </div>
        </div>
        <div class="info-item">
          <div class="label-arrival-transport"></div>
          <div class="info-detail"> {{ user.arrival_transport }} </div>
        </div>
        <div class="info-item">
          <div class="label-pickup-required"></div>
          <div class="info-detail"> {{ user.pickup_required }} </div>
        </div>
        <div class="info-item">
          <div class="label-transport-number"></div>
          <div class="info-detail"> {{ user.transport_number }} </div>
        </div>
        <div class="info-item">
          <div class="label-arrival-time"></div>
          <div class="info-detail"> {{ user.arrival_hour }} : {{ user.arrival_min }} </div>
        </div>
      </div>
      <!-- 行程信息-返程 -->
      <div class="departure-container">
        <div class="departure-title"></div>
        <div class="info-item">
          <div class="label-departure-date"></div>
          <div class="info-detail"> {{ user.departure_date }} </div>
        </div>
        <div class="info-item">
          <div class="label-departure-transport"></div>
          <div class="info-detail"> {{ user.departure_transport }} </div>
        </div>
        <div class="info-item">
          <div class="label-dropoff-required"></div>
          <div class="info-detail"> {{ user.dropoff_required }} </div>
        </div>
        <div class="info-item">
          <div class="label-departure-time"></div>
          <div class="info-detail"> {{ user.departure_hour }} : {{ user.departure_min }} </div>
        </div>
      </div>
      <!-- 酒店信息 -->
      <div class="hotel-container">
        <div class="hotel-title"></div>
        <div class="info-item">
          <div class="label-checkin-date"></div>
          <div class="info-detail"> {{ user.checkin_date }} </div>
        </div>
        <div class="info-item">
          <div class="label-checkout-date"></div>
          <div class="info-detail"> {{ user.checkout_date }} </div>
        </div>        
      </div>
      <!-- 活动t 行程安排 -->
      <div class="plan-container">
        <div class="plan-title"></div>
        <div class="info-item">
          <div class="label-welcome-dinner-cn"></div>
          <div class="label-welcome-dinner-en"></div>
          <div class="info-detail"> {{ user.attend_welcome_dinner }} </div>
        </div>
        <div class="info-item">
          <div class="label-gala-dinner-cn"></div>
          <div class="label-gala-dinner-en"></div>
          <div class="info-detail"> {{ user.attend_gala_dinner }} </div>
        </div>
        <div class="info-item">
          <div class="label-cloth-size-cn"></div>
          <div class="label-cloth-size-en"></div>
          <div class="info-detail"> {{ user.cloth_size }} </div>
        </div>
        <div class="info-item">
          <div class="label-remarks"></div>
          <div class="info-detail"> {{ user.remarks }} </div>
        </div>
      </div>
    </div>
    <!-- 返回编辑按钮 -->
    <div class="edit-btn" @click="toPlanPage"></div>
    <!-- 保存按钮 -->
    <div class="btn-tick" @click="makesureInfo">
      <div class="tick"></div>
    </div>

  </div>
</template>


<style lang="scss" scoped>
.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    max-width: 1280px;
    // height: 100vh;
    // overflow: hidden;
    background-color: #F5F7F6;
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
    // 信息区域
    .info-container {
      width: 90%;
      margin-left: 50%;
      transform: translateX(-50%);
      .tips-preview {
        width: 4.36rem;
        height: 1.28rem;
        background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/tips-preview.png) top center no-repeat;
        background-size: 100% 100%;
      }
      // 个人信息预览 
      .profile-container {
        width: 100%;
        .profile-title {
          width: 4.36rem;
          height: .6133rem;
          background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/title-profile.png) top center no-repeat;
          background-size: 100% 100%;
        }
        .info-item {
          width: 100%;
          padding: .15rem 0; 
          border-bottom: .01333rem solid #e5e7ea;
          // background-color: skyblue;
          .info-detail {
            // background-color: pink;
            height: .3rem;
            font-size: .1867rem;
            font-weight: 400;
            color: black;
          }
          .label-name {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-name.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-gender {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-gender.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-company {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-company.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-department {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-department.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-job-title {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-job.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-email {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-email.png) top center no-repeat;
            background-size: 100% 100%;
          }

        }
      }
      // 行程信息-抵达 
      .arrival-container {
        margin-top: .18rem;
        width: 100%;
        .arrival-title {
          width: 4.36rem;
          height: .62rem;
          background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/title-arrival-info.png) top center no-repeat;
          background-size: 100% 100%;
        }
        .info-item {
          width: 100%;
          padding: .15rem 0; 
          border-bottom: .01333rem solid #e5e7ea;
          // background-color: skyblue;
          .info-detail {
            // background-color: pink;
            height: .3rem;
            font-size: .1867rem;
            font-weight: 400;
            color: black;
          }
          .label-arrival-date {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-arrival-date.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-arrival-transport {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-arrival-transport.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-pickup-required {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-pickup-required.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-transport-number {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-transport-number.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-arrival-time {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-arrival-time.png) top center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      // 行程信息-返程
      .departure-container {
        margin-top: .18rem;
        width: 100%;
        .departure-title {
          width: 4.36rem;
          height: .62rem;
          background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/title-departure-info.png) top center no-repeat;
          background-size: 100% 100%;
        }
        .info-item {
          width: 100%;
          padding: .15rem 0; 
          border-bottom: .01333rem solid #e5e7ea;
          // background-color: skyblue;
          .info-detail {
            // background-color: pink;
            height: .3rem;
            font-size: .1867rem;
            font-weight: 400;
            color: black;
          }
          .label-departure-date {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-departure-date.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-departure-transport {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-departure-transport.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-dropoff-required {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-dropoff-required.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-departure-time {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-departure-time.png) top center no-repeat;
            background-size: 100% 100%;
          }          
        }
      }
      // 酒店信息
      .hotel-container {
        margin-top: .18rem;
        width: 100%;
        .hotel-title {
          width: 4.36rem;
          height: .62rem;
          background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/title-hotel-info.png) top center no-repeat;
          background-size: 100% 100%;
        }
        .info-item {
          width: 100%;
          padding: .15rem 0; 
          border-bottom: .01333rem solid #e5e7ea;
          // background-color: skyblue;
          .info-detail {
            // background-color: pink;
            height: .3rem;
            font-size: .1867rem;
            font-weight: 400;
            color: black;
          }
          .label-checkin-date {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-checkin-date.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-checkout-date {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-checkout-date.png) top center no-repeat;
            background-size: 100% 100%;
          }       
        }
      }
      // 活动行程安排
      .plan-container {
        margin-top: .18rem;
        width: 100%;
        .plan-title {
          width: 4.36rem;
          height: .62rem;
          background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/title-plan-info.png) top center no-repeat;
          background-size: 100% 100%;
        }
        .info-item {
          width: 100%;
          padding: .15rem 0; 
          border-bottom: .01333rem solid #e5e7ea;
          // background-color: skyblue;
          .info-detail {
            // background-color: pink;
            height: .3rem;
            font-size: .1867rem;
            font-weight: 400;
            color: black;
          }
          .label-welcome-dinner-cn {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-welcome-dinner-cn.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-welcome-dinner-en {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-welcome-dinner-en.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-gala-dinner-cn {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-gala-dinner-cn.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-gala-dinner-en {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-gala-dinner-en.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-cloth-size-cn {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-cloth-size-cn.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-cloth-size-en {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-cloth-size-en.png) top center no-repeat;
            background-size: 100% 100%;
          }
          .label-remarks {
            width: 4.36rem;
            height: .2666rem;
            background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/label-remarks.png) top center no-repeat;
            background-size: 100% 100%;
          }          
        }
      }
    }
    // 返回编辑按钮
    .edit-btn {
      margin-top: .18rem;
      width: 1.94rem;
      height: .6666rem;
      background: url(https://www.1024.art/projects/static/vale2026rsvp/images/preview/btn-edit.png) top center no-repeat;
      background-size: 100% 100%;
    }
    // 确认按钮
    .btn-tick {
      margin: .3rem 0 .5rem 50%;
      transform: translateX(-50%);
      width: 4.36rem;
      height: .72rem;
      border: 0;
      border-radius: .1781rem;
      background-color: #007E7A;
      display: flex;
      justify-content: center;
      align-items: center;
      .tick {
          width: .68rem;
          height: .68rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/preview/tick.png") top center no-repeat;
          background-size: 100% 100%;
      }
    }
    


}
</style>