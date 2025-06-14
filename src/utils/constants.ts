export const apiSuccessCode = [200,201,202,203,300,301,302]

export const sungwonjungThumb = [
  {
    idx : 1,
    name : '서브 안내 1',
  },
  {
    idx : 2,
    name : '서브 안내 2',
  },
  {
    idx : 3,
    name : '서브 안내 3',
  },
  {
    idx : 4,
    name : '서브 안내 4',
  }
]

const contrants  = {
  defaultColor : '#6c62d1',
  projectTitle : 'AIGA WEB',
  popDetailSizeRule1 : 1024,// 멀티뷰 최소너비 기준지점
  popDetailSizeRule2 : '800px',//멀티뷰최소너비
  popDetailSizeRule3 : '80%',//  멀티뷰 최소너비 이상일때 너비 비율
  popDetailSizeRule4 : '700px',// 싱글뷰 기준 너비
  rightFixedWidth : '550px',
  limitToken : 10, //주문조회리스트 하이라이트 기준주문금액
  sidebarWidth: 86,
  headerHeight: 56,
  mobileSidebarWidth: 0,
  mobileHeaderHeight: 60,
  modalMaxWidth : 640,
  desktopMinWidth : 640,
  nickNameAbleString : /^[가-힣a-zA-Z0-9_]+$/,
  apiSuccessCode,
  pathname_modal_1 : "modal_doctor_list",
  pathname_modal_2 : "modal_doctor_detail",
  pathname_modal_2_2 : "modal_doctor_detail2",
  pathname_modal_3 : "modal_doctor_review",
  pathname_modal_3_2 : "modal_doctor_review2",
  pathname_modal_4 : "modal_doctor_request",
  pathname_modal_5 : "modal_mypage_notice",
  pathname_modal_6 : "modal_mypage_request",
  pathname_modal_7 : "modal_mypage_entire",
  pathname_modal_8 : "modal_mypage_use_yakwan",
  pathname_modal_9 : "modal_mypage_use_policy",
  pathname_modal_10 : 'modal_mypage_profile',
  pathname_modal_20 : 'drawer_history'
}

export default contrants;
