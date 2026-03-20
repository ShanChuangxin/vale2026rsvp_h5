import { createRouter, createWebHistory } from 'vue-router'
// lego cny
import Index from '../views/Index/index.vue'
import Register from '../views/Register/index.vue'  // 研讨会注册
import Profile from '../views/Profile/index.vue'    // 完善个人信息
import Arrival from '../views/Arrival/index.vue'    // 行程信息-抵达
import Departure from '../views/Departure/index.vue'  // 行程信息-返程

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
    }
  ]
})

export default router
