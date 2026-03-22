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


// 下拉框相关
// 日期
const showCheckinDropdown = ref(false);
const checkinDateSelected = ref('');
const checkinDateOptions = [
  { label: '2026/05/13', value: '2026/05/13'},
  { label: '2026/05/14', value: '2026/05/14'},
  { label: '2026/05/15', value: '2026/05/15'}
];
function checkinDateSelectOption(item: any) {
  checkinDateSelected.value = item.value;
  form.value.checkin_date = item.value;
  showCheckinDropdown.value = false;
}
// 行程
const showCheckoutDropdown = ref(false);
const checkoutSelected = ref('');
const checkoutOptions = [
  { label: '2026/05/13', value: '2026/05/13'},
  { label: '2026/05/14', value: '2026/05/14'},
  { label: '2026/05/15', value: '2026/05/15'}
];
function checkoutSelectOption(item: any) {
  // 1. 赋值
  checkoutSelected.value = item.value;
  form.value.checkout_date = item.value;
  showCheckoutDropdown.value = false;
}

// 点击外部关闭下拉框
function handleClickOutside(e: MouseEvent) {
  const elCheckin = document.querySelector('.date-select-box')
  if (elCheckin && !elCheckin.contains(e.target as Node)) {
    showCheckinDropdown.value = false;
  }
  const elCheckout = document.querySelector('.checkout-select-box')
  if (elCheckout && !elCheckout.contains(e.target as Node)) {
    showCheckoutDropdown.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})

// 表单信息
const form = ref({
    checkin_date: '',
    checkout_date: '',
});
// 表单提交
function submitForm() {
  if (!form.value.checkin_date) {
    Toast('请选择酒店入住日期');
    return;
  }
  if (!form.value.checkout_date) {
    Toast('请选择酒店退房日期');
    return;
  }
  
  console.log('提交的数据:', form.value);
}


</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/hotel/header.jpg" class="head-img"></img>
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/hotel/segmented-stepper-4.png" class="head-step"></img>
    </div>
    <!-- 表单区域 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="checkin-select-item">
            <!-- <label>抵达日期 * Departure Date</label> -->
            <div class="label-checkin-date"></div>
            <div class="date-select-box">
              <!-- 按钮 -->
              <div class="date-select-btn" @click="showCheckinDropdown = !showCheckinDropdown">
                <span>{{ checkinDateSelected ||  '请选择入住日期'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/hotel/select-btn.png" class="arrow" :class="{ rotate: showCheckinDropdown }" />
              </div>
              <!-- 下拉框 -->
              <div class="date-dropdown" v-if="showCheckinDropdown">
                <div 
                  v-for="item in checkinDateOptions"
                  :key="item.value"
                  class="dropdown-item"
                  @click="checkinDateSelectOption(item)"
                >
                {{ item.label }}
              </div>
              </div>
            </div>
        </div>

        <div class="checkout-select-item">
            <!-- <label>抵达方式 * Departure Transport</label> -->
            <div class="label-checkout"></div>
            <div class="checkout-select-box">
              <!-- 按钮 -->
              <div class="checkout-select-btn" @click="showCheckoutDropdown = !showCheckoutDropdown">
                <span>{{ checkoutSelected ||  '请选择退房日期'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/select-btn.png" class="arrow" :class="{ rotate: showCheckoutDropdown }" />
              </div>
              <!-- 下拉框 -->
              <div class="checkout-dropdown" v-if="showCheckoutDropdown">
                <div 
                  v-for="item in checkoutOptions"
                  :key="item.value"
                  class="checkout-dropdown-item"
                  @click="checkoutSelectOption(item)"
                >
                {{ item.label }}
              </div>
              </div>
            </div>
        </div>

        <div class="tips-hotel"></div>

        <div class="btn-container">
          <div class="arrow-left"></div>
          <button class="submit" type="submit">
              <div class="arrow-right"></div>
              <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/tick.png" alt=""> -->
          </button>
        </div>

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
    height: 100vh;
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
    }
    // 表单
    .form-container {
      margin-top: .3rem;
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
        .checkin-select-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-checkin-date {
            width: 4.3733rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/hotel/label-checkin.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .date-select-box {
            margin-top: .08rem;
            position: relative;
            width: 4.36rem;
            .date-select-btn {
              height: .6133rem;
              border: .0133rem solid #E0E0E0;
              border-radius: .1781rem;
              background: white;
              padding: 0.005rem 0.05rem 0 0.2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              .arrow {
                width: .5133rem;
                height: .5133rem;
                transition: 0.3s;
              }
              .arrow.rotate {
                transform: rotate(180deg);
              }
            }
            .date-dropdown {
              position: absolute;
              top: calc(100% + .00rem);  // 间距
              left: 0;
              width: 100%;
              background: #f9f9f9;  // 和按钮不同颜色
              border-radius: .1781rem;
              border: .0133rem solid #ddd;
              
              box-shadow: 0 .0533rem .1333rem rgba(0, 0, 0, 0.1);
              overflow: hidden;
              z-index: 10;
              .dropdown-item {
                border-bottom: .0133rem solid #ddd;
                padding: .15rem .2rem;
                cursor: pointer;
              }
              .dropdown-item:hover {
                background: #eee;
              }
            }
          }
        }
        .checkout-select-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-checkout {
            width: 4.3733rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/hotel/label-checkout.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .checkout-select-box {
            margin-top: .08rem;
            position: relative;
            width: 4.36rem;
            .checkout-select-btn {
              height: .6133rem;
              border: .0133rem solid #E0E0E0;
              border-radius: .1781rem;
              background: white;
              padding: 0.005rem 0.05rem 0 0.2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              .arrow {
                width: .5133rem;
                height: .5133rem;
                transition: 0.3s;
              }
              .arrow.rotate {
                transform: rotate(180deg);
              }
            }
            .checkout-dropdown {
              position: absolute;
              top: calc(100% + .00rem);  // 间距
              left: 0;
              width: 100%;
              background: #f9f9f9;  // 和按钮不同颜色
              border-radius: .1781rem;
              border: .0133rem solid #ddd;
              
              box-shadow: 0 .0533rem .1333rem rgba(0, 0, 0, 0.1);
              overflow: hidden;
              z-index: 10;
              .checkout-dropdown-item {
                border-bottom: .0133rem solid #ddd;
                padding: .15rem .2rem;
                cursor: pointer;
              }
              .checkout-dropdown-item:hover {
                background: #eee;
              }
            }
          }
        }
        
        .tips-hotel {
          margin-top: .2rem;
          width: 4.3266rem;
          height: 2.0066rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/hotel/tips-hotel.png") top center no-repeat;
          background-size: 100% 100%;
        }

        .btn-container {
          margin-top: .5rem;
          width: 4.36rem;
          height: .66rem;
          // background-color: pink;
          display: flex;
          
          justify-content: center;
          align-items: center;
          .arrow-left {
            width: .66rem;
            height: .66rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/hotel/arrow-left.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .submit {
            margin-left: auto;  // 把元素推到最右边
            float:right;
            width: .66rem;
            height: .66rem;
            border: 0;
            background-color: rgba(0,0,0,0);
            .arrow-right {
              width: .66rem;
              height: .66rem;
              background: url("https://www.1024.art/projects/static/vale2026rsvp/images/hotel/arrow-right.png") top center no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }


}
</style>