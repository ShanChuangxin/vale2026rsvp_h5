<!-- 工作人员核销奖品 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { wechatScan } from '@/utils/wechatLibrary';
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

// 加载用户信息
const userStore = useUserStore();
onMounted(async () => {
    if (userStore.userInfo.user_id) {
        const res = await getUserInfoAPI({user_id: userStore.userInfo.user_id})
        console.log("获取到的用户信息为：", res);
        if (res.data.errcode == 0) {
            // 先更新进本地存储
            userStore.setUserInfo(res.data.data.user_info);
        } else {
            console.log(res.data.errmsg);
            Toast("网络异常，请稍后重试");
        }
    } else {
        // Toast("请重新填写信息");
        router.push('/register');
    }
})

// 某些菜单未开放控制
const isClose = ref(true);

const router = useRouter();
// 菜单按钮跳转：1为个人信息，2为日程安排，3为晚宴桌号，4为班车安排，5为酒店导览，6为温馨贴士，7为参会照片
function clickMenuBtn( menuNum:number) {
    // 1. 判断是否到开放日了
    if (isClose.value && (3 == menuNum || menuNum > 4)) {
        Toast("5月13日开放");
        return;
    }
    // 2. 跳转
    console.log("跳转到：" + menuNum.toString());
    switch (menuNum) {
        case 1: 
            router.push('/profile'); 
            console.log("跳转到个人信息页面");
            break;
        case 2: router.push('/agenda');
            console.log("跳转到日程安排页面");
            break;
        case 3: router.push('/table');
            console.log("跳转到晚宴桌号页面");
            break;
        case 4: router.push('/service');
            console.log("跳转到班车安排页面");
            break;
        case 5: router.push('/guide');
            console.log("跳转到酒店导览页面");
            break;
        case 6: router.push('/tips');
            console.log("跳转到日程安排页面");
            break;
        case 7: Toast("等待获取参会照片链接..");
            console.log("跳转到参会照片页面");
            break;
    }
}


// 信息完善弹窗
const isPopWindow = ref(false);
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


// debug
function debugSwitchDate() {
    isClose.value = !isClose.value;
    if (isClose.value) {
        Toast("切换到5.13之前");
    } else {
        Toast("切换到5.13之后");
    }
}


</script>

<template>
    <div class="page-body">
        <!-- 顶部区域 -->
        <div class="head-area">
            <!-- 图片用于撑起父盒子 -->
            <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/header.jpg" class="head-bg">
            <div class="debug-switch-date" @click="debugSwitchDate"></div>
        </div>
        
        <!-- 菜单列表 -->
        <div class="menu-list-container">
            <div class="menu-item" @click="clickMenuBtn(1)">
                <img src="https://www.1024.art/projects/static/vale2026rsvp/images/home/profile.png" alt="">
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
        // .logo {
        //     position: absolute;
        //     top: .36rem;
        //     left: .0933rem;
        //     width: .866rem;
        //     height: .32rem;
        //     background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/logo.png") top center no-repeat;
        //     background-size: 100% 100%;
        // }
        // .slogan {
        //     position: absolute;
        //     top: .85rem;
        //     left: .2rem;
        //     width: 1.9533rem;
        //     height: .8rem;
        //     background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/slogan.png") top center no-repeat;
        //     background-size: 100% 100%;
        // }
        // .event-name {
        //     position: absolute;
        //     bottom: .85rem;
        //     right: .2rem;
        //     width: 2.2533rem;
        //     height: .3533rem;
        //     background: url("https://www.1024.art/projects/static/vale2026rsvp/images/register/event-name.png") top center no-repeat;
        //     background-size: 100% 100%;

        // }
        // .name-font {
        //     position: absolute;
        //     top: 0;
        //     right: 0;
        //     color:white;
        //     font-family: "NotoSansSC-Bold";
        // }
        .debug-switch-date {
            position: absolute;
            // background-color: pink;
            top: .2rem;
            left: .24rem;
            width: .84rem;
            height: .4rem;
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