<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/user";
import { updateArrivalAPI } from '@/apis/user';


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
const showDateDropdown = ref(false);
const dateSelected = ref('');
const dateOptions = [
  { label: '2026/05/13', value: '2026/05/13'},
  { label: '2026/05/14', value: '2026/05/14'}
];
function dateSelectOption(item: any) {
  dateSelected.value = item.value;
  form.value.arrival_date = item.value;
  showDateDropdown.value = false;
}
// 行程
const showArrivalDropdown = ref(false);
const arrivalSelected = ref('');
const arrivalOptions = [
  { label: '大理凤仪机场', value: '大理凤仪机场'},
  { label: '大理站', value: '大理站'},
  { label: '自驾或其他', value: '自驾或其他'},
  { label: '稍后提供', value: '稍后提供'},
];
function arrivalSelectOption(item: any) {
  // 1. 赋值
  arrivalSelected.value = item.value;
  form.value.arrival_transport = item.value;
  showArrivalDropdown.value = false;
  // 2. 如果是稍后提供，则进行弹窗
  if (item.value == '稍后提供') {
    Toast({
        message: "抵达方式建议您于4月29日前提供 \n It is recommended that you provide the arrival details by April 29th.",
        duration: 2000
    })
  }
}
// 到达时间-小时
// const showHourDropdown = ref(false);
// const hourSelected = ref('');
// const hourOptions = [
//   { label: '0', value: '0'},
//   { label: '1', value: '1'},
//   { label: '2', value: '2'},
//   { label: '3', value: '3'},
//   { label: '4', value: '4'},
//   { label: '5', value: '5'},
//   { label: '6', value: '6'},
//   { label: '7', value: '7'},
//   { label: '8', value: '8'},
//   { label: '9', value: '9'},
//   { label: '10', value: '10'},
//   { label: '11', value: '11'},
//   { label: '12', value: '12'},
//   { label: '13', value: '13'},
//   { label: '14', value: '14'},
//   { label: '15', value: '15'},
//   { label: '16', value: '16'},
//   { label: '17', value: '17'},
//   { label: '18', value: '18'},
//   { label: '19', value: '19'},
//   { label: '20', value: '20'},
//   { label: '21', value: '21'},
//   { label: '22', value: '22'},
//   { label: '23', value: '23'}
// ];
// function hourSelectOption(item: any) {
//   hourSelected.value = item.value;
//   showHourDropdown.value = false;
// }

// 点击外部关闭下拉框
function handleClickOutside(e: MouseEvent) {
  const elDate = document.querySelector('.date-select-box')
  if (elDate && !elDate.contains(e.target as Node)) {
    showDateDropdown.value = false;
  }
  const elArrival = document.querySelector('.arrival-select-box')
  if (elArrival && !elArrival.contains(e.target as Node)) {
    showArrivalDropdown.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})


// 页面跳转
const router = useRouter();

// 上一步：个人信息设置页面
function toProfilePage() {
  router.push('/profile')
}

// 表单信息
const form = ref({
    user_id: '',
    arrival_date: '',
    arrival_transport: '',
    pickup_required: '',
    transport_number: '',
    arrival_hour: null as number | null,  // 既保证类型是数字类型，又保证placerholder可以正常显示
    arrival_min: null as number | null,
});
// 同步显示已填充信息
const userStore = useUserStore();
// 自动填充信息
onMounted(() => {
  console.log(userStore.userInfo);
  // 表单信息
  form.value.user_id = userStore.userInfo.user_id;
  form.value.arrival_date = userStore.userInfo.arrival_date;
  form.value.arrival_transport = userStore.userInfo.arrival_transport;
  form.value.pickup_required = userStore.userInfo.pickup_required;
  form.value.transport_number = userStore.userInfo.transport_number;
  form.value.arrival_hour = userStore.userInfo.arrival_hour;
  form.value.arrival_min = userStore.userInfo.arrival_min;
  // 页面信息
  dateSelected.value = userStore.userInfo.arrival_date;
  arrivalSelected.value = userStore.userInfo.arrival_transport;
})


