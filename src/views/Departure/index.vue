<!-- 工作人员备用扫码打卡 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { updateDepartureAPI } from '@/apis/user'
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


// 下拉框相关
// 日期
const showDateDropdown = ref(false);
const dateSelected = ref('');
const dateOptions = [
  { label: '2026/05/14', value: '2026/05/14'},
  { label: '2026/05/15', value: '2026/05/15'}
];
function dateSelectOption(item: any) {
  dateSelected.value = item.value;
  form.value.departure_date = item.value;
  showDateDropdown.value = false;
}
// 行程
const showDepartureDropdown = ref(false);
const departureSelected = ref('');
const departureOptions = [
  { label_cn: '飞机 - 大理凤仪机场', label_en: 'Flight - Dali Fengyi Airport', value: '大理凤仪机场 (Dali Fengyi Airport)'},
  { label_cn: '高铁 - 大理站', label_en: 'Railway - Dali Station', value: '大理站 (Dali Station)'},
  { label_cn: '自驾或其他', label_en: 'Self-Driving or Other', value: '自驾或其他 (Self-Driving or Other)'},
  { label_cn: '稍后提供', label_en: 'To Be Provided Later', value: '稍后提供 (To Be Provided Later)'},
];
function departureSelectOption(item: any) {
  // 1. 赋值
  departureSelected.value = item.value;
  form.value.departure_transport = item.value;
  showDepartureDropdown.value = false;
  // 2. 如果是稍后提供，则进行弹窗
  if (item.value == '稍后提供 (To Be Provided Later)') {
    Toast({
        message: "如您暂无法确定返程方式，建议于5月7日前补充提供。\n If your departure transport is not yet confirmed, please provide them by May 7.",
        duration: 3000
    })
  }
}

// 点击外部关闭下拉框
function handleClickOutside(e: MouseEvent) {
  const elDate = document.querySelector('.date-select-box')
  if (elDate && !elDate.contains(e.target as Node)) {
    showDateDropdown.value = false;
  }
  const elDeparture = document.querySelector('.departure-select-box')
  if (elDeparture && !elDeparture.contains(e.target as Node)) {
    showDepartureDropdown.value = false;
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

// 上一步：行程信息-抵达页面
async function toArrivalPage() {

  if (!(form.value.departure_transport == '大理凤仪机场' || form.value.departure_transport == '大理站' )) {
    form.value.dropoff_required = '';
    // form.value.transport_number = '';
    form.value.departure_hour = null;
    form.value.departure_min = null;
  }
  console.log('提交的数据:', form.value);
  // 提交服务器
  const res = await updateDepartureAPI(form.value);
  console.log("返程结果：", res);
  if (res.data.errcode == 0) {
    // 先更新进本地存储
    userStore.setUserInfo(res.data.data.user_info);
    console.log("更新成功，跳转到上一页填写");
    router.replace('/arrival')
    return true;
  } else {
    console.log(res.data.errmsg);
    Toast("网络异常，请稍后重试");
    return false
  }
}

// 表单信息
const form = ref({
  user_id: '',
  departure_date: '',
  departure_transport: '',
  dropoff_required: '',
  // transport_number: '',
  departure_hour: null as number | null,  // 既保证类型是数字类型，又保证placerholder可以正常显示
  departure_min: null as number | null,
});

// 同步显示已填充信息
const userStore = useUserStore();
// 自动填充信息
onMounted(() => {
  console.log(userStore.userInfo);
  // 表单信息
  form.value.user_id = userStore.userInfo.user_id;
  form.value.departure_date = userStore.userInfo.departure_date;
  form.value.departure_transport = userStore.userInfo.departure_transport;
  form.value.dropoff_required = userStore.userInfo.dropoff_required;
  form.value.departure_hour = userStore.userInfo.departure_hour;
  form.value.departure_min = userStore.userInfo.departure_min;
  // 页面信息
  dateSelected.value = userStore.userInfo.departure_date;
  departureSelected.value = userStore.userInfo.departure_transport;
})

// 处理时间：1. 输入又全删，从null变成''，2. 限制范围
const handleHourInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;

  if (value === "") {
    form.value.departure_hour = null; // ✅ 空 → null
  } else {
    const num = Number(value);

    // 限制范围
    if (num >= 0 && num <= 23) {
      form.value.departure_hour = num;
    } else {
      form.value.departure_hour = null;
    }
  }
};
const handleMinInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;

  if (value === "") {
    form.value.departure_min = null; // ✅ 空 → null
  } else {
    const num = Number(value);

    // 限制范围
    if (num >= 0 && num <= 59) {
      form.value.departure_min = num;
    } else {
      form.value.departure_min = null;
    }
  }
};

