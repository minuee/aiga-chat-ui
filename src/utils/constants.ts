export const apiSuccessCode = [200,201,202,203,300,301,302];
export const apiAllowOriginCode = ["https://aigadev.kormedi.com","http://localhost:3000"]

const chatAnswerType = ['recommand_doctor','search_doctor','recommand_hospital','general']

const contrants  = {
    defaultColor : '#6c62d1',
    projectTitle : 'AIGA WEB',
    popDetailSizeRule1 : 1024,// 멀티뷰 최소너비 기준지점
    popDetailSizeRule2 : '800px',//멀티뷰최소너비
    popDetailSizeRule3 : '80%',//  멀티뷰 최소너비 이상일때 너비 비율
    popDetailSizeRule4 : '700px',// 싱글뷰 기준 너비
    rightFixedWidth : '550px',
    apiTokenName : "aiga-minuee",
    userMaxToken : 10, //주문조회리스트 하이라이트 기준주문금액
    userRetryLimitSec : 60,
    sidebarWidth: 86,
    headerHeight: 56,
    mobileSidebarWidth: 0,
    mobileHeaderHeight: 60,
    modalMaxWidth : 640,
    desktopMinWidth : 640,
    inputMaxMessage : 100,
    nickNameAbleString : /^[가-힣a-zA-Z0-9_]+$/,
    apiSuccessCode,
    apiAllowOriginCode,
    pathname_modal_1 : "modal_doctor_list",
    pathname_modal_2 : "modal_doctor_detail",
    pathname_modal_2_2 : "modal_doctor_detail2",
    pathname_modal_3 : "modal_doctor_review",
    pathname_modal_3_2 : "modal_doctor_review2",
    pathname_modal_4 : "modal_doctor_request",
    pathname_modal_5 : "modal_mypage_notice",
    pathname_modal_5_2 : "modal_mypage_notice_detail",
    pathname_modal_6 : "modal_mypage_request",
    pathname_modal_7 : "modal_mypage_entire",
    pathname_modal_8 : "modal_mypage_use_yakwan",
    pathname_modal_8_2 : "modal_mypage_use_yakwan2",
    pathname_modal_9 : "modal_mypage_use_policy",
    pathname_modal_9_2 : "modal_mypage_use_policy2",
    pathname_modal_12_2 : "modal_mypage_mingam",
    pathname_modal_10 : 'modal_mypage_profile',
    pathname_modal_11 : 'modal_signup_agree',
    pathname_modal_20 : 'drawer_history',
    pathname_modal_21 : 'drawer_signup',
    pathname_modal_21_2 : 'drawer_signup2',
    chatAnswerType,
    error_message_500 : '일시적인 문제가 발생하였습니다. 잠시 후 사용해주세요.',
    error_message_404 : '일일 토큰 사용량이 최대치를 초과하였습니다.',
    error_message_10_second : "일시적인 문제가 발생하였습니다. 잠시 후 사용해주세요.",
    error_message_default : "일시적인 문제가 발생하였습니다. 잠시 후 사용해주세요."
}

export default contrants;