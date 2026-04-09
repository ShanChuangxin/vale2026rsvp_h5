


// 用户信息
export type UserInfo = {
    user_id?: string;
    timestamp?: number;
    update_time?: number;

    // 需要后台显示处理的数据
    guest_type?: string;
    table_num?: number;
    invite_company?: string;
    room_type?: string;
    // 注册页面填写的信息
    invitation_code?: string;
    area_code?: string;
    mobile_number?: string;
    verify_code?: string;
    // 完善个人信息
    name?: string;
    gender?: string;
    company_name?: string;
    department?: string;
    job_title?: string;
    email?: string;
    // 行程信息-抵达
    arrival_date?: string;
    arrival_transport?: string;
    pickup_required?: string;
    transport_number?: string;
    arrival_hour?: number | null;
    arrival_min?: number | null;
    // 行程信息-返程
    departure_date?: string;
    departure_transport?: string;
    dropoff_required?: string;
    departure_hour?: number | null;
    departure_min?: number | null;
    // 酒店信息
    checkin_date?: string;
    checkout_date?: string;
    // 活动行程安排
    attend_welcome_dinner?: string;
    attend_gala_dinner?: string;
    cloth_size?: string;
    remarks?: string;
}

// 注册结果
export type RegisterResult = {
    new_user?: Boolean;
    user_info?: UserInfo;

}

// 打卡状态
export type StampStatus = {
    position_time_1?: boolean | string;
    position_time_2?: boolean | string;
    position_time_3?: boolean | string;
    position_time_4?: boolean | string;
}

// 请求抽奖
export type RequestDraw = {
    user_id: string;
    // withdraw_type?: '1' | '2';
}

// 抽奖结果
export type ResposeDraw = {
    prize_code?: number;
}

// 备用方案扫码打卡
export type ScanCheck = {
    city?: string;
    qr_code?: string;    // 客人H5隐藏按钮的信息，格式为：用户id_打卡点编号
}

// 今日礼品发放数量
type PrizeKey = 'prize_1' | 'prize_2' | 'prize_3' | 'prize_4' | 'prize_5';
type PrizeItem = {
    check_count: number;
    issued_count: number;
}
export type TodayPrizeInfo = {
    city?: string;
    today_info: Partial<Record<PrizeKey, PrizeItem>>;   // 允许prize缺失，但类型受控
}

// 核销结果
export type CheckResult = {
    check_status?: boolean;
    check_status_msg?: string;
    check_num?: number;
}