// 表单提交
async function submitForm() {
  if (!form.value.departure_date) {
    // Toast('请选择返程日期');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return false;
  }
  if (!form.value.departure_transport) {
    // Toast('请选择返程方式');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return false;
  }
  if (form.value.departure_transport == '大理凤仪机场' || form.value.departure_transport == '大理站' ) {
    if (!form.value.dropoff_required) {
      // Toast('请选择是否需要接机/接车');
      Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
      return false;
    }
    // if (!form.value.transport_number) {
    //   Toast('请输入航班号或车次');
    //   return;
    // }
    if (form.value.departure_hour === null || form.value.departure_min === null) {
      // Toast('请输入返程时间');
      Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
      return false;
    }
    if (form.value.departure_hour < 0 || form.value.departure_hour > 23) {
      // Toast('请调整返程小时');
      Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
      return false;
    }
    if (form.value.departure_min < 0 || form.value.departure_min > 59) {
      // Toast('请调整返程分钟');
      Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
      return false;
    }
  } else {
    form.value.dropoff_required = '';
    // form.value.transport_number = '';
    form.value.departure_hour = null;
    form.value.departure_min = null;
  }
  
  
  console.log('提交的数据:', form.value);


  // 提交服务器
  const res = await updateDepartureAPI(form.value);
  console.log("返程结果：", res);
  if (res.data.errcode == 0) {
    // 先更新进本地存储
    userStore.setUserInfo(res.data.data.user_info);
    console.log("更新成功，跳转到酒店页面填写");
    // 跳转到酒店信息页面
    router.replace('/hotel');
    return true;
  } else {
    console.log(res.data.errmsg);
    Toast("网络异常，请稍后重试");
    return false
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
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/header.jpg" class="head-img"></img>
      <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/segmented-stepper-3.png" class="head-step"></img>
      <div class="back-home" @click="backHome"></div>
    </div>
    <!-- 表单区域 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="date-select-item">
            <!-- <label>返程日期 * Departure Date</label> -->
            <div class="label-departure-date"></div>
            <div class="date-select-box">
              <!-- 按钮 -->
              <div class="date-select-btn" @click="showDateDropdown = !showDateDropdown">
                <span>{{ dateSelected ||  '请选择返程日期'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/select-btn.png" class="arrow" :class="{ rotate: showDateDropdown }" />
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

        <div class="departure-select-item">
            <!-- <label>返程方式 * Departure Transport</label> -->
            <div class="label-departure-transport"></div>
            <div class="departure-select-box">
              <!-- 按钮 -->
              <div class="departure-select-btn" @click="showDepartureDropdown = !showDepartureDropdown">
                <span>{{ departureSelected ||  '请选择返程方式'}}</span>
                <!-- 箭头（可以换图片） -->
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/select-btn.png" class="arrow" :class="{ rotate: showDepartureDropdown }" />
              </div>
              <!-- 下拉框 -->
              <div class="departure-dropdown" v-if="showDepartureDropdown">
                <div 
                  v-for="item in departureOptions"
                  :key="item.value"
                  class="departure-dropdown-item"
                  @click="departureSelectOption(item)"
                >
                {{ item.label_cn }} <br> {{ item.label_en }}
              </div>
              </div>
            </div>
        </div>

        <div class="tips-not-sure-departure"></div>

        <div v-show="departureSelected === '大理凤仪机场' || departureSelected === '大理站'" class="radio-container">
            <!-- <label>是否需要接机/接车 * Pick-up Required</label> -->
            <div class="label-pickup-required"></div>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" value="是 / Yes" v-model="form.dropoff_required">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">是 (Yes)</div> -->
                <div class="radio-label-yes"></div>
              </label>
              <label class="radio-item">
                <input type="radio" value="否 / No" v-model="form.dropoff_required">
                <span class="custom-radio"></span>
                <!-- <div class="radio-text">否 (No)</div> -->
                 <div class="radio-label-no"></div>
              </label>
            </div>
        </div>

        <div v-show="departureSelected === '大理凤仪机场' || departureSelected === '大理站'" class="hour-select-item">
            <!-- <label>落地/到站时间 * Landing Time / Train Departure Time</label> -->
            <div class="label-departure-time"></div>
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
              <input class="time-input" type="number" v-model="form.departure_hour" placeholder="时" @input="handleHourInput"/>
              <div class="semicolon">:</div>
              <input class="time-input" type="number" v-model="form.departure_min" placeholder="分" @input="handleMinInput"/>
            </div>

            <div class="tips-time-format"></div>

            <div class="tips-service-limit"></div>
            
        </div>

        

      </form>
    </div>
    <div class="btn-container">
      <div class="arrow-left" @click="toArrivalPage"></div>
      <div class="submit" @click="submitForm">
          <div class="arrow-right"></div>
          <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/tick.png" alt=""> -->
      </div>
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
          .label-departure-date {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-departure-date.png") top center no-repeat;
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
              span {
                color: #1A1A1A80;
              }
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
                color: #1A1A1A80;
              }
              .dropdown-item:hover {
                background: #eee;
              }
            }
          }
        }
        .departure-select-item {
          margin-top: .2rem;
          display: flex;
          flex-direction: column;
          // label {
          //   font-family: "NotoSansSC-Bold";
          //   font-weight: 600;
          //   color: #6c727f;
          // }
          .label-departure-transport {
            width: 4.36rem;
            height: .2733rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-departure-transport.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .departure-select-box {
            margin-top: .08rem;
            position: relative;
            width: 4.36rem;
            .departure-select-btn {
              height: .6133rem;
              border: .0133rem solid #E0E0E0;
              border-radius: .1781rem;
              background: white;
              padding: 0.005rem 0.05rem 0 0.2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              span {
                color: #1A1A1A80;
              }
              .arrow {
                width: .5133rem;
                height: .5133rem;
                transition: 0.3s;
              }
              .arrow.rotate {
                transform: rotate(180deg);
              }
            }
            .departure-dropdown {
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
              .departure-dropdown-item {
                border-bottom: .0133rem solid #ddd;
                padding: .15rem .2rem;
                cursor: pointer;
                color: #1A1A1A80;
              }
              .departure-dropdown-item:hover {
                background: #eee;
              }
            }
          }
        }
        
        .tips-not-sure-departure {
          margin-top: .2rem;
          width: 4.1733rem;
          height: .7733rem;
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/tips-not-sure.png") top center no-repeat;
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
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-dropoff-required.png") top center no-repeat;
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
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-yes.png") top center no-repeat;
                background-size: 100% 100%;
              }
              .radio-label-no {
                width: .56rem;
                height: .1666rem;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-no.png") top center no-repeat;
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
          .label-departure-time {
            width: 4.3733rem;
            height: .2766rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/label-departure-time.png") top center no-repeat;
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
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/tips-time-format.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .tips-service-limit {
            margin-top: .2rem;
            width: 4.2133rem;
            height: 1.1133rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/tips-service-limit.png") top center no-repeat;
            background-size: 100% 100%;
          }
          
        }

        
      }
    }
    .btn-container {
      position: absolute;
      // margin-top: .5rem;
      margin-left: 50%;
      transform: translateX(-50%);
      bottom: .5rem;
      width: 4.36rem;
      height: .66rem;
      // background-color: pink;
      display: flex;
      
      justify-content: center;
      align-items: center;
      .arrow-left {
        width: .66rem;
        height: .66rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/arrow-left.png") top center no-repeat;
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
          background: url("https://www.1024.art/projects/static/vale2026rsvp/images/departure/arrow-right.png") top center no-repeat;
          background-size: 100% 100%;
        }
      }
    }


}
</style>