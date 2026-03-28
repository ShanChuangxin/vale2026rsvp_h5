<!-- 工作人员核销奖品 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { wechatScan } from '@/utils/wechatLibrary';
import { getTodayPrizeInfoAPI, checkPrizeAPI } from '@/apis/user'
import { Toast } from 'vant'
import { useRoute } from 'vue-router'
import { PrizeKey, PrizeItem } from '@/types/user';
// 定义页面
// 城市信息
// 通过url参数获取当前城市
const route = useRoute();

// 定义需要显示数据的响应式变量

// 获取该城市今天奖品信息
// const getTodayPrizeInfo = async () => {
//     // 1. 获取城市参数
//     if (route.query.city) {
//         console.log(route.query.city);
//         const city = route.query.city as string;
//         if (cityList.includes(city)) {
//             currentCity.value = city;   // 更新城市参数
//             // 2. 拉取城市核销信息
//             const res = await getTodayPrizeInfoAPI({city: currentCity.value});
//             console.log("拉取到的今日的奖品信息为：", res);
//             if (res.data.errcode == 0){
//                 PRIZE_KEYS.forEach(key => {
//                     prizeInfo.value[key].check_count = res.data.data.today_info[key]?.check_count ?? 0; 
//                     prizeInfo.value[key].issued_count = res.data.data.today_info[key]?.issued_count ?? 0;
//                 })
//             } else {
//                 console.log("拉取今日奖品信息失败：", res.data.errmsg);
//             }
//         } else {
//             Toast("城市参数错误");
//             return;
//         }
//     } else {
//         Toast("缺少城市参数");
//         return;
//     }
// }
// onMounted(() => getTodayPrizeInfo())

// 监测手机宽高比进行提醒
onMounted(() => {
  if (window.innerWidth > window.innerHeight) {
    Toast({
      message: "请在手机或者竖屏下使用",
      duration: 3000
    })
  }
});

// 某些菜单未开放控制
const isClose = ref(false);

// 菜单按钮跳转：1为个人信息，2为日程安排，3为晚宴桌号，4为班车安排，5为酒店导览，6为温馨贴士，7为参会照片
function clickMenuBtn( menuNum:number) {
    // 1. 判断是否到开放日了
    if (isClose.value && (3 == menuNum || menuNum > 4)) {
        Toast("5月13日开放");
        return;
    }
    // 2. 跳转
    console.log("跳转到：" + menuNum.toString());
}


// 信息完善弹窗
const isPopWindow = ref(true);
function editProfile () {
    console.log("跳转到信息补充页面");
    // undo
}
function closePopWindow() {
    console.log("关闭信息补充页面");
    // 2. 关闭弹窗
    isPopWindow.value = false;
}
const isYesBtnPressed = ref(false);
const isNoBtnPressed = ref(false);
// yes按钮按下的事件
function onYesBtnTouchStart() {
    isYesBtnPressed.value = true;
    console.log("按钮按下");
}
// yes按钮松开的事件
function onYesBtnTouchEnd() {
    isYesBtnPressed.value = false;
    console.log("按钮松开");
}
// no按钮按下的事件
function onNoBtnTouchStart() {
    isNoBtnPressed.value = true;
    console.log("按钮按下");
}
// no按钮松开的事件
function onNoBtnTouchEnd() {
    isNoBtnPressed.value = false;
    console.log("按钮松开");
}

// 表单信息
const form = ref({
    invitation_code: '',
    mobile_number: '',
    verification_code: ''
});

