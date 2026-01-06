
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import mConstants from '@/utils/constants';
import { push } from '@/utils/history';

import {
  ModalDoctorDetailStore, ModalDoctorReviewStore, ModalDoctorRequestStore, ModalDoctorListStore, DrawerHistoryStore, ModalMypageStore, ModalMypageNoticeStore, ModalMypageNoticeDetailStore,
  ModalMypageRequestStore, ModalMypageEntireStore, ModalMypagePolicyStore, ModalMypageYakwanStore, ModalMypageMingamStore, ModalSignupStoreStore, ModalSignupAgreeStoreStore, DoctorFromListStore
} from '@/store/modalStore';
import historyStore from '@/store/historyStore';

export const useChatModals = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setCurrentPathname = historyStore((state) => state.setCurrentPathname);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const setIsOpenNoticeDetailModal = ModalMypageNoticeDetailStore((state) => state.setIsOpenNoticeDetailModal);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);
  const setIsOpenPolicyModal = ModalMypagePolicyStore((state) => state.setIsOpenPolicyModal);
  const setIsOpenYakwanModal = ModalMypageYakwanStore((state) => state.setIsOpenYakwanModal);
  const setIsOpenMingamModal = ModalMypageMingamStore((state) => state.setIsOpenMingamModal);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal)
  const setIsOpenSignupAgreeModal = ModalSignupAgreeStoreStore((state) => state.setIsOpenSignupAgreeModal)

  const fn_close_modal_doctor_detail = async () => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko';
    setIsOpenDoctorDetailModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      setCurrentPathname('');
      mCookie.setCookie('currentPathname', '')
    }, 200);
  }

  const fn_close_modal_doctor_detail2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenDoctorDetailModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_1}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`);
    }, 200);
  }

  const fn_close_modal_doctor_review = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
    }, 200);
  }

    const fn_close_modal_doctor_review2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
    }, 200);
  }

  const fn_close_modal_doctor_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenRequestModal(false);
    if ( isFromDoctorDepth2 ) {
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)
      }, 200);
    }else{
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)
      }, 200);
    }
  }

  const fn_close_modal_doctor_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setOpenDoctorListModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','');
    }, 200);
  }

  const fn_close_drawer_history = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setOpenHistoryDrawer(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','') ;
    }, 200);
  }

  const fn_close_modal_mypage = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenSetupModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_20}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_20}`);
    }, 200);
  }

  const fn_close_modal_notice_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenNoticeListModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`);
    }, 200);
  }

  const fn_close_modal_notice_detail = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenNoticeDetailModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_5}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5}`);
    }, 200);
  }

  const fn_close_modal_mypage_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenMypageRequestModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`);
    }, 200);
  }

  const fn_close_modal_mypage_entire = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenEntireModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_policy = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_policy2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

  const fn_close_modal_mypage_yakwan = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_yakwan2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 

    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

    const fn_close_modal_mypage_mingam2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenMingamModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

  const fn_close_modal_user_login = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenSignupModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','')
    }, 200);
  }

  const fn_close_modal_user_login2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenSignupModal(false);
    if ( isFromDoctorDepth2 ) {
      push(`/${locale}/chat#${mConstants.pathname_modal_3_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3_2}`) 
      }, 200);
    }else{
      push(`/${locale}/chat#${mConstants.pathname_modal_3}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3}`)  
      }, 200);
    }
  }

  const fn_close_modal_signup_agree = async() => {
    const locale = await mCookie.getCookie('currentLocale') || 'ko'; 
    setIsOpenSignupAgreeModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_21}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21}`) 
    }, 200);
  }


  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handlePopState = async (event: PopStateEvent) => {
      event.preventDefault();
      const currentPathname = await mCookie.getCookie('currentPathname');

      switch (currentPathname) {
        case `${mConstants.pathname_modal_1}`:
          fn_close_modal_doctor_list();
          break;
        case `${mConstants.pathname_modal_2}`:
        case '':
          fn_close_modal_doctor_detail();
          break;
        case `${mConstants.pathname_modal_2_2}`:
            fn_close_modal_doctor_detail2();
          break;
        case `${mConstants.pathname_modal_3}`:
          fn_close_modal_doctor_review();
          break;
        case `${mConstants.pathname_modal_3_2}`:
            fn_close_modal_doctor_review2();
            break;
        case `${mConstants.pathname_modal_4}`:
          fn_close_modal_doctor_request();
          break;
        case `${mConstants.pathname_modal_20}`:
          fn_close_drawer_history();
          break;
        case `${mConstants.pathname_modal_21}`:
            fn_close_modal_user_login();
            break;
        case `${mConstants.pathname_modal_21_2}`:
            fn_close_modal_user_login2();
            break;
        case `${mConstants.pathname_modal_10}`:
            fn_close_modal_mypage();
            break;
        case `${mConstants.pathname_modal_5}`:
            fn_close_modal_notice_list();
            break;
        case `${mConstants.pathname_modal_5_2}`:
            fn_close_modal_notice_detail();
            break;
        case `${mConstants.pathname_modal_6}`:
            fn_close_modal_mypage_request();
            break;
        case `${mConstants.pathname_modal_7}`:
            fn_close_modal_mypage_entire();
            break;
        case `${mConstants.pathname_modal_8}`:
            fn_close_modal_mypage_yakwan();
            break;
        case `${mConstants.pathname_modal_8_2}`:
            fn_close_modal_mypage_yakwan2();
            break;
        case `${mConstants.pathname_modal_9}`:
            fn_close_modal_mypage_policy();
            break;
        case `${mConstants.pathname_modal_9_2}`:
            fn_close_modal_mypage_policy2();
            break;
        case `${mConstants.pathname_modal_12_2}`:
            fn_close_modal_mypage_mingam2();
            break;
        case `${mConstants.pathname_modal_11}`:
            fn_close_modal_signup_agree();
            break;
        default:
          // In case of undefined/unhandled path, maybe go to a default state
          fn_close_drawer_history();
          break;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Re-run if any of the close functions change, which they won't.

  return {
    // You can return any state or functions that the component might need
  };
};
