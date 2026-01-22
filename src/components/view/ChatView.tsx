'use client';

import functions from '@/utils/functions';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Flex, Icon, Textarea, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useColorMode, useToast } from '@chakra-ui/react';
import ResizeTextarea from "react-textarea-autosize";
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit, MdOutlineClose, MdArrowBack } from 'react-icons/md';
import DoctorDetail from '@/components/modal/Doctor';
import RecommandDoctor from '@/components/msgType/RecommandDoctor';
import SearchDoctor from '@/components/msgType/SearchDoctor';
import ForceStop from '@/components/msgType/ForceStop';
import ChatMeMessage from '@/components/msgType/ChatMeMessage';
import ChatWrongMessage from '@/components/msgType/ChatWrongMessage';
import GeneralMessage from "@/components/msgType/GeneralMessage";
import SimpleListMessage from '@/components/msgType/SimpleListMessage';
import { ChatDisable, ChatWarningInfo } from '@/components/msgType/ChatOptionView';
import MotionWelcome, { MotionWelcomeImage } from '@/components/msgType/MotionWelcome';
import Processing from '@/components/msgType/Processing';
import SkeletonDefaultText from "@/components/fields/LoadingBar";
import { CustomTextBold700 } from "@/components/text/CustomText";
import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import mConstants from '@/utils/constants';

import { SendButtonOff, SendButtonOn } from '@/components/icons/svgIcons';
import { useChatCore } from '@/hooks/useChatCore';
import { useChatModals } from '@/hooks/useChatModals';
import * as mCookie from "@/utils/cookies";
import history from "@/utils/history";
import historyStore from "@/store/historyStore";
import { ModalDoctorDetailStore, ModalDoctorReviewStore, ModalDoctorRequestStore, ModalDoctorListStore, DrawerHistoryStore, ModalMypageStore, ModalMypageNoticeStore, ModalMypageNoticeDetailStore, ModalMypageRequestStore, ModalMypageEntireStore, ModalMypagePolicyStore, ModalMypageYakwanStore, ModalMypageMingamStore, ModalSignupStoreStore, ModalSignupAgreeStoreStore, DoctorFromListStore, ReviewAlertStore } from "@/store/modalStore";

const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 60;

interface ChatViewProps {
    mobileContentScrollHeight?: number;
    mobileKeyboardOffset?: number;
    isKeyboardOpenSafari?: boolean;
    isKeyboardOpen?: boolean;
    isMobile?: boolean;
    isMobileSafari?: boolean;
}

