import { httpInstance, wechatHttp } from "../utils/http"
import type { ResponseType } from "@/types/http"
import type { WechatJsConfig } from "@/types/wechat"
import { AxiosResponse } from "axios";
import type { UserInfo, RegisterResult, StampStatus, RequestDraw, ResposeDraw, ScanCheck, TodayPrizeInfo, CheckResult } from "@/types/user";

// 获取用户信息
// export const getUserInfoAPI = (data: UserInfo) => {
//     return httpInstance<ResponseType<UserInfo>>({
//         url: 'get_user_info',
//         method: 'POST',
//         data
//     })
// }

// // 抽奖接口
// export const withdrawAPI = (data: RequestDraw) => {
//     return httpInstance<ResponseType<ResposeDraw>>
// }

// // 核销奖品
// export const checkPrizeAPI = (data: string) => {
//     return httpInstance<ResponseType<CheckResult>>({
//         url: 'check_prize',
//         method: 'POST',
//         data
//     })
// }

// 用户H5接口
// 获取用户信息
export const getUserInfoAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<{ user_info: UserInfo }>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('get_user_info', data);
}
// 获取短信验证码
export const getVerificationCodeAPI = (data: { area_code: string, mobile_number: string }): Promise<AxiosResponse<ResponseType<UserInfo>>> => {
    return httpInstance.post<ResponseType<UserInfo>>('get_verify_code', data);
}
// 提交注册信息
export const registerAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<RegisterResult>>('register', data);
}
// 更新个人信息
export const updateProfileAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('update_profile', data);
}
// 更新抵达信息
export const updateArrivalAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('update_arrival', data);
}
// 更新返程信息
export const updateDepartureAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('update_departure', data);
}
// 更新酒店信息
export const updateHotelAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('update_hotel', data);
}
// 更新行程安排信息
export const updatePlanAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<RegisterResult>>> => {
    return httpInstance.post<ResponseType<{ user_info: UserInfo }>>('update_plan', data);
}








// 微信jssdk配置接口
export const wechatConfigAPI = (data: { url: string }): Promise<AxiosResponse<ResponseType<WechatJsConfig>>> => {
    return wechatHttp.post<ResponseType<WechatJsConfig>>('h5_share', data); // 添加 URL
}






// debug接口
// 清除用户抽奖信息
export const clearDrawInfoAPI = (data: UserInfo): Promise<AxiosResponse<ResponseType<UserInfo>>> => {
    return httpInstance.post<ResponseType<UserInfo>>('clear_draw_info', data);
}
