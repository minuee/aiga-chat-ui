'use client';
/*eslint-disable*/
import customfetch from '@/utils/customfetch';
import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { Box,Flex,Icon,Textarea,Text,useColorModeValue,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,useToast,useColorMode } from '@chakra-ui/react';
import ResizeTextarea from "react-textarea-autosize";
import { useEffect, useState,useRef } from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit, MdPerson,MdOutlineClose,MdArrowBack } from 'react-icons/md';
import DoctorDetail  from '@/components/modal/Doctor';
import SelectBody  from '@/components/msgType/SelectBody';
import SelectDoctor  from '@/components/msgType/SelectDoctor';
import RecommandDoctor  from '@/components/msgType/RecommandDoctor';
import SearchDoctor  from '@/components/msgType/SearchDoctor';
import SelectName  from '@/components/msgType/SelectName';
import ForceStop  from '@/components/msgType/ForceStop';
import ChatMeMessage from '@/components/msgType/ChatMeMessage';
import ChatWrongMessage from '@/components/msgType/ChatWrongMessage';
import GeneralMessage from "@/components/msgType/GeneralMessage";
import SimpleListMessage from '@/components/msgType/SimpleListMessage';
import Welcome  from '@/components/msgType/Welcome';
import { ChatDisable,ChatWarningInfo }  from '@/components/msgType/ChatOptionView';
import MotionWelcome,{MotionWelcomeImage}  from '@/components/msgType/MotionWelcome';
import Processing  from '@/components/msgType/Processing';
import SkeletonDefaultText from "@/components/fields/LoadingBar";


import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

import SelectType  from '@/components/msgType/SelectType';
import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";

import mConstants from '@/utils/constants';

import { ChatSystemMessageType } from "@/types/types";
//새창열기 전역상태
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore } from '@/store/newChatStore';
import historyStore from '@/store/historyStore';
import { 
  ModalDoctorDetailStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorListStore,DrawerHistoryStore,ModalMypageStore,ModalMypageNoticeStore,ModalMypageNoticeDetailStore,
  ModalMypageRequestStore,ModalMypageEntireStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageMingamStore,ModalSignupStoreStore,ModalSignupAgreeStoreStore,DoctorFromListStore
 } from '@/store/modalStore';

import * as ChatService from "@/services/chat/index";
import { SendButtonOff,SendButtonOn } from '@/components/icons/svgIcons';
//import SendButtonOff from "@/assets/icons/send_btn_off.png";
//import SendButtonOn from "@/assets/icons/send_btn_on.png";
import LogoImage from "@/assets/images/logo.png";