export default function ChatView({ 
    mobileContentScrollHeight = 0, 
    mobileKeyboardOffset = 0, 
    isKeyboardOpenSafari = false, 
    isKeyboardOpen = false, 
    isMobile = false,
    isMobileSafari = false
}: ChatViewProps) {
    const t = useTranslations('Messages');
    const { colorMode } = useColorMode();
    const pathname = usePathname();
    
    useChatModals();
    const {
        inputCode, setInputCode, isReceiving, setReceiving, isThinkingDeeply, hasSent, setHasSent,
        realOutputCode, isChatDisabled, setChatDisabled, handleTranslate, debouncedStopRequest, userBaseInfo, firstForceStep
    } = useChatCore();
    
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isComposing, setIsComposing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isShowScroll, setShowScroll] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
    const [isZooming, setIsZooming] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollBottomRef = useRef<HTMLDivElement>(null);
    const pathnameRef = useRef(pathname);
    const mobileContentRef = useRef<HTMLDivElement>(null);
    
    const { setCurrentPathname } = historyStore(state => state);
    const { setOpenDoctorListModal } = ModalDoctorListStore(state => state);
    const { setModalState: setIsOpenReview } = ModalDoctorReviewStore(state => state);
    const { setModalState: setIsOpenRequestModal } = ModalDoctorRequestStore(state => state);

    // Theme colors
    const navbarIcon = useColorModeValue('#000000', 'navy.800');
    const borderColor = useColorModeValue('gray.200', 'gray');
    const inputColor = useColorModeValue('navy.700', 'white');
    const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
    const themeColor = useColorModeValue('#ffffff', 'navy.800');
    const borderTopColor = useColorModeValue('#E9EDF3', 'navy.800');
    const textareaBgcolor1 = useColorModeValue('#ffffff', 'navy.800');
    const textareaBgcolor2 = useColorModeValue('#f4f6fa', 'navy.800');
    const placeholderColor = useColorModeValue({ color: 'gray.500' }, { color: 'gray' });
    let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');

    const handleForceBlur = () => textareaRef.current?.blur();

    const scrollToBottom = () => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const debouncedSend = useCallback(debounce(() => {
        if (!isReceiving && !hasSent) {
            handleTranslate(functions.removeTrailingNewlines(inputCode));
        }
    }, 100), [inputCode, isReceiving, hasSent, handleTranslate]);

    const handleSendMessage = () => debouncedSend();
    
    const onHandleTypeDone = () => {
        if(isReceiving) setReceiving(false);
        setIsFocus(false);
    };
    
    const onSendDoctorButton = async (data: any) => {
        setSelectedDoctor(data);
        const currentPath = pathnameRef?.current || '';
        history?.push(`${currentPath}#${mConstants.pathname_modal_2}`);
        setCurrentPathname(`${mConstants.pathname_modal_2}`);
        mCookie.setCookie('currentPathname', `${mConstants.pathname_modal_2}`);
        setOpenDoctorListModal(false);
        setIsOpenReview(false);
        setIsOpenRequestModal(false);
        setIsOpenDoctorModal(true);
    };
    
    const router = useRouter();
    const { isFromDoctorDepth2, setFromDoctorDepth2 } = DoctorFromListStore(state => state);
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
    const setOpenAlert = ReviewAlertStore((state) => state.setIsOpenReviewLoginAlert);

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
      setIsOpenYakwanModal(false);
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`) 
      }, 200);
    }
  
    const fn_close_modal_mypage_yakwan2 = async() => {
      const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
  
      setIsOpenYakwanModal(false);
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`) 
      }, 200);
    }
  
    const fn_close_modal_mypage_mingam2 = async() => {
      const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
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
        history?.push(`/${locale}/chat#${mConstants.pathname_modal_3_2}`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3_2}`) 
        }, 200);
      }else{
        history?.push(`/${locale}/chat#${mConstants.pathname_modal_3}`);
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

    useEffect(()=> {
        firstForceStep();
        setIsLoading(false);
    },[firstForceStep])




    useEffect(() => {
        const el = scrollRef.current || mobileContentRef.current;
        if (!el) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            setShowScroll(scrollHeight - scrollTop > clientHeight + 50);
        };
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if(realOutputCode.length > 0 && !isReceiving) {
            setTimeout(scrollToBottom, 300);
        }
    }, [realOutputCode, isReceiving]);

    useEffect(() => {
        if (!isMobileSafari || !window.visualViewport) return;
    
        const handleZoom = () => {
          const scale = window.visualViewport?.scale ?? 1;
          setIsZooming(scale !== 1);
        };
    
        window.visualViewport.addEventListener("resize", handleZoom);
        window.visualViewport.addEventListener("scroll", handleZoom);
        handleZoom();
    
        return () => {
          window.visualViewport?.removeEventListener("resize", handleZoom);
          window.visualViewport?.removeEventListener("scroll", handleZoom);
        };
    }, [isMobileSafari]);


    const renderMessage = (element: any, index: number) => {
        switch (element.ismode) {
            case 'me':
                return <ChatMeMessage key={index} indexKey={index} question={element.question} />;
            case 'server':
                const summary = !functions.isEmpty(element?.summary) ? functions.cleanEscapedCharacters(element.summary.replace(/^"(.*)"$/, '$1').replaceAll(/"/g, '')) : "";
                switch (element.chat_type) {
                    case "recommand_doctor":
                    case "search_doctor":
                        return <RecommandDoctor key={index} data={element} summary={summary} isHistory={element?.isHistory} onSendButton={onSendDoctorButton} isLiveChat={element.isLiveChat} setIsTypingDone={onHandleTypeDone} />;
                    case "recommand_hospital":
                        return <SimpleListMessage key={index} indexKey={index} isHistory={element?.isHistory} msg={element.answer} isLiveChat={element.isLiveChat} setIsTypingDone={onHandleTypeDone} summary={summary} />;
                    case "general":
                        return <GeneralMessage key={index} output={functions.cleanEscapedCharacters(element.answer.replace(/^"(.*)"$/, '$1').replaceAll(/"/g, ''))} isHistory={element?.isHistory} setIsTypingDone={onHandleTypeDone} isLiveChat={element.isLiveChat} />;
                    default:
                        return <ChatWrongMessage key={index} indexKey={index} isMode="system" msg={mConstants.error_message_default} />;
                }
            case 'system_stop':
                return <ForceStop key={index} indexKey={index} msg={element.msg} />;
            case 'system':
            case 'system_400':
                return <ChatWrongMessage key={index} indexKey={index} isMode={element.ismode} msg={element.msg || mConstants.error_message_default} />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return <SkeletonDefaultText isOpen={isLoading} lineNum={10} />;
    }

    if (isMobile) {
        return (
            <>
                <Box
                    position={'absolute'}
                    top={`${MOBILE_HEADER_HEIGHT}px`}
                    width={'100%'}
                    height={`${mobileContentScrollHeight}px`}
                    overflow={'hidden'}
                    bg={themeColor}
                >
                    <Box
                        ref={mobileContentRef}
                        height="100%"
                        width="100%"
                        overflowY="auto"
                        style={{ overscrollBehavior: 'contain' }}
                    >
                        <Flex w={'100%'} px='basePadding' direction="column" minH="100%">
                            {realOutputCode?.length === 0 ? (
                                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' flex={1} pt="40px">
                                    <MotionWelcomeImage isMobile={true} pt="0" />
                                    <MotionWelcome msg="안녕하세요!" pt="30px" classNames="opening_box" isMobile={true} />
                                    <MotionWelcome msg="맞춤형 의사추천 챗봇 AIGA입니다." pt="10px" classNames="opening_box" isMobile={true} />
                                    <MotionWelcome msg="어디가 아프거나 불편하신가요?" pt="10px" classNames="opening_box_gray" isMobile={true} />
                                </Box>
                            ) : (
                                realOutputCode.map(renderMessage)
                            )}
                            {isReceiving && <Processing msg={isThinkingDeeply ? "🤔 깊게 생각 중… 조금만 기다려 주세요" : "분석중"} />}
                            <Box ref={scrollBottomRef} h="1px" />
                        </Flex>
                    </Box>
                </Box>
                <Flex
                    position={'fixed'}
                    bottom={`${mobileKeyboardOffset}px`}
                    left={0} right={0} minH="60px" alignItems={'center'} zIndex={10}
                    p="10px" borderTop={`1px solid ${borderTopColor}`} bg={themeColor}
                >
                    <Box w="100%" maxW={mConstants.desktopMinWidth} position="relative" mx="auto">
                        {(!isChatDisabled?.isState) && (
                            <ChatDisable isChatDisabled={isChatDisabled} setChatDisabled={setChatDisabled} userBasicInfo={userBaseInfo} />
                        )}
                        {(isFocus && isChatDisabled.isState) && <ChatWarningInfo />}
                        <Box
                          position={'absolute'}
                          display={(isShowScroll && !isKeyboardOpen && !isKeyboardOpenSafari) ? 'flex' : 'none'}
                          pointerEvents="auto"
                          top={isFocus ? '-80px' : '-55px'}
                          left={'0'}
                          w={'100%'}
                          height={'30px'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          bg='transparent'
                          zIndex={9999}
                        >
                          <Box
                            display={'flex'}
                            width="40px"
                            height={"40px"}
                            cursor={'pointer'}
                            zIndex={9999}
                            justifyContent='center'
                            alignItems={'center'}
                            borderRadius={'20px'}
                            backgroundColor={themeColor}
                            onClick={scrollToBottom}
                            border={'1px solid'}
                            borderColor={borderColor}
                          >
                            <Icon as={MdOutlineArrowDownward} width="25px" height="25px" color={navbarIcon} />
                          </Box>
                        </Box>
                        <Textarea ref={textareaRef} minH="48px" resize="none" as={ResizeTextarea} maxH={"150px"} border="1px solid" borderColor={borderColor} bg={isFocus ? textareaBgcolor1 : textareaBgcolor2} readOnly={isReceiving} maxLength={mConstants.inputMaxMessage} borderRadius="25px" lineHeight={"180%"} fontSize="17px" fontWeight="500" _focus={{ borderColor: '#2B8FFF' }} color={inputColor} _placeholder={placeholderColor} value={inputCode} placeholder="건강 관련 질문이나 증상을 알려주세요" onChange={(e) => setInputCode(e.target.value)} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} disabled={!isChatDisabled?.isState || isReceiving} sx={{ pr: '55px' }} />
                        <Box display={'flex'} position={'absolute'} top={0} bottom={0} right={'10px'} w={'55px'} justifyContent={'center'} alignItems={'center'}>
                            {isReceiving ? <Box onClick={debouncedStopRequest} cursor={'pointer'} zIndex={10}><Image src={LoadingBar} alt="LoadingBar" style={{ width: '30px', height: '30px' }} /></Box> : <Box zIndex={101} onTouchEnd={(e) => { e.preventDefault(); if (isChatDisabled?.isState && inputCode.trim() !== '') { setHasSent(true); handleSendMessage(); handleForceBlur(); setTimeout(() => setHasSent(false), 1000); } }} cursor={'pointer'}>{isFocus && inputCode.trim() ? <SendButtonOn boxSize={'32px'} /> : <SendButtonOff boxSize={'32px'} />}</Box>}
                        </Box>
                    </Box>
                </Flex>
            </>
        )
    }

    // Desktop rendering
    return (
        <Flex w={'100%'} h="100%" direction="column" position="relative" overflowY="auto" ref={scrollRef} px="basePadding">
            <Flex direction="column" w="100%" flex={1}>
                {realOutputCode?.length === 0 ? (
                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' pt="120px">
                        <MotionWelcomeImage isMobile={isMobile} pt="0" />
                        <MotionWelcome msg={`안녕하세요!`} pt="30px" classNames={colorMode === "light" ? "opening_box" : "opening_box_dark"} isMobile={isMobile} />
                        <MotionWelcome msg={`맞춤형 의사추천 챗봇 AIGA입니다.`} pt="10px" classNames={colorMode === "light" ? "opening_box" : "opening_box_dark"} isMobile={isMobile} />
                        <MotionWelcome msg={`어디가 아프거나 불편하신가요?`} pt="10px" classNames="opening_box_gray" isMobile={isMobile} />
                    </Box>
                ) : (
                    realOutputCode.map(renderMessage)
                )}
                {isReceiving && <Processing msg={isThinkingDeeply ? "🤔 깊게 생각 중… 조금만 기다려 주세요" : "분석중"} />}
                <Box ref={scrollBottomRef} h="1px" pb={'120px'} />
            </Flex>

            <Flex position="fixed" bottom={0} left="0" w="100%" bg={themeColor} zIndex="100" display={'flex'} justifyContent='center'>
              <Box w={'100%'} maxW={`${mConstants.desktopMinWidth}px`} position={'relative'} display={'flex'} flexDirection={'row'} zIndex="100" padding="10px" borderTop={`1px solid ${borderTopColor}`}>
                    <Box
                      position={'absolute'}
                      display={isShowScroll ? 'flex' : 'none'}
                      top={isFocus ? '-70px' : '-45px'}
                      left={'0'}
                      w={'100%'}
                      height={'30px'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      bg='transparent'
                      zIndex={1000}
                    >
                      <Box
                        display={'flex'}
                        width="40px"
                        height={"40px"}
                        cursor={'pointer'}
                        zIndex={10}
                        justifyContent='center'
                        alignItems={'center'}
                        borderRadius={'20px'}
                        backgroundColor={themeColor}
                        onClick={scrollToBottom}
                        border={'1px solid'}
                        borderColor={borderColor}
                      >
                        <Icon as={MdOutlineArrowDownward} width="25px" height="25px" color={navbarIcon} />
                      </Box>
                    </Box>
                    {(!isChatDisabled?.isState) && (
                        <ChatDisable isChatDisabled={isChatDisabled} setChatDisabled={setChatDisabled} userBasicInfo={userBaseInfo} />
                    )}
                    {(isFocus && isChatDisabled.isState) && <ChatWarningInfo />}
                    <Textarea
                        ref={textareaRef}
                        minH="48px"
                        resize="none"
                        as={ResizeTextarea}
                        maxH={"150px"}
                        border="1px solid"
                        borderColor={borderColor}
                        bg={isFocus ? textareaBgcolor1 : textareaBgcolor2}
                        readOnly={isReceiving}
                        maxLength={mConstants.inputMaxMessage}
                        borderRadius="25px"
                        lineHeight={"150%"}
                        fontSize="md"
                        fontWeight="500"
                        _focus={{ borderColor: '#2B8FFF' }}
                        color={inputColor}
                        _placeholder={placeholderColor}
                        value={inputCode}
                        placeholder="건강 관련 질문이나 증상을 알려주세요."
                        onChange={(e) => setInputCode(e.target.value)}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isComposing && !e.shiftKey) {
                                e.preventDefault();
                                if (isChatDisabled?.isState && inputCode.trim() !== '') {
                                    setHasSent(true); handleSendMessage(); handleForceBlur(); setTimeout(() => setHasSent(false), 1000);
                                }
                            }
                        }}
                        id={"textarea_content"}
                        disabled={!isChatDisabled?.isState || isReceiving}
                        sx={{ pr: '55px', flex: 1 }}
                    />
                    <Box display={'flex'} position={'absolute'} top="10px" bottom="10px" right={'20px'} w={'55px'} justifyContent={'center'} alignItems={'center'} zIndex={101}>
                        {isReceiving ? (
                            <Box onClick={debouncedStopRequest} cursor={'pointer'} zIndex={101}>
                                <Image src={LoadingBar} alt="LoadingBar" style={{ width: '30px', height: '30px' }} />
                            </Box>
                        ) : (
                            <Box zIndex={101} onMouseDown={(e) => { e.preventDefault(); if (isChatDisabled?.isState && inputCode.trim() !== '') { setHasSent(true); handleSendMessage(); handleForceBlur(); setTimeout(() => setHasSent(false), 1000); } }} cursor={'pointer'}>
                                {isFocus && inputCode.trim() ? <SendButtonOn boxSize={'32px'} /> : <SendButtonOff boxSize={'32px'} />}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Flex>

            {isOpenDoctorModal && (
                <Modal onClose={fn_close_modal_doctor_detail} isOpen={isOpenDoctorModal} scrollBehavior={'inside'} size={'full'}>
                    <ModalOverlay />
                    <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
                        <ModalHeader bg={navbarBg} padding="basePadding">
                            <Flex flexDirection={'row'} position={'relative'}>
                                 <Box position={'absolute'} left={0} top={0} w="50px" h={'100%'} display={{ base: 'flex', md: 'none' }} alignItems={'center'} onClick={fn_close_modal_doctor_detail} cursor={'pointer'}>
                                    <Icon as={MdArrowBack} w="24px" h="24px" color="white" />
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} w='100%'>
                                    <CustomTextBold700 color={'white'} noOfLines={1}>{selectedDoctor?.name?.replace("교수", "")} 교수</CustomTextBold700>
                                </Box>
                                <Box position={'absolute'} right={0} top={0} w="50px" h={'100%'} display={{ base: 'none', md: 'flex' }} justifyContent={'flex-end'} alignItems={'center'} onClick={fn_close_modal_doctor_detail} cursor={'pointer'}>
                                    <Icon as={MdOutlineClose} w="24px" h="24px" color="white" />
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalBody padding="basePadding" margin="0">
                            <DoctorDetail selected_doctor={selectedDoctor} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </Flex>
    );
}