// 表单提交
async function submitForm() {
  if (!form.value.arrival_date) {
    Toast('请选择抵达日期');
    return;
  }
  if (!form.value.arrival_transport) {
    Toast('请选择抵达方式');
    return;
  }
  if (form.value.arrival_transport == '大理凤仪机场' || form.value.arrival_transport == '大理站' ) {
    if (!form.value.pickup_required) {
      Toast('请选择是否需要接机/接车');
      return;
    }
    if (!form.value.transport_number) {
      Toast('请输入航班号或车次');
      return;
    }
    if (form.value.arrival_hour === null || form.value.arrival_min === null) {
      Toast('请输入抵达时间');
      return;
    }
    if (form.value.arrival_hour < 0 || form.value.arrival_hour > 23) {
      Toast('请调整抵达小时');
      return;
    }
    if (form.value.arrival_min < 0 || form.value.arrival_min > 59) {
      Toast('请调整抵达分钟');
      return;
    }
  } else {
    form.value.pickup_required = '';
    form.value.transport_number = '';
    form.value.arrival_hour = 0;
    form.value.arrival_min = 0;
  }
  
  
  console.log('提交的数据:', form.value);

  // 提交服务器
  const res = await updateArrivalAPI(form.value);
  console.log("到达结果：", res);
  if (res.data.errcode == 0) {
    // 先更新进本地存储
    userStore.setUserInfo(res.data.data.user_info);
    console.log("更新成功，跳转到返程页面填写");
    // 跳转到行程信息-抵达页面
    router.push('/departure');
  } else {
    console.log(res.data.errmsg);
    Toast("网络异常，请稍后重试");
  }
}


</script>