export default function ChatBot() {
  const t = useTranslations('Messages');
  const { colorMode, toggleColorMode } = useColorMode();
  const alreadyInitialized = useRef(false);
  // Input States
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [isShowScroll, setShowScroll] = useState(false);
  const [isReceiving, setReceiving] = useState(false);
  const toast = useToast();
  // Response message
  const [outputCode, setOutputCode] = useState<any>([]);
  // ChatGPT model
  const [isChatDisabled, setChatDisabled] = useState<any>({
    isState :  true,
    isAlertMsg : false 
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');

  /* chat에 관련된 상태관리 */
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
  const setChatSessionId = ChatSesseionIdStore((state) => state.setChatSessionId);
  const oldHistoryData = CallHistoryDataStore(state => state.historyData);
  const setOldHistoryData = CallHistoryDataStore((state) => state.setOldHistoryData);

  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
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
  
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const themeColor = useColorModeValue('white', 'navy.900');
  
  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'white');
  const textSystemColor = useColorModeValue('#212127', 'navy.800');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const isSystemText = ["system_text","system_doctors","system_list","system_select","system_image"];
  
  /* useEffect(() => {
    console.log("chatSessionId Top",chatSessionId)
    if ( functions.isEmpty(chatSessionId) ) {
      getNewSessionID();
    }
    return () => setChatSessionId('');
  }, []); */

  const firstForceStep = () => {
    setChatSessionId('')
    setIsOpenReview(false)
    setIsOpenDoctorDetailModal(false);
    setOpenHistoryDrawer(false);
    setIsOpenRequestModal(false);
    setOpenDoctorListModal(false);
    setIsOpenSetupModal(false);
    setIsOpenNoticeListModal(false);
    setIsOpenDoctorDetailModal(false);
    setIsOpenMypageRequestModal(false);
    setIsOpenEntireModal(false);
    setIsOpenPolicyModal(false);
    setIsOpenYakwanModal(false);
    setIsOpenMingamModal(false);
    setIsOpenSignupModal(false);
    setIsOpenSignupAgreeModal(false);
    setOldHistoryData(null)
    setFromDoctorDepth2(false)
  }

  useEffect(() => {
    console.log("chatSessionId Top",chatSessionId)
    if (!alreadyInitialized.current) {
      console.log('🔥 최초 1회만 실행');
      firstForceStep();
      //getNewSessionID(); // ✅ 여기서만 실행됨
      alreadyInitialized.current = true;
      
      setTimeout(() => {
        setIsLoading(false);
        /* const msgLen = outputCode?.length;
        const sampleMsg1 = mConstants.sample_msg_3;
        setOutputCode((prevCode: any[]) => {
          const newArray = [...prevCode];
          const lastIndex = msgLen;
          newArray[lastIndex] = {
            ismode : 'server',
            id: sampleMsg1?.session_id,
            user_question : sampleMsg1?.question,
            answer : sampleMsg1?.answer,
            msg: sampleMsg1?.chat_type,
            used_token : sampleMsg1?.used_token
          };
          return newArray;
        }) */
      }, 300);
    }
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname; // 항상 최신값 유지
  }, [pathname]);

  const fn_close_modal_doctor_detail = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenDoctorModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      setCurrentPathname('');
      mCookie.setCookie('currentPathname','')
    }, 200);
  }

  const fn_close_modal_doctor_detail2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenDoctorDetailModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_1}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`);
    }, 200);
  }

  const fn_close_modal_doctor_review = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
    }, 200);
  }

  const fn_close_modal_doctor_review2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
    }, 200);
  }

  const fn_close_modal_doctor_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
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
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenDoctorListModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','');
    }, 200);
  }

  const fn_close_drawer_history = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenHistoryDrawer(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','') ;
    }, 200);
  }

  const fn_close_modal_mypage = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSetupModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_20}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_20}`);
    }, 200);
  }

  const fn_close_modal_notice_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenNoticeListModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`);
    }, 200);
  }

  const fn_close_modal_notice_detail = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenNoticeDetailModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_5}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5}`);
    }, 200);
  }

  const fn_close_modal_mypage_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenMypageRequestModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`);
    }, 200);
  }

  const fn_close_modal_mypage_entire = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenEntireModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_policy = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_policy2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

  const fn_close_modal_mypage_yakwan = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    window.alert(1)
    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
    }, 200);
  }

  const fn_close_modal_mypage_yakwan2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    window.alert(1)
    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

  const fn_close_modal_mypage_mingam2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    window.alert(1)
    setIsOpenMingamModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
    }, 200);
  }

  const fn_close_modal_user_login = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','')
    }, 200);
  }

  const fn_close_modal_user_login2 = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupModal(false);
    if ( isFromDoctorDepth2 ) {
      history.push(`/${locale}/chat#${mConstants.pathname_modal_3_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3_2}`) 
      }, 200);
    }else{
      history.push(`/${locale}/chat#${mConstants.pathname_modal_3}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3}`)  
      }, 200);
    }
  }

  const fn_close_modal_signup_agree = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupAgreeModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_21}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21}`) 
    }, 200);
  }

  useEffect(() => {
    const handlePopState = async(event: PopStateEvent) => {
      const currentPathname = await mCookie.getCookie('currentPathname')
      const currentPath = pathnameRef.current;
      // 특정 경로에서만 모달 닫기 또는 리디렉션 처리
      switch(currentPathname) {
        case `${mConstants.pathname_modal_1}` :
          event.preventDefault(); // modal_doctor_list 기본 뒤로가기 방지 
          fn_close_modal_doctor_list();
          break;
        case `${mConstants.pathname_modal_2}`:
        case '' : 
          event.preventDefault(); // modal_doctor_detail 기본 뒤로가기 방지
          fn_close_modal_doctor_detail2();
          fn_close_modal_doctor_detail();
          break;
        case `${mConstants.pathname_modal_2_2}` :
          event.preventDefault(); // modal_doctor_detail2 기본 뒤로가기 방지
          fn_close_modal_doctor_detail();
          fn_close_modal_doctor_detail2();
          break;
        case `${mConstants.pathname_modal_3}` :
          event.preventDefault(); // modal_doctor_review 기본 뒤로가기 방지
          fn_close_modal_doctor_review()
          break;
        case `${mConstants.pathname_modal_3_2}` :
          event.preventDefault(); // modal_doctor_review2 기본 뒤로가기 방지
          fn_close_modal_doctor_review2()
          break;
        case `${mConstants.pathname_modal_4}` : 
          event.preventDefault(); // modal_doctor_request 기본 뒤로가기 방지
          fn_close_modal_doctor_request();
          break;
        case `${mConstants.pathname_modal_20}` :
          event.preventDefault(); // drawer_history 기본 뒤로가기 방지
          fn_close_drawer_history()
          break;
        case `${mConstants.pathname_modal_21}` :
          event.preventDefault(); // drawer_signup 기본 뒤로가기 방지
          fn_close_modal_user_login()
          break;
        case `${mConstants.pathname_modal_21_2}` :
          event.preventDefault(); // drawer_signup2 기본 뒤로가기 방지
          fn_close_modal_user_login2()
          break;
        case `${mConstants.pathname_modal_10}` : 
          event.preventDefault(); // modal_mypage_profile 기본 뒤로가기 방지
          fn_close_modal_mypage();
          break;
        case `${mConstants.pathname_modal_5}` : 
          event.preventDefault(); // modal_mypage_notice 기본 뒤로가기 방지
          fn_close_modal_notice_list();
          break;
        case `${mConstants.pathname_modal_5_2}` : 
          event.preventDefault(); // modal_mypage_notice detail 기본 뒤로가기 방지
          fn_close_modal_notice_detail();
          break;
        case `${mConstants.pathname_modal_6}` : 
          event.preventDefault(); // modal_mypage_request 기본 뒤로가기 방지
          fn_close_modal_mypage_request();
          break;
        case `${mConstants.pathname_modal_7}` : 
          event.preventDefault(); // modal_mypage_entire 기본 뒤로가기 방지
          fn_close_modal_mypage_entire();
          break;
        case `${mConstants.pathname_modal_8}` : 
          event.preventDefault(); // modal_mypage_use_yakwan 기본 뒤로가기 방지
          fn_close_modal_mypage_yakwan();
          break;
        case `${mConstants.pathname_modal_8_2}` : 
          event.preventDefault(); // modal_mypage_use_yakwan 기본 뒤로가기 방지
          fn_close_modal_mypage_yakwan2();
          break;
        case `${mConstants.pathname_modal_9}` : 
          event.preventDefault(); // modal_mypage_use_policy 기본 뒤로가기 방지
          fn_close_modal_mypage_policy();
          break;
        case `${mConstants.pathname_modal_9_2}` : 
          event.preventDefault(); // modal_mypage_use_policy 기본 뒤로가기 방지
          fn_close_modal_mypage_policy2();
          break;
        case `${mConstants.pathname_modal_12_2}` : 
          event.preventDefault(); // modal_mypage_use_policy 기본 뒤로가기 방지
          fn_close_modal_mypage_mingam2();
          break;
        case `${mConstants.pathname_modal_11}` : 
          event.preventDefault(); // modal_signup_agree 기본 뒤로가기 방지
          fn_close_modal_signup_agree();
          break;
        default : 
          event.preventDefault(); // 무조건 기본 뒤로가기 방지 - 챗봇은 기본 루트 페이지이기 때문에 
      }
    };
    // popstate는 브라우저 뒤로가기, Android 백버튼에서 동작함
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // ✅ 한 번만 등록

  const getNewSessionID =  async() => {
    try{
      const res:any = await ChatService.getChatNewSession();
      console.log("getNewSessionID",res.data)
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        console.log("getNewSessionID res?.data?.session_id",res?.data?.session_id)
        setChatSessionId(res?.data?.session_id?.session_id)
        return res?.data?.session_id?.session_id
      }else{
        return null;
      }
    }catch(e:any){
      return null;
      console.log("error of getNewSessionID",e);
    }
  }

  useEffect(() => {
    console.log("chatbot.tsx ",isNewChat,outputCode.length)
    if ( isNewChat && outputCode.length > 0 ) {
      // 현 데이터를 히스토리에 넣는다 * 저장방식을 고민을 해야 한다 
      
      setChatSessionId('')
      setOutputCode([]);
      setChatDisabled({
        isState : true,
        isAlertMsg : false
      })
      setCurrentPathname('')
      mCookie.setCookie('currentPathname','')
      firstForceStep();
      setTimeout(() => {
        setNewChatOpen(false);
      }, 1000);
    }
  }, [isNewChat]);

  useEffect(() => {
    console.log("oldHistoryData",oldHistoryData)
    if ( !functions.isEmpty(oldHistoryData) ) {
      if ( !functions.isEmpty(oldHistoryData?.session_id) ) {
        setChatSessionId(oldHistoryData?.session_id)
        setOutputCode(oldHistoryData?.chattings);
        setChatDisabled({
          isState : true,
          isAlertMsg : false
        })
        fn_close_drawer_history();
        setOldHistoryData(null)
      }
    }
  }, [oldHistoryData]);
  /* 대화 불능 상태 컨트롤 */
  useEffect(() => {
    console.log('outputCode,chatSessionId chatSessionId',chatSessionId,outputCode.length, mConstants.userMaxToken)
    /* if ( functions.isEmpty(chatSessionId) ) {
      console.log('outputCode,chatSessionId chatSessionId if')
      if ( functions.isEmpty(chatSessionId) ) {
        setChatDisabled({
          isState : false,
          isAlertMsg : false,
        })
      }
    }else */ 
    if ( outputCode.length == mConstants.userMaxToken && !functions.isEmpty(chatSessionId)) {
      console.log('outputCode,chatSessionId chatSessionId else')
      setChatDisabled({
        isState : false,
        isAlertMsg : false
      })
    }else if (  outputCode.length < mConstants.userMaxToken && !functions.isEmpty(chatSessionId) ) {
      setChatDisabled({
        isState : true,
        isAlertMsg : true
      })
    }
  }, [outputCode,chatSessionId]);
  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaX !== 0) return;
      setShowScroll((prev) => {
        const goingUp = e.deltaY < 0;
        const shouldUpdate = goingUp !== prev;
        if (shouldUpdate) {
          return !prev;
        }
        return prev;
      });
    };

    el.addEventListener("wheel", handleWheel);
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // 스크롤을 맨 아래로 내리는 함수
  const scrollToBottom = () => {
    const el = scrollBottomRef.current;
    if (el) {
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setShowScroll(false)
    }
  };

  const onHandleStopInquiry = async() => {
    try{
      if ( !functions.isEmpty(chatSessionId)  ) {
        const res:any = await ChatService.setRequestStop(chatSessionId);     
      }
    }catch(e:any){
      setReceiving(false)
    }
  }
  const onHandleStopRequest = async() => {
    await onHandleStopInquiry();
    const forceMsg = "대답이 중지되었습니다."
    setReceiving(false);
    setIsLoading(false)
    setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }]);
  }


  const handleTranslate = async( isText:any = '') => {
   
    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    
    console.log("handleTranslate chatSessionId", chatSessionId)
    let chat_sessinn_id = chatSessionId;
    if ( functions.isEmpty(chat_sessinn_id)) {
      chat_sessinn_id = await getNewSessionID();
    }

    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    //고혈압 치료를 잘하는 의사를 소개해줘
    if ( isSystemText.includes(inputCodeText) ) {
      if( inputCodeText != outputCode[outputCode?.length -1]?.msg) { 
        setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }]);
        setIsLoading(false);
        setReceiving(false);
        return;
      }else{
        setIsLoading(false);
        setReceiving(false);
        return;
      }
    }else{
      setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(),ismode: "me", msg: inputCodeText }]);
    }
    setInputCode('')
    try{
      const questionResult:any = await ChatService.getChatMessage(chat_sessinn_id,inputCodeText);
      console.log("handleTranslate questionResult",questionResult)
      if ( mConstants.apiSuccessCode.includes(questionResult?.statusCode) ) {
        const answerMessage = questionResult?.data
        setIsLoading(false);
        setReceiving(false);
        setOutputCode((prevCode: any[]) => {
          const newArray = [...prevCode];
          const lastIndex = msgLen;
          newArray[lastIndex] = {
            ismode : 'server',
            id: answerMessage?.chat_id,
            user_question : answerMessage?.question,
            answer : answerMessage?.answer,
            msg: answerMessage?.chat_type,
            used_token : answerMessage?.used_token
          };
          return newArray;
        })
      }else{
        setOutputCode((prevCode: any[]) => {
          const newArray = [...prevCode];
          const lastIndex = msgLen;
          newArray[lastIndex] = {
            ismode : 'system',
            id: functions.getUUID(),
            user_question : inputCodeText,
            answer : null,
            msg: `${inputCodeText}의 대한 답변`,
            used_token : 0
          };
          return newArray;
        })
      }
    }catch(e:any){
      console.log("handleTranslate error",e);
      setIsLoading(false);
      setReceiving(false);
    }
 
  }

  const handleTranslate_origin = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    
    console.log("handleTranslate chatSessionId", chatSessionId)
    let chat_sessinn_id = chatSessionId;
    if ( functions.isEmpty(chat_sessinn_id)) {
      chat_sessinn_id = await getNewSessionID();
    }

    
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    
    if ( isSystemText.includes(inputCodeText) ) {
      if( inputCodeText != outputCode[outputCode?.length -1]?.msg) { 
        setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }]);
        setIsLoading(false);
        setReceiving(false);
        return;
      }else{
        setIsLoading(false);
        setReceiving(false);
        return;
      }
    }else{
      setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(),ismode: "me", msg: inputCodeText }]);
    }
    setInputCode('')

    const BaseAPI = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
    const url = `${BaseAPI}/chat`;
 
    const payload = {
      "user_id": "minuee",
      "msg_type": isText,
      "msg": inputCodeText
    }

    const response = await customfetch.callAPI(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      credentials: 'include',
      body: JSON.stringify(payload)
    }, 10000);

    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    let streamData:string = "";
    while (true ) {
      const { value, done } : any = await reader?.read();
    
      if (done) {
        setTimeout(() => {
          setIsLoading(false);
          setReceiving(false);
        },3000)
        
        console.log('🔚 스트림 종료됨');
        break;
      }
    
      const chunk = decoder.decode(value, { stream: true });
      console.log('📥 받은 메시지:', chunk);
     
      if ( chunk ) {
        streamData = streamData.concat(chunk);
      }else{
        console.error('data가 null입니다. getReader를 호출할 수 없습니다.');
      }

      setOutputCode((prevCode: any[]) => {
       
        const newArray = [...prevCode];
        const lastIndex = msgLen;
        if ( !newArray[lastIndex]?.msg ) {
          newArray[lastIndex] = {
            id: functions.getUUID(),
            ismode : 'server',
            msg:chunk,
          };
        }else{
          const tmpMsg = prevCode[lastIndex].msg;
          newArray[lastIndex] = {
            ...prevCode[lastIndex],
            msg: tmpMsg.concat(chunk)
          };
        }
        return newArray;
      });
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowScroll(false)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, outputCode?.ismode == "me" ? 0 : 300); // or 100ms 정도로 조정 가능
    return () => clearTimeout(timeout);
  }, [outputCode]);

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const onSendButton = async( str : string) => {
    if ( !isReceiving) await handleTranslate(str);
  }

  const onSendWelcomeButton = async( str : string) => {
    if ( !isReceiving ) await handleTranslate(str);
  }

  const onSendDoctorButton = async( data : any,isType : number) => {
    setSelectedDoctor(data);
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_2}`);
    setCurrentPathname(`${mConstants.pathname_modal_2}`)
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)
    setIsOpenDoctorModal(true);
  }

  const onSendNameButton = async( str : string) => {
    if ( !isReceiving ) await handleTranslate(str);
  }

  const onSendTypeButton = async( typeString : string ) => {
    if ( !isReceiving ) await handleTranslate(typeString);
  }
  
  if (isLoading) {
    return (
      <SkeletonDefaultText isOpen={isLoading} lineNum={10} />
    )
  }
  return (
    <Flex top={"35px"} w={'100%'} maxWidth={`${mConstants.desktopMinWidth}px`} direction="column" position="relative">
      <Flex direction="column" w={'100%'} maxWidth={`${mConstants.desktopMinWidth}px`} overflowY='scroll'>
        <Flex
          direction="column" w="100%" maxWidth={`${mConstants.desktopMinWidth}px` }
          maxH="calc(100vh - 100px)" /* 여기가 하단 스크롤 영역 영향 받음 */
          minH="calc(100vh - 100px)" overflowY='auto' display={outputCode ? 'flex' : 'none'} ref={scrollRef}
        >
          <Box display={outputCode?.length == 0 ? 'flex' : 'none'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}  paddingTop={{base : "70px", md : "60px"}} >
            {/* <Welcome 
              msg={`${t("welcome_msg",{app_name:"AIGA"})}`}
              onSendButton={onSendButton}
            /> */}
            <MotionWelcomeImage
              pt="20px"
            />
            <MotionWelcome 
              msg={`안녕하세요!`}
              pt="30px"
              classNames={colorMode == "light" ? "opening_box" : "opening_box_dark"}
            />
            <MotionWelcome 
              msg={`맞춤형 의사추천 챗봇 AIGA입니다.`}
              pt="10px"
              classNames={colorMode == "light" ? "opening_box" : "opening_box_dark"}
            />
            <MotionWelcome 
              msg={`어디가 아프거나 불편하신가요?`}
              pt="10px"
              classNames="opening_box_gray"
            />
          </Box>
          <Box>
            <SelectType 
              onSendButton={onSendTypeButton}
              isDevelope={false}
            />
          </Box>
          { 
            outputCode.map((element:any,index:number) => {
              if ( element.ismode == 'me') {
                return (
                  <Box key={index}>
                    <ChatMeMessage
                      indexKey={index}
                      msg={element.msg}
                    />
                  </Box>
                )
              }else if ( element.ismode == 'server') {
                if ( element.msg === "recommand_doctor" ) {
                  return (
                    <Box key={index}>
                      <RecommandDoctor 
                        data={element}
                        onSendButton={onSendDoctorButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "search_doctor" ) {
                  return (
                    <Box key={index}>
                      <SearchDoctor 
                        data={element}
                        onSendButton={onSendDoctorButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "recommand_hospital" ) {
                  return (
                    <Box key={index}>
                      <Flex w="100%" key={index}>
                        <SimpleListMessage 
                          indexKey={index}
                          msg={element.answer} 
                        />
                      </Flex>
                    </Box>
                  )
                }else if ( element.msg === "general" ) {
                  return (
                    <Box key={index}>
                      <Flex w="100%" key={index}>
                        <GeneralMessage output={element.answer.replaceAll('\n','<br />')} />
                      </Flex>
                    </Box>
                  )
                }else {
                  return (
                    <ChatWrongMessage
                      indexKey={index}
                      msg={'흠..뭔가 잘못된 것 같습니다'}
                    />
                  )
                }
              }else if ( element.ismode == 'system_stop') {
                return (
                  <ForceStop
                    indexKey={index}
                    msg={element.msg}
                  />
                )
              }else if ( element.ismode == 'system') {
                if ( element.msg === "system_doctors" ) {
                  return (
                    <Box key={index}>
                      <SelectDoctor 
                        onSendButton={onSendDoctorButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "system_list" ) {
                  return (
                  <Box key={index}>
                    <SelectName 
                      data={[]}
                      onSendButton={onSendNameButton}
                    /> 
                  </Box>
                  )
                }else if ( element.msg === "system_select" ) {
                  return (
                    <Box key={index}>
                      <Welcome 
                        msg={`안녕하세요? 건강AI AIGA에요\r\n누가 아프신가요?`}
                        onSendButton={onSendButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "system_image" ) {
                  return (
                    <Box key={index}>
                      <SelectBody 
                        onSendButton={onSendWelcomeButton}
                      />
                    </Box>
                  )
                }else {
                  return (
                    <ChatWrongMessage
                      indexKey={index}
                      msg={'흠..뭔가 잘못된 것 같습니다'}
                    />
                  )
                }
              }else{
                return (
                  <Flex w="100%" key={index} mb="10px">
                    <Flex
                      borderRadius="full" justify="center" align="center" me="10px" h="40px" minH="40px"minW="40px"
                      bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                    >
                      <Icon as={MdFitbit} width="20px" height="20px" color="white" />
                    </Flex>
                    <MessageBoxChat output={element.msg} />
                  </Flex>
                )
              }
            })
          }
          { isReceiving && ( <Box><Processing  msg="증상 분석중" /></Box> ) }
          { isShowScroll &&  
            (
              <Box
                position={'absolute'} right="10px" bottom={{base : "100px", md:"50px"}} width="50px" height={"50px"}
                zIndex={10} display={'flex'} justifyContent='center' alignItems={'center'}onClick={()=> scrollToBottom()}
              >
                <Icon as={MdOutlineArrowDownward} width="40px" height="40px" color={navbarIcon} />
              </Box>
            )
          }
          <Box ref={scrollBottomRef} h="1px" pb={"30px"} />
        </Flex>
        <Flex position="fixed" bottom="0" left="0" w="100%" px="20px" py="10px" bg={themeColor} zIndex="100" display={'flex'} justifyContent='center'>
          <Box 
            w={{ base: '100%', md: `${mConstants.desktopMinWidth-20}px` }} maxWidth={`${mConstants.desktopMinWidth}px` }
            position={'relative'} display={'flex'} flexDirection={'row'}
          >
            {
              ( !isChatDisabled?.isState && !isChatDisabled?.isAlertMsg && !functions.isEmpty(chatSessionId)) && (
                <ChatDisable
                  isChatDisabled={isChatDisabled}
                  setChatDisabled={setChatDisabled}
                />
              )
            }
            { isFocus && ( <ChatWarningInfo /> )}
            <Textarea
              minH="50px"
              //minH="unset"
              resize="none"
              as={ResizeTextarea}
              h="100%"
              maxH="120px"
              border="1px solid"
              borderColor={borderColor}
              bg={isFocus ? 'transparent' :'#f4f6fa'}
              readOnly={isReceiving}
              maxLength={mConstants.inputMaxMessage}
              borderRadius="20px"
              lineHeight={"140%"}
              //me="10px"
              fontSize="md"
              fontWeight="500"
              _focus={{ borderColor: 'none' }}
              color={inputColor}
              _placeholder={placeholderColor}
              value={inputCode}
              placeholder="메시지 입력"
              onChange={handleChange}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              id={"textarea_content"}
              disabled={!isChatDisabled?.isState}
            />
            <Box display={'flex'} position={'absolute'} bottom={'-2px'} right={'10px'} w={'55px'} height={'55px'} justifyContent={'flex-end'} alignItems={'center'}>
              {
                isReceiving
                ?
                <Box onClick={() => onHandleStopRequest()}>
                  <Image src={LoadingBar} alt="LoadingBar" style={{width:'30px', height:'30px'}} /> 
                </Box>
                :
                <Box
                  zIndex={444}
                  onClick={() => { 
                    if ( !isReceiving ) {
                      handleTranslate(inputCode);
                    }else {
                      toast({
                        title: 'AIGA',
                        position: 'top-right',
                        description: '수신중입니다. 잠시만 기달주세요',
                        status: 'info',
                        containerStyle: {
                          color: '#ffffff',
                        },
                        duration: 2000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                {
                  isFocus 
                  ?
                  <SendButtonOn boxSize={'32px'} />
                  :
                  <SendButtonOff boxSize={'32px'} />
                }
                </Box>
              }
            </Box>
          </Box>
        </Flex>
        {
          isOpenDoctorModal && (
            <Modal
              onClose={() => fn_close_modal_doctor_detail()}
              isOpen={isOpenDoctorModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'}
                      left={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_detail()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomTextBold700 color={'white'} noOfLines={1}>{selectedDoctor?.name} 의사</CustomTextBold700>
                    </Box>
                    <Box 
                      position={'absolute'}
                      right={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_detail()}  cursor={'pointer'}
                     >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody padding="basePadding" margin="0">
                  <DoctorDetail
                    selected_doctor={selectedDoctor}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
      </Flex>
    </Flex>
  );
}