<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { scanCheckAPI } from '@/apis/user'
import { Toast } from 'vant'


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
    attend_welcome_dinner: '',
    attend_gala_dinner: '',
    cloth_size: '',
    remarks:''
});
// 表单提交
function submitForm() {
  if (!form.value.attend_welcome_dinner) {
    Toast('请选择是否参加欢迎晚宴');
    return;
  }
  if (!form.value.attend_gala_dinner) {
    Toast('请选择是否参加研讨会晚宴');
    return;
  }
  if (!form.value.cloth_size) {
    Toast('请选择服装尺寸');
    return;
  }
  // if (!form.value.remarks) {
  //   Toast('请添加备注');
  //   return;
  // }

  
  
  console.log('提交的数据:', form.value);
}


</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/plan/header.jpg" class="head-img"></img>
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/plan/segmented-stepper-5.png" class="head-step"></img>
    </div>
    <!-- 表单区域 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">

        <div class="radio-welcome-container">
            <div class="label-welcome-dinner"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="是" v-model="form.attend_welcome_dinner">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">是 (Yes)</div> -->
                <div class="radio-label-yes"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="否" v-model="form.attend_welcome_dinner">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">否 (No)</div> -->
                 <div class="radio-label-no"></div>
              </label>
            </div>
        </div>

        <div class="tips-welcome-dinner"></div>

        <div class="radio-gala-container">
            <div class="label-gala-dinner"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="是" v-model="form.attend_gala_dinner">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">是 (Yes)</div> -->
                <div class="radio-label-yes"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="否" v-model="form.attend_gala_dinner">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">否 (No)</div> -->
                 <div class="radio-label-no"></div>
              </label>
            </div>
        </div>

        <div class="radio-cloth-container">
            <div class="label-cloth-size"></div>
            <div class="tips-cloth-size"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="M" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                <div class="radio-size-m"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="L" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                 <div class="radio-size-l"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="XL" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                 <div class="radio-size-xl"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="2XL" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                 <div class="radio-size-2xl"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="3XL" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                 <div class="radio-size-3xl"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="4XL" v-model="form.cloth_size">
                <span class="custom-radio"></span>
                 <div class="radio-size-4xl"></div>
              </label>
            </div>
        </div>

        <div class="form-item">
          <div class="label-remarks"></div>
          <input type="text" v-model="form.remarks" />
        </div>

        <div class="btn-container">
          <div class="arrow-left"></div>
        </div>
        <button class="submit" type="submit">
          <div class="tick"></div>
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
    max-width: 1280px;
    // height: 100vh;
    // overflow: hidden;
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
    }
    // 表单
    .form-container {
      // margin-top: .3rem;
      width: 95%;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      .form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .radio-welcome-container {
          margin-top: .3rem;
          width: 4.36rem;
          // height: .6133rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          // align-items: center;
          padding-right: .3rem;
          // background-color: pink;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 500;
          //   color: #6c727f;
          // }
          .label-welcome-dinner {
            width: 3.9rem;
            height: .4466rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/label-welcome-dinner.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .radio-group {
            // background-color: skyblue;
            margin-top: .1333rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 2.1rem;

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
              // .radio-text {
              //   color: #6c727f;
              // }
              .radio-label-yes {
                width: .6266rem;
                height: .1733rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-yes.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-label-no {
                width: .5866rem;
                height: .18rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-no.png") top center no-repeat;
                background-size: 100% 100%;
              }
            }

          }
        }

        .tips-welcome-dinner {
          margin-top: .2rem;
          width: 4.36rem;
          height: 2.5933rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/tips-welcome-dinner.png") top center no-repeat;
          background-size: 100% 100%;

        }

        .radio-gala-container {
          margin-top: .3rem;
          width: 4.36rem;
          // height: .6133rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          // align-items: center;
          padding-right: .3rem;
          // background-color: pink;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 500;
          //   color: #6c727f;
          // }
          .label-gala-dinner {
            width: 3.5266rem;
            height: .4466rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/label-gala-dinner.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .radio-group {
            // background-color: skyblue;
            margin-top: .1333rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 2.1rem;

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
              // .radio-text {
              //   color: #6c727f;
              // }
              .radio-label-yes {
                width: .6266rem;
                height: .1733rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-yes.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-label-no {
                width: .5866rem;
                height: .18rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-no.png") top center no-repeat;
                background-size: 100% 100%;
              }
            }

          }
        }

        .radio-cloth-container {
          margin-top: .3rem;
          width: 4.36rem;
          // height: .6133rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          // align-items: center;
          padding-right: .3rem;
          // background-color: pink;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 500;
          //   color: #6c727f;
          // }
          .label-cloth-size {
            width: 2.6466rem;
            height: .4466rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/label-cloth-size.png") top center no-repeat;
            background-size: 100% 100%;
          }

          .tips-cloth-size {
            margin-top: .2rem;
            width: 4.0066rem;
            height: .5533rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/tips-cloth-size.png") top center no-repeat;
            background-size: 100% 100%;

          }

          .radio-group {
            // background-color: skyblue;
            // margin-top: .1333rem;
            display: flex;
            // justify-content: space-between;
            // align-items: center;
            // width: 2.1rem;
            width: 100%;
            flex-wrap: wrap;

            .radio-item {
              position: relative;
              margin-top: .13rem;
              width: 33.33%;
              display: flex;
              // align-items: center;
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
              // .radio-text {
              //   color: #6c727f;
              // }
              .radio-size-m {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-m.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-size-l {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-l.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-size-xl {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-xl.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-size-2xl {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-2xl.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-size-3xl {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-3xl.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-size-4xl {
                width: .72rem;
                height: .3933rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/radio-size-4xl.png") top center no-repeat;
                background-size: 100% 100%;
              }
            }

          }
        }

        .form-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          .label-remarks {
            width: 1.1066rem;
            height: .1733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/plan/label-remarks.png") top center no-repeat;
            background-size: 100% 100%;
          }
          input {
              margin-top: .08rem;
              width: 4.36rem;
              height: .6133rem;
              border: .016rem solid #E0E0E0;
              border-radius: .1781rem;
              padding: .1781rem .2036rem;
          }
        }

        .btn-container {
          margin-top: .2rem;
          width: 4.36rem;
          height: .66rem;
          // background-color: pink;
          display: flex;
          
          justify-content: flex-start;
          align-items: center;
          .arrow-left {
            width: .66rem;
            height: .66rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/arrow-left.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .submit {
          margin: .3rem 0;
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
              background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/tick.png") top center no-repeat;
              background-size: 100% 100%;
          }
        }
      }
    }


}
</style>