<template>
  <div class="page-body">
    <!-- 头部区域 -->
    <div class="head-container">
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/arrival/header.jpg" class="head-img"></img>
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/arrival/segmented-stepper-2.png" class="head-step"></img>
    </div>
    <!-- 表单区域 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="date-select-item">
            <!-- <label>抵达日期 * Arrival Date</label> -->
            <div class="label-arrival-date"></div>
            <div class="date-select-box">
              <!-- 按钮 -->
              <div class="date-select-btn" @click="showDateDropdown = !showDateDropdown">
                <span>{{ dateSelected ||  '请选择抵达日期'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/arrival/select-btn.png" class="arrow" :class="{ rotate: showDateDropdown }" />
              </div>
              <!-- 下拉框 -->
              <div class="date-dropdown" v-if="showDateDropdown">
                <div 
                  v-for="item in dateOptions"
                  :key="item.value"
                  class="dropdown-item"
                  @click="dateSelectOption(item)"
                >
                {{ item.label }}
              </div>
              </div>
            </div>
        </div>

        <div class="arrival-select-item">
            <!-- <label>抵达方式 * Arrival Transport</label> -->
            <div class="label-arrival-transport"></div>
            <div class="arrival-select-box">
              <!-- 按钮 -->
              <div class="arrival-select-btn" @click="showArrivalDropdown = !showArrivalDropdown">
                <span>{{ arrivalSelected ||  '请选择抵达方式'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/arrival/select-btn.png" class="arrow" :class="{ rotate: showArrivalDropdown }" />
              </div>
              <!-- 下拉框 -->
              <div class="arrival-dropdown" v-if="showArrivalDropdown">
                <div 
                  v-for="item in arrivalOptions"
                  :key="item.value"
                  class="arrival-dropdown-item"
                  @click="arrivalSelectOption(item)"
                >
                {{ item.label }}
              </div>
              </div>
            </div>
        </div>

        <div class="tips-not-sure-transport"></div>

        <div v-show="arrivalSelected === '大理凤仪机场' || arrivalSelected === '大理站'" class="radio-container">
            <!-- <label>是否需要接机/接车 * Pick-up Required</label> -->
            <div class="label-pickup-required"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="是 / Yes" v-model="form.pickup_required">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">是 (Yes)</div> -->
                <div class="radio-label-yes"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="否 / No" v-model="form.pickup_required">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">否 (No)</div> -->
                <div class="radio-label-no"></div>
              </label>
            </div>
        </div>

        <div v-show="arrivalSelected === '大理凤仪机场' || arrivalSelected === '大理站'" class="text-item">
            <!-- <label>航班号或车次 * Flight / Train Number</label> -->
            <div class="label-transport-number"></div>
            <input type="text" v-model="form.transport_number" placeholder="请填写航班号或车次" />
        </div>

        <div v-show="arrivalSelected === '大理凤仪机场' || arrivalSelected === '大理站'" class="hour-select-item">
            <!-- <label>落地/到站时间 * Landing Time / Train Arrival Time</label> -->
            <div class="label-arrival-time"></div>
            <div class="time-container">
              <!-- 以下拉菜单的方式填写时间，弃用 -->
              <!-- <div class="hour-select-box">
                <div class="hour-select-btn" @click="showHourDropdown = !showHourDropdown">
                  <span>{{ hourSelected || '时'}}</span>
                </div>
                <div class="hour-dropdown" v-if="showHourDropdown">
                  <div 
                    v-for="item in hourOptions"
                    :key="item.value"
                    class="hour-dropdown-item"
                    @click="hourSelectOption(item)"
                  >
                    {{ item.label }}
                  </div>
                  
                </div>
              </div> -->
              
              <!-- 文本框的形式 -->
              <input class="time-input" type="number" v-model="form.arrival_hour" placeholder="时" />
              <div class="semicolon">:</div>
              <input class="time-input" type="number" v-model="form.arrival_min" placeholder="分" />
            </div>

            <div class="tips-time-format"></div>
            
        </div>

        <div class="btn-container">
          <div class="arrow-left" @click="toProfilePage"></div>
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
        .date-select-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-arrival-date {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-arrival-date.png") top center no-repeat;
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
        .arrival-select-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-arrival-transport {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-arrival-transport.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .arrival-select-box {
            margin-top: .08rem;
            position: relative;
            width: 4.36rem;
            .arrival-select-btn {
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
            .arrival-dropdown {
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
              .arrival-dropdown-item {
                border-bottom: .0133rem solid #ddd;
                padding: .15rem .2rem;
                cursor: pointer;
              }
              .arrival-dropdown-item:hover {
                background: #eee;
              }
            }
          }
        }
        
        .tips-not-sure-transport {
          margin-top: .2rem;
          width: 4.1733rem;
          height: .7733rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/tips-not-sure-transport.png") top center no-repeat;
          background-size: 100% 100%;
        }

        .radio-container {
          margin-top: .3rem;
          width: 4.36rem;
          height: .6133rem;
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
          .label-pickup-required {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-pickup-required.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .radio-group {
            // background-color: skyblue;
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
                width: .6066rem;
                height: .1733rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-yes.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-label-no {
                width: .56rem;
                height: .1666rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-no.png") top center no-repeat;
                background-size: 100% 100%;
              }
            }

          }
        }

        .hour-select-item {
          margin-top: .2rem;
          width: 4.36rem;
          display: flex;
          flex-direction: column;
          justify-content: left;
          // label {
          //   font-family: "NotoSansSC-Regular";
          //   font-size: .1867rem;
          //   font-weight: 500;
          //   color: #6c727f;
          // }
          .label-arrival-time {
            width: 4.06rem;
            height: .2066rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-arrival-time.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .time-container {
            // 下拉框的方式，弃用
            // .hour-select-box {
            //   position: relative;
            //   width: .8rem;
            //   display: flex;
            //   justify-content: center;
            //   .hour-select-btn {
            //     height: .6133rem;
            //     width: .8rem;
            //     border: .0133rem solid #E0E0E0;
            //     border-radius: .1781rem;
            //     background: white;
            //     // padding: 0.005rem 0.05rem 0 0.2rem;
            //     display: flex;
            //     align-items: center;
            //     justify-content: center;
            //     cursor: pointer;
            //     .arrow {
            //       width: .5133rem;
            //       height: .5133rem;
            //       transition: 0.3s;
            //     }
            //     .arrow.rotate {
            //       transform: rotate(180deg);
            //     }
            //   }
            //   .hour-dropdown {
            //     position: absolute;
            //     top: calc(100% + .00rem);  // 间距
            //     left: 0;
            //     width: 100%;
            //     background: #f9f9f9;  // 和按钮不同颜色
            //     border-radius: .1781rem;
            //     border: .0133rem solid #ddd;

            //     max-height: 4rem;
            //     overflow-y: auto;
            //     // 移动端优化
            //     -webkit-overflow-scrolling: touch;
            //     overscroll-behavior: contain;
            //     // 隐藏滚动条
            //     scrollbar-width: none;
            //     -ms-overflow-style: none;
                
            //     box-shadow: 0 .0533rem .1333rem rgba(0, 0, 0, 0.1);
            //     // overflow: hidden;
            //     z-index: 10;
            //     .hour-dropdown-item {
            //       border-bottom: .0133rem solid #ddd;
            //       padding: .05rem .2rem;
            //       display: flex;
            //       justify-content: center;
            //       align-items: center;
            //       cursor: pointer;
            //     }
            //     .hour-dropdown-item:hover {
            //       background: #eee;
            //     }
            //   }
            // }
            display: flex;
            align-items: center;
            .time-input {
              margin-top: .08rem;
              width: .8143rem;
              height: .5089rem;
              border: .016rem solid #E0E0E0;
              border-radius: .1272rem;
              padding: .1781rem .2036rem;
              color: #1A1A1A80;
              font-size: .2rem;
              font-weight: 500;
            }
            .semicolon {
              color: black;
              margin: 0 .1rem;
              font-size: .3rem;
              font-weight: 500;
            }

          }
          .tips-time-format {
            margin-top: .2rem;
            width: 3.1666rem;
            height: .3266rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/tips-time-format.png") top center no-repeat;
            background-size: 100% 100%;
          }
          
        }

        .text-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // .label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 500;
          //   color: #6c727f;
          // }
          .label-transport-number {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/label-transport-number.png") top center no-repeat;
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
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/arrow-left.png") top center no-repeat;
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
              background: url("https://www.1024.art/projects/static/vale2026rsvp/images/arrival/arrow-right.png") top center no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }


}
</style>