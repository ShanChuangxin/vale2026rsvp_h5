<!-- 工作人员核销奖品 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getVerificationCodeAPI, registerAPI } from '@/apis/user'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user';

const userStore = useUserStore()


// 监测手机宽高比进行提醒
onMounted(() => {
  if (window.innerWidth > window.innerHeight) {
    Toast({
      message: "请在手机或者竖屏下使用",
      duration: 3000
    })
  }
});


// 页面跳转
const router = useRouter();

// 监测是否已经注册过，如果已经注册过，则跳转到home页面
onMounted(() => {
    console.log(userStore.userInfo?.user_id);
    if (userStore.userInfo?.user_id) {
        console.log("已经注册了，二次进入跳转到Home页面");
        router.replace('/home');
    }
})

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
    area_code: '+86',  // 地区区号，默认是+86
    mobile_number: '',
    verify_code: ''
});

const countdown = ref(0);   // 倒计时秒数
let timer: ReturnType<typeof setInterval> | null = null; // 定时器ID
// 正则检查手机号（中国大陆手机号示例）
function isValidMobile(mobile: string) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(mobile);
}

// 地区区号选择
const showAreaCodeDropdown = ref(false);
const areaCodeSelected = ref('+86');
const areaCodeOptions = [
  { label: '+86', value: '+86'},
  { label: '+65', value: '+65'},
  { label: '+886', value: '+886'},
  { label: '+55', value: '+55'}
];
function checkoutSelectOption(item: any) {
  // 1. 赋值
  areaCodeSelected.value = item.value;
  form.value.area_code = item.value;
  showAreaCodeDropdown.value = false;
}

// 点击外部关闭下拉框
function handleClickOutside(e: MouseEvent) {

  const elAreaCode = document.querySelector('.area-code-select-box')
  if (elAreaCode && !elAreaCode.contains(e.target as Node)) {
    showAreaCodeDropdown.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})

