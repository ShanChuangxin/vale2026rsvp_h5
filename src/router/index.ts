import { createRouter, createWebHistory } from 'vue-router'
// 认证与个人信息填写相关
import Index from '../views/Index/index.vue'
import Register from '../views/Register/index.vue'  // 研讨会注册
import Profile from '../views/Profile/index.vue'    // 完善个人信息
import Arrival from '../views/Arrival/index.vue'    // 行程信息-抵达
import Departure from '../views/Departure/index.vue'  // 行程信息-返程
import Hotel from '../views/Hotel/index.vue'  // 酒店信息
import Plan from '../views/Plan/index.vue'  // 活动行程安排
import Preview from '../views/Preview/index.vue'  // 信息预览
import Success from '../views/Success/index.vue'  // 信息提交成功

import Home from '../views/Home/index.vue'  // 信息提交成功
import Table from '../views/Table/index.vue'  // 晚宴桌号
import Tips from '../views/Tips/index.vue'  // 温馨提示
import Agenda from '../views/Agenda/index.vue'  // 日程安排
import Guide from '../views/Guide/index.vue'  // 日程安排
import Service from '../views/Service/index.vue'  // 日程安排


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    { // 邀请码验证页面
      path: '/register',
      name: 'register',
      component: Register
    },
    { // 第一步：完善个人信息
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    { // 第二步：行程信息-抵达
      path: '/arrival',
      name: 'arrival',
      component: Arrival
    },
    { // 第三步：行程信息-返程
      path: '/departure',
      name: 'departure',
      component: Departure
    },
    { // 第四步：酒店预订信息
      path: '/hotel',
      name: 'hotel',
      component: Hotel
    },
    { // 第五步：活动行程安排
      path: '/plan',
      name: 'plan',
      component: Plan
    },
    { // 第六步：信息预览
      path: '/preview',
      name: 'preview',
      component: Preview
    },
    { // 第七步：信息提交成功
      path: '/success',
      name: 'success',
      component: Success
    },
    { // Home页面
      path: '/home',
      name: 'home',
      component: Home
    },
    { // 桌号页面
      path: '/table',
      name: 'table',
      component: Table
    },
    { // 温馨提示
      path: '/tips',
      name: 'tips',
      component: Tips
    },
    { // 日程安排
      path: '/agenda',
      name: 'agenda',
      component: Agenda
    },
    { // 酒店导览
      path: '/guide',
      name: 'guide',
      component: Guide
    },
    { // 接送服务及安排
      path: '/service',
      name: 'service',
      component: Service
    },
  ]
})

export default router
