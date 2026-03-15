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

// 开屏图片动画
const needSplash = ref(false);  // 这个变量未来从localStorage获取
const showSplash = ref(false);
const showPageBody = ref(false);
onMounted(() => {
    const img = new Image();
    img.src = 'https://www.1024.art/projects/static/vale2026rsvp/images/register/KV.jpg';
    img.onload = () => {
        // 0. 显示表单信息
        showPageBody.value = true;
        // 1. 模拟从本地存储读取
        needSplash.value = true;
        // 2. 如果需要开屏动画
        if (needSplash.value) {
            showSplash.value = true;
            setTimeout(() => {
                showSplash.value = false;
            }, 2000);
        }
    }
    
})

// 弹窗
const isPopWindow = ref(true);
function closePopWindow() {
    console.log("关闭信息保护与服务协议");
    // 1. 本地存储记录 
    // undo

    // 2. 关闭弹窗
    isPopWindow.value = false;
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
  const reg = /^1[3-9]\d{9}$/
  return reg.test(mobile)
}
function sendCode() {
    // 1. 倒计时中禁止点击
    if (countdown.value > 0) return;    // 倒计时中不能点击

    // 2. 手机号不能为空
    if (!form.value.mobile_number) {
        Toast('请输入手机号')
        return
    }

    // 3. 手机号格式校验
    if (!isValidMobile(form.value.mobile_number)) {
        Toast('手机号格式不正确')
        return
    }

    // 4. 在这里调用发送验证码接口，例如：
    // undo
    // await sendVerificationCodeAPI(form.mobile_number)
    console.log('发送验证码接口调用');

    // 5.开始倒计时
    countdown.value = 30;
    timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

// 表单提交
function submitForm() {
  if (!form.value.invitation_code) {
    Toast('请输入邀请码');
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
    <!-- 开屏动画 -->
    <transition name="splash-fade">
        <div v-if="showSplash" class="splash-screen">
            <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/KV.jpg" class="splash-image"/>
        </div>
    </transition>

    <!-- 页面本身 -->
    <div v-if="showPageBody" class="page-body">
        <!-- 顶部区域 -->
        <div class="head-area">
            <!-- 图片用于撑起父盒子 -->
            <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/head-bg.png" class="head-bg">
            <!-- <div class="logo"></div>
            <div class="slogan"></div>
            <div class="event-name"></div>
            <div class="name-font">2026年淡水河谷中国科研研讨会</div> -->
        </div>
        <!-- 验证区域 -->
        <div class="verify-area">
            <div class="register-title"></div>
            <div class="register-body">
                <form @submit.prevent="submitForm" class="form">
                    <div class="form-item">
                        <label>公司邀请码 * Invitation Code</label>
                        <input type="text" v-model="form.invitation_code" placeholder="请输入邀请码" />
                    </div>
                    <div class="form-item">
                        <label>手机号码 * Mobile Code</label>
                        <input type="text" v-model="form.mobile_number" placeholder="请输入手机号" />
                    </div>
                    <div class="form-item">
                        <label>验证码 * Verification Code</label>
                        <div class="verification-code-area">
                            <input type="text" v-model="form.verification_code" placeholder="请输入验证码" class="verification-code-input"/>
                            <div class="get-code-area" :class="{disabled: countdown > 0}" @click="sendCode">
                                <h4>{{ countdown > 0 ? countdown + 's后重试' : '获取验证码' }}</h4>
                            </div>
                        </div>
                    </div>
                    <button class="submit" type="submit">
                        <div class="tick"></div>
                        <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/tick.png" alt=""> -->
                    </button>
                </form>
            </div>
        </div>
        <!-- 弹窗 -->
        <div v-if="isPopWindow" class="pop-window-container">
            <div class="pop-window">
                <div class="text-content">
                    <div class="scroll">
                        <div class="ruler"></div>
                    </div>
                </div>
                <div class="text-btn" @click="closePopWindow">
                    <div class="text-btn-tick"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #000;
  z-index: 9999;
}

.splash-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.splash-fade-enter-active {
  transition: none;
}

.splash-fade-enter-from {
  opacity: 1;
}

.splash-fade-enter-to {
  opacity: 1;
}

.splash-fade-leave-active {
  transition: opacity 2s;
}

.splash-fade-leave-from {
  opacity: 1;
}

.splash-fade-leave-to {
  opacity: 0;
}
.page-body {
    // 通用页面
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
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
    // 信息认证区域
    .verify-area {
        margin-top: .3rem;
        width: 90%;
        margin-left: 50%;
        transform: translateX(-50%);
        // background-color: pink;
        .register-title{
            width: 4.36rem;
            height: .5666rem;
            background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/register-title.png") top center no-repeat;
            background-size: 100% 100%;
        }
        .register-body {
            margin-top: .1rem;
            width: 100%;
            // background-color: skyblue;
            .form {
                // background-color: pink;
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                .form-item {
                    margin-top: .2rem;
                    display: flex;
                    flex-direction: column;
                    label {
                        font-family: "NotoSansSC-Bold";
                        font-weight: 600;
                        color: #6c727f;
                    }
                    input {
                        margin-top: .08rem;
                        width: 4.36rem;
                        height: .6133rem;
                        border: .016rem solid #E0E0E0;
                        border-radius: .1781rem;
                        padding: .1781rem .2036rem;
                    }
                    .verification-code-area {
                        margin-top: .08rem;
                        width: 4.36rem;
                        height: .6133rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        input {
                            margin: 0;
                            width: 2.96rem;
                            height:.6133rem;
                            border: .016rem solid #E0E0E0;
                            border-radius: .1781rem;
                        }
                        .get-code-area {
                            width: 1.2533rem;
                            height: .6133rem;
                            border-radius: .1781rem;
                            border: .0169rem solid #EDB11F;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #EDB11F;
                            cursor: pointer;
                            user-select: none;
                            h4 {
                                margin: 0;
                                line-height: .6133rem;  // 行高一致，垂直居中
                                font-family: "NotoSansSC-Regular";
                                font-size: .1867rem;
                                font-weight: 400;
                            }
                        }
                        .get-code-area.disabled {
                            color: #aaa;
                            border-color: #ccc;
                            cursor: not-allowed;
                        }

                    }
                }
                .submit {
                    margin-top: .5rem;
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
            width: 4.3893rem;
            height: 7.0992rem;
            border-radius: .2036rem;
            background-color: #FFFFFF;
            .text-content {
                margin-top: .2897rem;
                margin-left: 50%;
                padding-top: .3463rem;
                transform: translateX(-50%);
                width: 3.7788rem;
                height: 5.4072rem;
                border: .0085rem solid #E6E8E5;
                border-radius: .1781rem;
                overflow: hidden;
                .scroll {
                    height: 100%;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;  // 微信 + ios滚动ww优化
                    display: flex;
                    justify-content: center;
                    .ruler {
                        margin-top: -.3463rem;
                        width: 3.16rem;
                        height: 23.14rem;
                        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/ruler.png") top center no-repeat;
                        background-size: 100% 100%;
                        margin-bottom: .4rem;
                    }
                }

            }
            .text-btn {
                margin-top: .3463rem;
                margin-left: 50%;
                transform: translateX(-50%);
                width: 3.1807rem;
                height: .7125rem;
                border: 0;
                border-radius: .1781rem;
                background-color: #007E7A;
                display: flex;
                justify-content: center;
                align-items: center;
                .text-btn-tick {
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