// 获取验证码
async function sendCode() {
    // 1. 倒计时中禁止点击
    if (countdown.value > 0) return;    // 倒计时中不能点击

    // 2. 手机号不能为空
    if (!form.value.mobile_number) {
        // Toast('请输入手机号');
        Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
        return;
    }

    // 3. 手机号格式校验
    // if (!isValidMobile(form.value.mobile_number)) {
    //     // Toast('手机号格式不正确');
    //     Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    //     return;
    // }

    // 4. 在这里调用发送验证码接口，例如：
    await getVerificationCodeAPI({area_code: form.value.area_code, mobile_number: form.value.mobile_number})
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
async function submitForm() {
  if (!form.value.invitation_code) {
    // Toast('请输入邀请码');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    // Toast({
    //     message: "抵达方式建议您于4月29日前提供 \n It is recommended that you provide the arrival details by April 29th.",
    //     duration: 2000
    // })
    return;
  }
  if (!form.value.mobile_number) {
    // Toast('请输入手机号');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }
  if (!form.value.verify_code) {
    // Toast('请输入验证码');
    Toast('请完成必填项（*）。\nPlease fill in all required fields (*).');
    return;
  }
  
  
  console.log('提交的数据:', form.value);
  
  // 提交服务器
  const res = await registerAPI(form.value);
  console.log("请求注册的结果为：", res);
  if (res.data.errcode == 0) {
    console.log("注册成功");
    console.log(res.data.data.user_info);
    // 1. 本地记录存储
    userStore.setUserInfo(res.data.data.user_info);

    // 2. 跳转
    if (res.data.data.new_user) { // 到完善个人信息页面
        router.replace('/profile');
    } else {    // 跳转到主页
        router.replace("/home");
    }
    
  } else {
    console.log("注册失败");
    Toast(res.data.errmsg);
  }
}

</script>

<template>
    <!-- 开屏动画 -->
    <transition name="splash-fade">
        <div v-if="showSplash" class="splash-screen">
            <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/kv.jpg" class="splash-image"/> -->
            <div class="splash-image">
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/splash-bg.jpg" alt="">
                <div class="title"></div>
                <div class="slogan"></div>
            </div>
        </div>
    </transition>

    <!-- 页面本身 -->
    <div v-if="showPageBody" class="page-body">
        <!-- 顶部区域 -->
        <div class="head-area">
            <!-- 图片用于撑起父盒子 -->
            <img src="https://www.1024.art/projects/static/vale2026rsvp/images/register/head-bg.jpg" class="head-bg">
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
                        <!-- <label>公司邀请码 * Invitation Code</label> -->
                        <div class="label-invitation-code"></div>
                        <input type="text" v-model="form.invitation_code" placeholder="请输入邀请码" maxlength="10" />
                    </div>
                    <div class="form-item">
                        <div class="label-mobile-number"></div>
                        <div class="mobile-container">
                            <!-- 区号下拉框 -->
                            <div class="area-code-select-item">
                                <div class="area-code-select-box">
                                    <!-- 按钮 -->
                                    <div class="checkout-select-btn" @click="showAreaCodeDropdown = !showAreaCodeDropdown">
                                        <!-- <span>{{ areaCodeSelected ||  '请选择退房日期'}}</span> -->
                                        <span>{{ areaCodeSelected }}</span>
                                        <!-- 箭头（可以换图片） -->
                                        <!-- <img src="https://www.1024.art/projects/static/vale2026rsvp/images/departure/select-btn.png" class="arrow" :class="{ rotate: showAreaCodeDropdown }" /> -->
                                    </div>
                                    <!-- 下拉框 -->
                                    <div class="checkout-dropdown" v-if="showAreaCodeDropdown">
                                        <div 
                                            v-for="item in areaCodeOptions"
                                            :key="item.value"
                                            class="checkout-dropdown-item"
                                            @click="checkoutSelectOption(item)"
                                            >
                                            {{ item.label }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input type="number" v-model="form.mobile_number" placeholder="请输入手机号" maxlength="11"/>
                        </div>
                        
                    </div>
                    <div class="form-item">
                        <!-- <label>验证码 * Verification Code</label> -->
                        <div class="label-verification-code"></div>
                        <div class="verification-code-area">
                            <input type="number" v-model="form.verify_code" placeholder="请输入验证码" maxlength="6"  class="verification-code-input"/>
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
  z-index: 999;
    
}

// .splash-image {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }
.splash-image {
    position: relative;
    width: 100%;
    height: 100vh;
    // width: 1.6333rem;
    // height: .3266rem;
    // background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/kv.jpg") top center no-repeat;
    // background-size: 100% 100%;
    img {
        width: 100%;
    }
    .title {
        position: absolute;
        top: 1rem;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 5rem;
        height: 3.56rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/title.png") top center no-repeat;
        background-size: 100% 100%;
        // background-color: red;
    }
    .slogan {
        position: absolute;
        bottom: .35rem;
        margin-left: 50%;
        transform: translateX(-50%);
        width: 5rem;
        height: 1.06rem;
        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/slogan-full.png") top center no-repeat;
        background-size: 100% 100%;
        z-index: 9999;
    }
    // .slogan-en {
    //     position: absolute;
    //     bottom: .4rem;
    //     left: .4rem;
    //     width: 1.7133rem;
    //     height: .5666rem;
    //     background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/slogan-en.png") top center no-repeat;
    //     background-size: 100% 100%;
    //     z-index: 9999;
    //     // background-color: red;
    // }
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
                    // label {
                    //     font-family: "NotoSansSC-Bold";
                    //     font-weight: 600;
                    //     color: #6c727f;
                    // }
                    .label-invitation-code {
                        width: 4.36rem;
                        height: .2733rem;
                        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/label-invitation-code.png") top center no-repeat;
                        background-size: 100% 100%;
                    }

                    // 手机号容器
                    .mobile-container {
                        margin-top: .08rem;
                        background-color: white;
                        width: 4.36rem;
                        height: .6133rem;
                        display: flex;
                        align-items: center;
                        border: .016rem solid #E0E0E0;
                        border-radius: .1781rem;
                        
                        // 地区区号选择
                        .area-code-select-item {
                            // margin-top: .2rem;
                            display: flex;
                            flex-direction: column;
                            // label {
                            //   font-family: "NotoSansSC-Bold";
                            //   font-weight: 600;
                            //   color: #6c727f;
                            // }
                            .area-code-select-box {
                                // margin-top: .08rem;
                                position: relative;
                                width: .7rem;
                                .checkout-select-btn {
                                    height: .6133rem;
                                    // border-right: .0133rem solid #E0E0E0;
                                    // border-radius: .1781rem;
                                    // background: pink;
                                    padding: 0.005rem 0.05rem 0 0.2rem;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                        span{
                                            margin-left: -.2rem;
                                            color: #1A1A1A80;
                                        }
                                    // .arrow {
                                    //     width: .5133rem;
                                    //     height: .5133rem;
                                    //     transition: 0.3s;
                                    // }
                                    // .arrow.rotate {
                                    //     transform: rotate(180deg);
                                    // }
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
                                        padding: .15rem .2rem .15rem .1rem;;
                                        cursor: pointer;
                                        color: #1A1A1A80;
                                    }
                                    .checkout-dropdown-item:hover {
                                        background: #eee;
                                    }
                                }
                            }
                        }
                        input {
                            // background-color: skyblue;
                            margin: 0;
                            width: 2.36rem;
                            height: .45rem;
                            border: 0;
                            border-left: .01rem solid #E0E0E0;
                            border-radius: 0;
                            padding: .1781rem .2036rem;
                            color: #1A1A1A80;
                        }
                    }
                    


                    .label-mobile-number {
                        width: 4.36rem;
                        height: .2733rem;
                        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/label-mobile-number.png") top center no-repeat;
                        background-size: 100% 100%;
                    }
                    .label-verification-code {
                        width: 4.36rem;
                        height: .2733rem;
                        background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/label-verification-code.png") top center no-repeat;
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
                                margin: .05rem 0 0 0;
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
                        height: 12.44rem;
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