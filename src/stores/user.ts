import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo
  }),

  actions: {
    // 设置全部用户信息（覆盖）
    setUserInfo(data: UserInfo) {
      this.userInfo = data
    },

    // 更新部分字段（推荐用这个）
    updateUserInfo(data: Partial<UserInfo>) {
      this.userInfo = {
        ...this.userInfo,
        ...data,
        // update_time: Date.now()
      }
    },

    // 获取用户信息
    getUserInfo(): UserInfo {
      return this.userInfo
    },

    // 清空用户信息（退出登录用）
    clearUserInfo() {
      this.userInfo = {} as UserInfo
    }
  },

  //  持久化配置
  persist: {
    key: 'user-info',
    storage: localStorage, // 或 sessionStorage
  }
})