const countdown = ref(0);   // 倒计时秒数
let timer: ReturnType<typeof setInterval> | null = null; // 定时器ID
// 正则检查手机号（中国大陆手机号示例）
function isValidMobile(mobile: string) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(mobile);
}
function sendCode() {
    // 1. 倒计时中禁止点击
    if (countdown.value > 0) return;    // 倒计时中不能点击

    // 2. 手机号不能为空
    if (!form.value.mobile_number) {
        Toast('请输入手机号');
        return;
    }

    // 3. 手机号格式校验
    if (!isValidMobile(form.value.mobile_number)) {
        Toast('手机号格式不正确');
        return;
    }

    // 4. 在这里调用发送验证码接口，例如：
    // undo
    // await sendVerificationCodeAPI(form.mobile_number)
    console.log('发送验证码接口调用');

    // 5.开始倒计时
    countdown.value = 30;
    timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

// 表单提交
function submitForm() {
  if (!form.value.invitation_code) {
    Toast('请输入邀请码');
    // Toast({
    //     message: "抵达方式建议您于4月29日前提供 \n It is recommended that you provide the arrival details by April 29th.",
    //     duration: 2000
    // })
    return;
  }
  if (!form.value.mobile_number) {
    Toast('请输入手机号');
    return;
  }
  if (!form.value.verification_code) {
    Toast('请输入验证码');
    return;
  }
  
  
  console.log('提交的数据:', form.value);
}

</script>

<template>
    <div class="page-body">
        <!-- 顶部区域 -->
        <div class="head-area">
            <!-- 图片用于撑起父盒子 -->
            <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/header.jpg" class="head-bg">
        </div>
        
        <!-- 菜单列表 -->
        <div class="menu-list-container">
            <div class="menu-item" @click="clickMenuBtn(1)">
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/agenda.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(2)">
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/agenda.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(3)">
                <img v-if="isClose" src="https://www.1024.art/projects/static/vale2026rsvp/images/home/close-table.png" alt="">
                <img v-else src="https://www.1024.art/projects/static/vale2026rsvp/images/home/table.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(4)">
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/shuttle.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(5)">
                <img v-if="isClose" src="https://www.1024.art/projects/static/vale2026rsvp/images/home/close-hotel.png" alt="">
                <img v-else src="https://www.1024.art/projects/static/vale2026rsvp/images/home/hotel.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(6)">
                <img v-if="isClose" src="https://www.1024.art/projects/static/vale2026rsvp/images/home/close-tips.png" alt="">
                <img v-else src="https://www.1024.art/projects/static/vale2026rsvp/images/home/tips.png" alt="">
            </div>
            <div class="menu-item" @click="clickMenuBtn(7)">
                <img v-if="isClose" src="https://www.1024.art/projects/static/vale2026rsvp/images/home/close-gallery.png" alt="">
                <img v-else src="https://www.1024.art/projects/static/vale2026rsvp/images/home/gallery.png" alt="">
            </div>
        </div>

        <!-- 弹窗 -->
        <div v-if="isPopWindow" class="pop-window-container" @click="closePopWindow">
            <div class="pop-window" @click.stop>
                <div class="tips-finish">
                </div>
                <div class="btn-container">
                    <!-- touchstart和touchend只是touch事件，只用于移动端 -->
                    <div class="yes-btn" :class="{press: isYesBtnPressed}" @touchstart="onYesBtnTouchStart" @touchend="onYesBtnTouchEnd"></div>
                    <div class="no-btn" :class="{press: isNoBtnPressed}" @touchstart="onNoBtnTouchStart" @touchend="onNoBtnTouchEnd" @click="closePopWindow"></div>
                </div>
                
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>

.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    height: 100vh;
    // overflow: hidden;
    background-color: #F5F7F6;
    // 顶部区域
    .head-area {
        position: relative;
        width: 100%;
        .head-bg {
            width: 100%;
        }
        .logo {
            position: absolute;
            top: .36rem;
            left: .0933rem;
            width: .866rem;
            height: .32rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/logo.png") top center no-repeat;
            background-size: 100% 100%;
        }
        .slogan {
            position: absolute;
            top: .85rem;
            left: .2rem;
            width: 1.9533rem;
            height: .8rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/slogan.png") top center no-repeat;
            background-size: 100% 100%;
        }
        .event-name {
            position: absolute;
            bottom: .85rem;
            right: .2rem;
            width: 2.2533rem;
            height: .3533rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/event-name.png") top center no-repeat;
            background-size: 100% 100%;

        }
        .name-font {
            position: absolute;
            top: 0;
            right: 0;
            color:white;
            font-family: "NotoSansSC-Bold";
        }
    }

    // 菜单列表容器
    .menu-list-container {
        margin-top: .6rem;
        margin-left: 50%;
        transform: translateX(-50%);
        // background-color: pink;
        width: 92%;
        // height: 100vh;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items:flex-start;
        .menu-item {
            margin-top: .14rem;
            width: 48.5%;
            // height: 1.5rem;
            // background-color: skyblue;
            img {
                width: 100%;
                display: block;
            }
        }
    }
   
    // 弹窗
    .pop-window-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .35);
        display: flex;
        justify-content: center;
        align-items: center;
        .pop-window {
            width: 3.88rem;
            height: 2.1867rem;
            border-radius: .2533rem;
            background-color: #FFF;
            .tips-finish {
                margin-top: .3rem;
                margin-left: 50%;
                transform: translateX(-50%);
                width: 3.2666rem;
                height: .7866rem;;
                background: url("https://www.1024.art/projects/static/vale2026rsvp/images/home/tips-finish.png") top center no-repeat;
                background-size: 100% 100%;
            }
            .btn-container {
                margin-top: .2rem;
                margin-left: 50%;
                transform: translateX(-50%);
                width: 90%;
                // background-color: pink;
                display: flex;
                justify-content: space-between;
                .yes-btn {
                    width: 1.7466rem;
                    height: .8rem;;
                    background: url("https://www.1024.art/projects/static/vale2026rsvp/images/home/btn-yes-default.png") top center no-repeat;
                    background-size: 100% 100%;
                }
                .yes-btn.press {
                    width: 1.7466rem;
                    height: .8rem;;
                    background: url("https://www.1024.art/projects/static/vale2026rsvp/images/home/btn-yes-pressed.png") top center no-repeat;
                    background-size: 100% 100%;
                }
                .no-btn {
                    width: 1.7466rem;
                    height: .8rem;;
                    background: url("https://www.1024.art/projects/static/vale2026rsvp/images/home/btn-no-default.png") top center no-repeat;
                    background-size: 100% 100%;
                }
                .no-btn.press {
                    width: 1.7466rem;
                    height: .8rem;;
                    background: url("https://www.1024.art/projects/static/vale2026rsvp/images/home/btn-no-pressed.png") top center no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }



}
</style>