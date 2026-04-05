<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateProfileAPI } from '@/apis/user'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/user";

// 监测手机宽高比进行提醒
onMounted(() => {
  if (window.innerWidth > window.innerHeight) {
    Toast({
      message: "请在手机或者竖屏下使用",
      duration: 3000
    })
  }
});


// 表单信息
const form = ref({
    user_id: '',
    name: '',
    gender: '',
    company_name: '',
    department: '',
    job_title: '',
    email: '',
});

// 同步显示已填充信息
const userStore = useUserStore();
// 自动填充信息
onMounted(() => {
  form.value.company_name = userStore.getUserInfo()?.company_name;
  form.value.user_id = userStore.userInfo.user_id;
  form.value.name = userStore.userInfo.name;
  form.value.gender = userStore.userInfo.gender;
  form.value.company_name = userStore.userInfo.company_name;
  form.value.department = userStore.userInfo.department;
  form.value.job_title = userStore.userInfo.job_title;
  form.value.email = userStore.userInfo.email;
})


// 页面跳转
const router = useRouter();

// 表单提交
async function submitForm() {
  if (!form.value.name) {
    // Toast('请输入姓名');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    // Toast({
    //     message: "抵达方式建议您于4月29日前提供 \n It is recommended that you provide the arrival details by April 29th.",
    //     duration: 2000
    // })
    return;
  }
  if (!form.value.gender) {
    // Toast('请选择性别');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }
  if (!form.value.company_name) {
    // Toast('请输入公司名称');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }
  if (!form.value.department) {
    // Toast('请输入部门');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }
  if (!form.value.job_title) {
    // Toast('请输入职位');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }

  // 校验邮箱的正则表达式
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(form.value.email && !reg.test(form.value.email)) {
    Toast('邮箱格式有误');
    return;
  }
  
  console.log('提交的数据:', form.value);


  // 提交服务器
  const res = await updateProfileAPI(form.value)
  console.log("更新结果: ", res);
  if (res.data.errcode == 0) {
    // 先更新进本地存储
    userStore.setUserInfo(res.data.data.user_info);
    console.log("更新成功，跳转到抵达页面填写");
    // 跳转到行程信息-抵达页面
    router.replace('/arrival');
  } else {
    console.log(res.data.errmsg);
    Toast("网络异常，请稍后重试");
  }
}

// 跳转到首页
function backHome() {
  router.replace('/home')
}

</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/profile/header.jpg" class="head-img"></img>
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/profile/segmented-stepper-1.png" class="head-step"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    <!-- 表单区域 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="form-item">
            <!-- <label>参会人姓名 * Full Name</label> -->
            <div class="label-full-name"></div>
            <input type="text" v-model="form.name" placeholder="请输入姓名" />
        </div>
        <div class="radio-container">
            <!-- <label>性别 * Gender</label> -->
            <div class="label-gender"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="男 / Male" v-model="form.gender">
                <span class="custom-radio"></span>
                <div class="radio-label-male"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="女 / Female" v-model="form.gender">
                <span class="custom-radio"></span>
                <div class="radio-label-female"></div>
              </label>
            </div>
        </div>
        <div class="form-item">
            <!-- <label>公司/机构全称 * Company Name</label> -->
            <div class="label-company-name"></div>
            <input type="text" v-model="form.company_name" placeholder="请输入公司名称" />
        </div>
        <div class="form-item">
            <!-- <label>部门 * Department</label> -->
            <div class="label-department"></div>
            <input type="text" v-model="form.department" placeholder="请输入部门" />
        </div>
        <div class="form-item">
            <!-- <label>职位 * Job Title</label> -->
            <div class="label-job-title"></div>
            <input type="text" v-model="form.job_title" placeholder="请输入职位" />
        </div>
        <div class="form-item">
            <!-- <label>邮箱 Email</label> -->
            <div class="label-email"></div>
            <input type="text" v-model="form.email" placeholder="请输入邮箱" />
        </div>
        <button class="submit" type="submit">
            <div class="arrow-right"></div>
            <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/tick.png" alt=""> -->
        </button>

      </form>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    // height: 100vh;
    overflow: hidden;
    background-color: #F5F7F6;
     // 顶部
    .head-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .head-img{
        width: 100%;
      }
      .head-step {
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
    // 表单
    .form-container {
      margin-top: .3rem;
      width: 90%;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      .form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .form-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-full-name {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-full-name.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .label-company-name {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-company-name.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .label-department {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-department.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .label-job-title {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-job-title.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .label-email {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-email.png") top center no-repeat;
            background-size: 100% 100%;
          }
          input {
              margin-top: .08rem;
              width: 4.36rem;
              height: .6133rem;
              border: .016rem solid #E0E0E0;
              border-radius: .1781rem;
              padding: .1781rem .2036rem;
              color: #1A1A1A80;
          }
        }
        .radio-container {
          margin-top: .2rem;
          width: 4.36rem;
          height: .6133rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: .3rem;
          // background-color: pink;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-gender {
            width: 1.1333rem;
            height: .2466rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-gender.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .radio-group {
            // background-color: skyblue;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 2.6rem;

            .radio-item {
              display: flex;
              align-items: center;
              // 隐藏原生radio
              input {
                display: none;
              }
              // 自定义圆圈
              .custom-radio {
                margin-right: .1rem;
                width: .24rem;
                height: .24rem;
                border: .0267rem solid #ccc;
                border-radius: 50%;
                position: relative;
                transition: all 0.2s;
              }
              // 选中时变橘色
              input:checked + .custom-radio {
                border-color: #E8A713;
              }
              // 中间小圆点
              input:checked + .custom-radio::after {
                content: '';
                width: .1333rem;
                height: .1333rem;
                background: #E8A713;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              // 文本
              .radio-label-male {
                width: .7533rem;
                height: .18rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-male.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-label-female {
                width: .8933rem;
                height: .18rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/label-female.png") top center no-repeat;
                background-size: 100% 100%;
              }
            }

          }
        }
        .submit {
          margin-top: .5rem;
          margin-left: auto;  // 把元素推到最右边
          margin-bottom: .5rem;
          float:right;
          width: .8rem;
          height: .66rem;
          border: 0;
          background-color: rgba(0,0,0,0);
          .arrow-right {
            width: .66rem;
            height: .66rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/profile/arrow-right.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }


      }
    }

}
</style>