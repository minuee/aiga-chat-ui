'use client';
/*eslint-disable*/
import { isMobileOnly,isMobileSafari} from "react-device-detect";
import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { Box,Flex,Icon,Textarea,useColorModeValue,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,useToast,useColorMode } from '@chakra-ui/react';
import ResizeTextarea from "react-textarea-autosize";
import { useEffect, useState,useRef,useCallback ,useMemo} from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit,MdOutlineClose,MdArrowBack } from 'react-icons/md';
import DoctorDetail  from '@/components/modal/Doctor';
import RecommandDoctor  from '@/components/msgType/RecommandDoctor';
import SearchDoctor  from '@/components/msgType/SearchDoctor';
import ForceStop  from '@/components/msgType/ForceStop';
import ChatMeMessage from '@/components/msgType/ChatMeMessage';
import ChatWrongMessage from '@/components/msgType/ChatWrongMessage';
import GeneralMessage from "@/components/msgType/GeneralMessage";
import SimpleListMessage from '@/components/msgType/SimpleListMessage';
import { ChatDisable,ChatWarningInfo }  from '@/components/msgType/ChatOptionView';
import MotionWelcome,{MotionWelcomeImage}  from '@/components/msgType/MotionWelcome';
import Processing  from '@/components/msgType/Processing';
import SkeletonDefaultText from "@/components/fields/LoadingBar";
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import debounce from 'lodash/debounce';

import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import mConstants from '@/utils/constants';

//새창열기 전역상태
import ConfigInfoStore from '@/store/configStore';
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore,CurrentDialogStore } from '@/store/newChatStore';
import historyStore from '@/store/historyStore';
import { 
  ModalDoctorDetailStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorListStore,DrawerHistoryStore,ModalMypageStore,ModalMypageNoticeStore,ModalMypageNoticeDetailStore,
  ModalMypageRequestStore,ModalMypageEntireStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageMingamStore,ModalSignupStoreStore,ModalSignupAgreeStoreStore,DoctorFromListStore,ReviewAlertStore
} from '@/store/modalStore';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import * as ChatService from "@/services/chat/index";
import { SendButtonOff,SendButtonOn } from '@/components/icons/svgIcons';
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import { isEmpty } from "lodash";

type ChatBotMobileProps = {
  mobileContentScrollHeight: number;
  mobileViewPortHeight : number;
  mobileKeyboardOffset : number;
  isKeyboardOpenSafari : boolean;
};
const ChatBotMobile = ({  mobileContentScrollHeight = 0, mobileViewPortHeight = 0, mobileKeyboardOffset=0,isKeyboardOpenSafari=false}: ChatBotMobileProps) => {
  const t = useTranslations('Messages');
  const { colorMode, toggleColorMode } = useColorMode();
  const alreadyInitialized = useRef(false);
  const isKeyboardOpen = useDetectKeyboardOpen();
  // Input States
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [isShowScroll, setShowScroll] = useState(false);
  const [isReceiving, setReceiving] = useState(false);
  const [isThinkingDeeply, setIsThinkingDeeply] = useState<boolean>(false);
  const [hasSent, setHasSent] = useState(false); // 메시지 중복 방지용
  const toast = useToast();
  // Response message
  const [realOutputCode, setRealOutputCode] = useState<any>([]);
  const outputCode = CurrentDialogStore(state => state.messageData);
  const setOutputCode = CurrentDialogStore((state) => state.setCurrentMessageData);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleForceBlur = () => {
    textareaRef.current?.blur(); // 👈 강제로 blur 발생시킴
  }

  const [isChatDisabled, setChatDisabled] = useState<any>({
    isState :  true,
    isAlertMsg : false,
    reTryTimeStamp : 0,
    remainTimeStamp : 0
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef(false); // 컴포넌트 맨 위에 선언
  const lastScrollStateRef = useRef<'up' | 'down' | null>(null);
  const lastToastTimeRef = useRef(0)
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  
  const resetUserBasicInfo = UserBasicInfoStore((state) => state.resetUserBasicInfo);
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);
  /* chat에 관련된 상태관리 */
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const [in24UsedToken, setIn24UsedToken] = useState(0);
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
  const { isOpenAlert } = ReviewAlertStore(state => state);
  const setOpenAlert = ReviewAlertStore((state) => state.setIsOpenReviewLoginAlert);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const navbarIcon = useColorModeValue('#000000', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const themeColor = useColorModeValue('#ffffff', 'navy.800');
  const borderTopColor = useColorModeValue('#E9EDF3', 'navy.800');
  const textareaBgcolor1 =  useColorModeValue('#ffffff','navy.800');
  const textareaBgcolor2 =  useColorModeValue('#f4f6fa','navy.800');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const isSystemText = ["system_text","system_doctors","system_list","system_select","system_image"];

  const [requestId, setRequestId] = useState(0); // 현재 요청 식별자
  const requestRef = useRef(0); // 최신 요청 ID 저장용

  /* 여기서부턴 모바일 전용 */
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const MOBILE_HEADER_HEIGHT = 60;
  const MOBILE_INPUT_HEIGHT = 60;

  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (!isMobileSafari || !window.visualViewport) return;

    const handleZoom = () => {
      const scale = window.visualViewport?.scale ?? 1;
      const offsetTop = window.visualViewport?.offsetTop ?? 0;

      const zooming = scale !== 1 || offsetTop > 0;

      setIsZooming(zooming);
    };

    window.visualViewport.addEventListener("resize", handleZoom);
    window.visualViewport.addEventListener("scroll", handleZoom); // scroll도 zoom 시 발생

    handleZoom();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleZoom);
      window.visualViewport?.removeEventListener("scroll", handleZoom);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = mobileContentRef.current;
      if (!el) return;
  
      el.style.overflowY = 'auto'; // 모바일에서 scroll 가능하도록
      // touch: 모바일
      let startY = 0;
  
      const handleTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
      };
  
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - startY;
        const threshold = isMobileSafari ? 20 : 30;
        const now = Date.now();

        if (scrollLockRef.current) return; // 감추기 잠금 중이면 무시
        if (diffY < -threshold) {
          //if ( isShowScroll ) setShowScroll(false);
          if (lastScrollStateRef.current !== 'up') {
            setShowScroll(false);
            lastScrollStateRef.current = 'up';
          }
        } else if (diffY > threshold) {
          if (lastScrollStateRef.current !== 'down') {
            setShowScroll(true);
            lastScrollStateRef.current = 'down';
          }
        }
      };
  
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchmove', handleTouchMove, { passive: true });
  
      return () => {

        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
      };
    }, 500);
  
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const check = setInterval(() => {
      const el = scrollRef.current;
      const target = scrollBottomRef.current;
      
      if (el && target) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setShowScroll(!entry.isIntersecting);
          },
          {
            root: el,
            threshold: 0.1,
          }
        );
  
        observer.observe(target);
        clearInterval(check);
      }
    }, 300);
  
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    if ( isMobileSafari && ( isKeyboardOpen || isKeyboardOpenSafari )) {
      const el = mobileContentRef.current;
      if (el) {
        mobileContentRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [isKeyboardOpen,isKeyboardOpenSafari]);

  // 스크롤을 맨 아래로 내리는 함수
  const scrollToBottom = () => {
    const el = scrollBottomRef.current;
    if (el) {
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      // 버튼 감추고 일정 시간 동안 잠금
      setShowScroll(false);
      scrollLockRef.current = true;
      lastScrollStateRef.current = 'up';
      setTimeout(() => {
        scrollLockRef.current = false;
      }, 1000); // 예: 1초 동안 잠금
    }
  };
  

  // 스크롤 이벤트 감지
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = mobileContentRef.current;
      if (!el) return;
  
      if (!isKeyboardOpen && !isKeyboardOpenSafari) {
        setIsScrollLocked(false);
      }
  
      let lastTouchY = 0;
      let unlockTimeout: NodeJS.Timeout | null = null;
  
      const handleTouchStart = (e: TouchEvent) => {
        lastTouchY = e.touches[0].clientY;
        if (unlockTimeout) {
          clearTimeout(unlockTimeout);
          unlockTimeout = null;
        }
      };
  
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - lastTouchY;
  
        const isGap = isMobileSafari ? 20 : 15;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
  
        const atBottom = scrollTop + clientHeight >= scrollHeight - isGap;
  
        // 👆 위로 스와이프하는 중이고, 바닥에 도달해있다면 → 락 해제
        if (!atBottom) {
          setIsScrollLocked(false);
          return;
        }
  
        // diffY가 양수(아래로 스와이프)일 때만 락 해제 시도
        if (diffY > 0) {
          // 갑작스러운 큰 움직임에 즉시 락 해제하지 않고, 200ms 딜레이 후에 락 해제
          if (!unlockTimeout) {
            unlockTimeout = setTimeout(() => {
              setIsScrollLocked(false);
              unlockTimeout = null;
            }, 200);
          }
        } else {
          // diffY가 음수거나 0이면 락 유지, 딜레이도 취소
          if (unlockTimeout) {
            clearTimeout(unlockTimeout);
            unlockTimeout = null;
          }
          setIsScrollLocked(true);
        }
      };
  
      const handleScroll = () => {
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        const isGap = isMobileSafari ? 20 : 15;
  
        // ✅ 바닥에 도달하면 잠금
        if (scrollTop + clientHeight >= scrollHeight - isGap) {
          if (isKeyboardOpen || isKeyboardOpenSafari) {
            setIsScrollLocked(true);
          }
        }
  
        // ✅ 위로 스크롤 시 잠금 해제
        if (scrollTop + clientHeight < scrollHeight - isGap) {
          setIsScrollLocked(false);
        }
      };
  
      el.addEventListener('scroll', handleScroll);
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchmove', handleTouchMove, { passive: true });
  
      return () => {
        el.removeEventListener('scroll', handleScroll);
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
      };
    }, 500);
  
    return () => clearTimeout(timer);
  }, [isKeyboardOpen, isKeyboardOpenSafari]);
  

  useEffect(() => {
    const preventTouch = (e: any) => {
      if (isScrollLocked && (isKeyboardOpen || isKeyboardOpenSafari)) {
        e.preventDefault();
      }
    };
  
    document.addEventListener('touchmove', preventTouch, { passive: false });
  
    return () => {
      document.removeEventListener('touchmove', preventTouch);
    };
  }, [isScrollLocked]);
  /* useEffect(() => {
    if ( functions.isEmpty(chatSessionId) ) {
      getNewSessionID();
    }
    return () => setChatSessionId('');
  }, []); */

  const firstForceStep = () => {
    setChatSessionId('')
    setIsOpenReview(false)
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
    setOpenAlert(false);
    setChatDisabled({
      isState :  true,
      isAlertMsg : false,
      reTryTimeStamp : 0,
      remainTimeStamp : 0
    })
  }

  const firstClear = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
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
    history.push(`/${locale}/chat`);
    mCookie.setCookie('currentPathname','');
    scrollToBottom()
  }

  useEffect(() => {
    if (isMobileSafari && ( isKeyboardOpen || isKeyboardOpenSafari )) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      document.body.style.height = '100vh';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.overscrollBehavior = '';
    }
  }, [isKeyboardOpen, isKeyboardOpenSafari]);

  useEffect(() => {
    setIn24UsedToken(0)
  }, [userBaseInfo.isState]);

  useEffect(() => {
    if (!alreadyInitialized.current) {
      const loadData =  CurrentDialogStore.getState().messageData;
      console.log('🔥 최초 1회만 실행',loadData?.length);
      setRealOutputCode(loadData)
      firstClear();
      alreadyInitialized.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname; // 항상 최신값 유지
    setIsScrollLocked(false);
  }, [pathname]);

  const getNewSessionID =  async() => {
    try{
      const res:any = await ChatService.getChatNewSession();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        const newSessionId = res?.data?.session_id;
        setChatSessionId(newSessionId)
        return newSessionId;
      }else{
        return null;
      }
    }catch(e:any){
      return null;
    }
  }

  useEffect(() => {
    if ( !functions.isEmpty(oldHistoryData) ) {
      if ( !functions.isEmpty(oldHistoryData?.session_id) ) {
        setChatSessionId(oldHistoryData?.session_id)
        setOutputCode(oldHistoryData?.chattings);
        setRealOutputCode(oldHistoryData?.chattings)
        setChatDisabled({
          ...isChatDisabled,
          isState : true,
          isAlertMsg : false
        })
        fn_close_drawer_history();
        setOldHistoryData(null)
      }
    }
  }, [oldHistoryData]);
  /* 토큰 만료를 체크 */
  useEffect(() => {
    if ( in24UsedToken > 0 ) { 
      if ( isNewChat && realOutputCode.length > 0 ) {
        setChatSessionId('')
        setOutputCode([]);
        setRealOutputCode([])
        setCurrentPathname('')
        mCookie.setCookie('currentPathname','')
        firstForceStep();
        setTimeout(() => {
          setNewChatOpen(false);
        }, 60);
      }
      const nowTimeStamp = functions.getKSTUnixTimestamp();
      if ( userBaseInfo?.isGuest  ) {//비회원
        if ( in24UsedToken >= guestMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            isState : false,
            reTryTimeStamp : nowTimeStamp,
            remainTimeStamp : guestRetryLimitSec ?? 57600,
          })
        }else{
          setChatDisabled({
            ...isChatDisabled,
            isState : true,
          })
        }
      }else{
        if ( in24UsedToken >= userMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            isState : false,
            reTryTimeStamp : nowTimeStamp,
            remainTimeStamp : userRetryLimitSec ?? 57600
          })
        }else{
          setChatDisabled({
            ...isChatDisabled,
            isState : true,
          })
        }
      }
    }else{
      if ( isNewChat && realOutputCode.length > 0 ) {
        // 현 데이터를 히스토리에 넣는다 * 저장방식을 고민을 해야 한다 
        setChatSessionId('')
        setOutputCode([]);
        setRealOutputCode([])
        setChatDisabled({
          ...isChatDisabled,
          isState : true,
          isAlertMsg : false,
        })
        setCurrentPathname('')
        mCookie.setCookie('currentPathname','')
        firstForceStep();
        setTimeout(() => {
          setNewChatOpen(false);
        }, 60);
      }
    }
  }, [in24UsedToken,isNewChat]);

  useEffect(() => {
    if (isReceiving) {
      thinkingTimerRef.current = setTimeout(() => {
        setIsThinkingDeeply(true);
      }, 10000); // 10 seconds
    } else {
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      setIsThinkingDeeply(false);
    }

    return () => {
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
      }
    };
  }, [isReceiving]);

  

  const onHandleStopInquiry = async() => {
    try{
      if ( !functions.isEmpty(chatSessionId)  ) {
        const res:any = await ChatService.setRequestStop(chatSessionId);     
      }
    }catch(e:any){
      setReceiving(false)
    }

    try{
      if ( !functions.isEmpty(chatSessionId)  ) {
        const lastItem = realOutputCode.length > 0 ? realOutputCode[realOutputCode.length - 1] :"값없음";
        const fromMessage = "질문 중지";
        const questionResult:any = await ChatService.saveErrorLog(chatSessionId,JSON.stringify(lastItem),fromMessage);
      }
    }catch(e:any){
      console.log("questionResult e",e)
    }
  }

  const debouncedStopRequest = useCallback(
    debounce(() => {
      if (hasSent) return;
      onHandleStopRequest();
    }, 300), // 300ms 안에 여러 번 눌러도 한 번만 실행
    [hasSent]
  );

  const onHandleStopRequest = async() => {
    if (hasSent) return; 
    if ( isReceiving ) {
      requestRef.current = -1; // 무효화
      await onHandleStopInquiry();
      const forceMsg = "대답이 중지되었습니다."
      setReceiving(false);
      setIsLoading(false)
      //setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }]);
      if (Array.isArray(outputCode)) {
        setOutputCode([
          ...outputCode,
          { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }
        ]);
        setRealOutputCode([
          ...realOutputCode,
          { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }
        ]);
      }else{
        setOutputCode([
          { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }
        ]);
        setRealOutputCode([
          { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }
        ]);
      }
    }
  }

  const debouncedSend = useCallback(
    debounce(() => {
      if (!isReceiving && !hasSent) {
        handleTranslate(functions.removeTrailingNewlines(inputCode));
      }
    }, 100),
    [inputCode, isReceiving, hasSent]
  );

  const handleSendMessage = () => {
    debouncedSend();
  }

  const onHandleTypeDone = () => {
    setIsLoading(false);
    setReceiving(false);
    setIsFocus(false);
    setTimeout(() => {
      if (textareaRef.current && !isMobileOnly) {
        textareaRef?.current?.focus()
      }
    }, 100)
    
  }

  const addMessage = (newItem: any) => {
    if ( !newItem?.isOnlyLive) {
      CurrentDialogStore.getState().setCurrentMessageData((prev: any) => [...prev, {...newItem,isLiveChat:false}]);
    }
    setRealOutputCode((prev:any) => [...prev, newItem]);
  }

  const handleTranslate = async( isText:any = '') => {
    const nowTokens = calculateTokenCount(inputCode);
    const nowTimeStamp = functions.getKSTUnixTimestamp();
    if(isNewChat) setNewChatOpen(false);
    if ( in24UsedToken > 0 ) { 
      const realTimeIn24UsedToken = in24UsedToken+nowTokens;
      if ( userBaseInfo?.isGuest  ) {//비회원
        if ( realTimeIn24UsedToken >= guestMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            reTryTimeStamp : nowTimeStamp,
            remainTimeStamp : guestRetryLimitSec ?? 57600,
            isAlertMsg : false,
            isState : false,
          })
          return;
        }
      }else{
        if ( realTimeIn24UsedToken >= userMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            reTryTimeStamp : nowTimeStamp,
            remainTimeStamp : userRetryLimitSec ||  57600,
            isAlertMsg : false,
            isState : false,
          })
          return;
        }
      }
    }
    if ( functions.isEmpty(inputCode) ||  functions.isEmpty(isText) || isReceiving ) return;
    let chat_sessinn_id = chatSessionId;
    if ( functions.isEmpty(chat_sessinn_id)) {
      chat_sessinn_id = await getNewSessionID();
    }
    if ( !functions.isEmpty(chat_sessinn_id)) {
      const newRequestId = Date.now(); // 혹은 증가값
      setRequestId(newRequestId);
      requestRef.current = newRequestId;
      setReceiving(true);
      const msgLen = parseInt(realOutputCode.length+1);
      const inputCodeText = isText;

      if ( isSystemText.includes(inputCodeText) ) {
        if( inputCodeText != realOutputCode[realOutputCode?.length -1]?.msg) { 
          if (Array.isArray(realOutputCode)) {
            setOutputCode([
              ...outputCode,
              { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }
            ])
            setRealOutputCode([
              ...realOutputCode,
              { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }
            ])
          }else{
            setOutputCode([{ chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }])
            setRealOutputCode([{ chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }])
          }
          setIsLoading(false);
          setReceiving(false);
          setIsFocus(false);
          return;
        }else{
          setIsLoading(false);
          setReceiving(false);
          setIsFocus(false)
          return;
        }
      }else{
        const newItem = {
          chat_id: functions.getUUID(),
          ismode: "me",
          question: inputCodeText,
          isOnlyLive : false
        };
        addMessage(newItem)
      }
     
      try{
        setInputCode('')
        const questionResult:any = await ChatService.getChatMessage(chat_sessinn_id,inputCodeText.trim());
        // ❗중지된 요청이면 무시
        if (requestRef.current !== newRequestId) return;
        if ( mConstants.apiSuccessCode.includes(questionResult?.statusCode) ) {
          const answerMessage = questionResult?.data;
          setIn24UsedToken(functions.isEmpty(answerMessage?.in24_used_token) ? 0 : answerMessage?.in24_used_token);
          if ( answerMessage?.chat_type !== 'general' ) {
            setIsLoading(false);
            setReceiving(false);
            setIsFocus(false);
            setTimeout(() => {
              if (textareaRef.current && !isMobileOnly) {
                textareaRef?.current?.focus()
              }
            }, 100)
          }
          
          setTimeout(() => {
            addMessage(
              {
                ismode : 'server',
                isHistory : false,
                isLiveChat : true,
                isOnlyLive : false,
                chat_id: answerMessage?.chat_id,
                user_question : answerMessage?.question,
                answer : answerMessage?.answer,
                chat_type: answerMessage?.chat_type,
                summary : answerMessage?.summary,
                used_token : answerMessage?.used_token
              }
            )
          }, 100); 
         
        }else{
          if ( questionResult?.statusCode == '408' || questionResult?.message?.statusCode == '408' ) {
            setIsLoading(false);
            setReceiving(false);
            setIsFocus(false)
            setTimeout(() => {
              if (textareaRef.current && !isMobileOnly) {
                textareaRef?.current?.focus()
              }
            }, 100)
            
            setTimeout(() => {
              addMessage(
                {
                  ismode : 'system_400',
                  isHistory : false,
                  chat_id: functions.getUUID(),
                  user_question : inputCodeText,
                  answer : null,
                  msg: mConstants.error_message_10_second,
                  chat_type : 'system',
                  used_token : 0,
                  isOnlyLive : false
                }
              )
            }, 60); 
          } else if ( questionResult?.message?.statusCode == '400' || questionResult?.message?.statusCode == '404') {
            setIsLoading(false);
            setReceiving(false);
            setIsFocus(false)
            setTimeout(() => {
              if (textareaRef.current && !isMobileOnly) {
                textareaRef?.current?.focus()
              }
            }, 100)
            if (  questionResult?.message?.statusCode == '404' && questionResult?.message?.message == '세션이 존재하지 않습니다.') {
              setChatSessionId('');
            }
            setTimeout(() => {
              addMessage(
                {
                  ismode : 'system_400',
                  isHistory : false,
                  chat_id: functions.getUUID(),
                  user_question : inputCodeText,
                  answer : null,
                  msg: mConstants.error_message_default,
                  chat_type : 'system',
                  used_token : 0,
                  isOnlyLive : false
                }
              )
            }, 60); 
          } else if ( questionResult?.message?.statusCode == '506' ) {
            setIsLoading(false);
            setReceiving(false);
            setIsFocus(false)
            setTimeout(() => {
              if (textareaRef.current && !isMobileOnly) {
                textareaRef?.current?.focus()
              }
            }, 100)
            
            setTimeout(() => {
              addMessage(
                {
                  ismode : 'system_400',
                  isHistory : false,
                  chat_id: functions.getUUID(),
                  user_question : inputCodeText,
                  answer : null,
                  msg: mConstants.error_message_506,
                  chat_type : 'system',
                  used_token : 0,
                  isOnlyLive : false
                }
              )
            }, 60); 
          }else if ( questionResult?.message?.statusCode == '403') {
            const parsedMessage = parseLooselyFormattedJsonString(questionResult?.message?.message);
            if ( !functions.isEmpty(parsedMessage) ) {
              const nowTimeStamp = functions.getKSTUnixTimestamp();
              const parsedTimestamp = parseInt(parsedMessage?.timestamp);
              const reTrytimeStamp = parsedTimestamp ?? nowTimeStamp;
              const parsedRemainingTime = parseInt(parsedMessage?.remainingTime);
              const remainingTime = parsedRemainingTime ?? userRetryLimitSec ?? 57600;
            
              setIn24UsedToken(functions.isEmpty(parsedMessage?.in24_used_token) ? 0 :  parsedMessage?.in24_used_token)
              setIsLoading(false);
              setReceiving(false);
              setIsFocus(false)
              setTimeout(() => {
                if (textareaRef.current && !isMobileOnly) {
                  textareaRef?.current?.focus()
                }
              }, 100)
              setTimeout(() => {
                setChatDisabled({
                  reTrytimeStamp : reTrytimeStamp,
                  remainTimeStamp : remainingTime,
                  isState : false,
                  isAlertMsg : false
                })
              }, 2000)
            }else{
               call_fn_error_message(inputCodeText,chat_sessinn_id,"토큰 만료 체크 오류");
            }
          }else if ( questionResult?.message?.statusCode == '401' && !functions.isEmpty(userBaseInfo?.email)) { // 권한없음
            const fromMessage = "비정상적인 로그인 상태입니다. 로그아웃되었습니다."
            toast({
              title: fromMessage,
              position: 'top-right',
              status: 'error',
              containerStyle: {
                color: '#ffffff',
              },
              isClosable: true,
              duration:1500
            });
            call_fn_error_message(inputCodeText,chat_sessinn_id,fromMessage)
            firstForceStep();
            resetUserBasicInfo();
            
          }else{
            call_fn_error_message(inputCodeText,chat_sessinn_id,"not")
          }
        }
      }catch(e:any){
        const fromMessage = `Try Catch Error: ${JSON.stringify(e)}`;
        call_fn_error_message(inputCodeText,chat_sessinn_id,fromMessage);
      }
    }else{
      const fromMessage = "Session Id가 없습니다."
      call_fn_error_message(isText,chat_sessinn_id,fromMessage);
    }
  }

  const call_fn_error_message = async(inputCodeText:any,chat_sessinn_id:string, fromMessage:string = "") => {
    setIsLoading(false);
    setReceiving(false);
    setIsFocus(false);

    if ( fromMessage !== 'not') {
      try{
        const questionResult:any = await ChatService.saveErrorLog(chat_sessinn_id,inputCodeText.trim(),fromMessage);
      }catch(e:any){
        console.log("e",e)
      }
    }

    setTimeout(() => {
      addMessage(
        {
          ismode : 'system',
          isHistory : false,
          chat_id: functions.getUUID(),
          user_question : inputCodeText,
          answer : null,
          msg: mConstants.error_message_500,
          chat_type : 'system',
          used_token : 0,
          isOnlyLive : true
        }
      )
    }, 60);
    setTimeout(() => {
      if (textareaRef.current && !isMobileOnly) {
        textareaRef?.current?.focus()
      }
    }, 100)

  }

  const  parseLooselyFormattedJsonString = (input:any)  => {
    try {
      // 1. 줄바꿈/공백 정리
      let jsonLike = input.trim();
  
      // 2. 작은 따옴표를 큰 따옴표로 변환 (단, 문자열 내부만)
      jsonLike = jsonLike.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // key에 큰따옴표
      jsonLike = jsonLike.replace(/:(\s*)'([^']*)'/g, ': "$2"'); // value에 큰따옴표
  
      // 3. 파싱 시도
      return JSON.parse(jsonLike);
    } catch (e:any) {
      console.error('⚠️ JSON 파싱 실패:', e);
      return null;
    }
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowScroll(false)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, realOutputCode?.ismode == "me" ? 0 : 300); // or 100ms 정도로 조정 가능
    return () => clearTimeout(timeout);
  }, [realOutputCode]);

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  }

  // 토큰 계산 함수
  const calculateTokenCount = (text: string): number => {
    let count = 0;
    for (let char of text) {
      // 유니코드 블록을 이용한 판별
      const code = char.charCodeAt(0);
      if (
        (code >= 0xAC00 && code <= 0xD7A3) || // 한글
        (code >= 0x3040 && code <= 0x30FF) || // 일본어 (히라가나/가타카나)
        (code >= 0x4E00 && code <= 0x9FFF)    // 한자 (일본어 포함)
      ) {
        count += 1.2;
      } else {
        count += 0.6;
      }
    }
    return count;
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
    setOpenDoctorListModal(false);
    setIsOpenReview(false);
    setIsOpenRequestModal(false);
    setIsOpenDoctorModal(true);
  }

  const onSendNameButton = async( str : string) => {
    if ( !isReceiving ) await handleTranslate(str);
  }

  const onSendTypeButton = async( typeString : string ) => {
    if ( !isReceiving ) await handleTranslate(typeString);
  }

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
  
  
  if (isLoading) {
    return (
      <SkeletonDefaultText isOpen={isLoading} lineNum={10} />
    )
  }
  return (
    <>
      <Box
        ref={mobileContentRef}
        //position={'absolute'}
        //position={(isMobileSafari && ( isKeyboardOpen || isKeyboardOpenSafari ) ) ? 'absolute' : isMobileSafari ? 'fixed' : 'absolute'}
        position={isMobileSafari ? 'fixed' : 'absolute'}
        top={`${MOBILE_HEADER_HEIGHT}px`} 
        left={0} 
        overflowY={'auto'} 
        width={'100%'} 
        height={isMobileSafari ? `${mobileViewPortHeight}px` : `${mobileContentScrollHeight}px`} 
        maxHeight={isMobileSafari ? `${mobileViewPortHeight}px` :  `${mobileContentScrollHeight}px`} 
        bg={themeColor}
        paddingLeft={{base : 0 , md : "calc((100vw - 640px) / 2)"}} // ✅ 수동 중앙 정렬
      >
        <Box 
          height={isMobileSafari ? `${mobileViewPortHeight}px` : ( isKeyboardOpen || isKeyboardOpenSafari ) ? `${mobileViewPortHeight*0.6}px` : `${mobileViewPortHeight}px`} 
          //height={`${mobileViewPortHeight}px`}
          //maxHeight={`${mobileViewPortHeight}px`}
          maxHeight={isMobileSafari ? `calc( 100vh - 120px )` :  ( isKeyboardOpen || isKeyboardOpenSafari ) ? `${mobileViewPortHeight*0.6}px` :`${mobileViewPortHeight}px`}
          transition="height 0.3s ease-in-out"
          overflow={'hidden'}
          width={'100%'} 
          maxWidth={`${mConstants.desktopMinWidth}px`}
        >
          <Box 
            height={'100%'} 
            overflowY={'auto'} 
            paddingBottom={0}
            //paddingBottom={`${mobileKeyboardOffset}px`}
          >
            <Flex w={'100%'} px='basePadding' maxWidth={`${mConstants.desktopMinWidth}px`}  direction="column" position="relative">
              <Flex 
                direction="column" w={'100%'} maxWidth={`${mConstants.desktopMinWidth}px`} 
                height={isMobileSafari ?  `100%` :  isKeyboardOpen ? `${mobileViewPortHeight*0.6}px` : `${mobileViewPortHeight}px`}
                justifyContent={realOutputCode?.length == 0  ? 'center' : 'flex-start'} 
                alignItems={realOutputCode?.length == 0  ? 'center' : '-moz-initial'} 
              >
                <Box display={realOutputCode?.length == 0 ? 'flex' : 'none'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} >
                  <MotionWelcomeImage
                    pt={isMobileSafari ? "40px":  "0"}
                    isMobile={true}
                  />
                  <MotionWelcome 
                    msg={`안녕하세요!`}
                    pt="30px"
                    classNames={colorMode == "light" ? "opening_box" : "opening_box_dark"}
                    isMobile={true}
                  />
                  <MotionWelcome 
                    msg={`맞춤형 의사추천 챗봇 AIGA입니다.`}
                    pt="10px"
                    classNames={colorMode == "light" ? "opening_box" : "opening_box_dark"}
                    isMobile={true}
                  />
                  <MotionWelcome 
                    msg={`어디가 아프거나 불편하신가요?`}
                    pt="10px"
                    classNames="opening_box_gray"
                    isMobile={true}
                  />
                </Box>
                { 
                  realOutputCode.map((element:any,index:number) => {
                    if ( element.ismode == 'me') {
                      return (
                        <Box key={index}>
                          <ChatMeMessage
                            indexKey={index}
                            question={element.question}
                          />
                        </Box>
                      )
                    }else if ( element.ismode == 'server') {
                      if ( element.chat_type === "recommand_doctor" ) {
                        return (
                          <Box key={index} display={functions.isEmpty(element) ? 'none' : 'block'}>
                            <RecommandDoctor 
                              data={element}
                              summary={!functions.isEmpty(element?.summary) ? functions.cleanEscapedCharacters(element?.summary.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, '')) : ""}
                              isHistory={element?.isHistory}
                              onSendButton={onSendDoctorButton}
                              isLiveChat={element.isLiveChat}
                              setIsTypingDone={() => onHandleTypeDone()}
                            />
                          </Box>
                        )
                      }else if ( element.chat_type === "search_doctor" ) {
                        return (
                          <Box key={index} display={functions.isEmpty(element) ? 'none' : 'block'}>
                            <SearchDoctor 
                              data={element}
                              summary={!functions.isEmpty(element?.summary) ? functions.cleanEscapedCharacters(element?.summary.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, '')) : ""}
                              isHistory={element?.isHistory}
                              onSendButton={onSendDoctorButton}
                              isLiveChat={element.isLiveChat}
                              setIsTypingDone={() => onHandleTypeDone()}
                            />
                          </Box>
                        )
                      }else if ( element.chat_type === "recommand_hospital" ) {
                        return (
                          <Box key={index} display={functions.isEmpty(element.answer) ? 'none' : 'block'}>
                            <Flex w="100%" key={index}>
                              <SimpleListMessage 
                                indexKey={index}
                                isHistory={element?.isHistory}
                                msg={element.answer} 
                                isLiveChat={element.isLiveChat}
                                setIsTypingDone={() => onHandleTypeDone()}
                                summary={!functions.isEmpty(element?.summary) ? functions.cleanEscapedCharacters(element?.summary.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, '')) : ""} 
                              />
                            </Flex>
                          </Box>
                        )
                      }else if ( element.chat_type === "general" ) {
                        return (
                          <Box key={index} display={functions.isEmpty(element.answer) ? 'none' : 'block'}>
                            <Flex w="100%" key={index}>
                              <GeneralMessage 
                                //output={functions.makeLinkify(functions.cleanEscapedCharacters(element.answer.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, '')))} 
                                output={functions.cleanEscapedCharacters(element.answer.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, ''))} 
                                isHistory={element?.isHistory}
                                setIsTypingDone={() => onHandleTypeDone()}
                                isLiveChat={element.isLiveChat == undefined ? false : element.isLiveChat }
                              />
                            </Flex>
                          </Box>
                        )
                      }else {
                        return (
                          <Box key={index}>
                            <ChatWrongMessage
                              indexKey={index}
                              isMode="system"
                              msg={'흠..뭔가 잘못된 것 같습니다'}
                            />
                          </Box>
                        )
                      }
                    }else if ( element.ismode == 'system_stop') {
                      return (
                        <Box key={index}>
                          <ForceStop
                            indexKey={index}
                            msg={element.msg}
                          />
                        </Box>
                      )
                    }else if ( element.ismode == 'system' || element.ismode == 'system_400') {
                      return (
                        <Box key={index}>
                          <ChatWrongMessage
                            indexKey={index}
                            isMode={element.ismode}
                            msg={!functions.isEmpty(element?.msg) ? element?.msg : '흠..뭔가 잘못된 것 같습니다'}
                          />
                        </Box>
                      )
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
                { isReceiving && (
                  isThinkingDeeply ?
                  ( <Box><Processing  msg="🤔 깊게 생각 중… 조금만 기다려 주세요" /></Box> ) 
                  :
                  ( <Box><Processing  msg="분석중" /></Box> ) 
                  )
                }
                <Box ref={scrollBottomRef}  height={isMobileSafari ? "10px" : "50px"} pb={isMobileSafari ? "10px" : "50px"} visibility="hidden" bg={themeColor}/>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
      
      <Flex
        position={isMobileSafari ? 'fixed' : 'absolute'}
        bottom={isMobileSafari ? isZooming ? 0 : `${mobileKeyboardOffset}px` : 0} 
        //bottom={0}
        left={{base : 0, md : "calc((100vw - 640px) / 2)"}} // ✅ 수동 중앙 정렬 
        right={0} minHeight="60px" height={'auto'} alignItems={'center'} zIndex={10}
        transition={'bottom 0.25s ease-in-out'}
        padding="10px"  borderTop={`1px solid  ${borderTopColor}`}
        bg={themeColor}
        maxWidth={`${mConstants.desktopMinWidth}px`}
      >
        <Box 
          position={'absolute'}
          display={(isShowScroll && !isKeyboardOpen && !isKeyboardOpenSafari) ? 'flex' : 'none'}
          pointerEvents="auto" // 이거 추가
          top={isFocus ? {base : '-80px', md : '-70px'} : {base : '-55px', md : '-45px'}}
          left={'0'}
          w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
          height={'30px'}
          justifyContent={'center'}
          alignItems={'center'}
          bg='transparent'
          zIndex={9999}
        >
          <Box
            display={'flex'}  width="40px" height={"40px"} cursor={'pointer'} zIndex={9999} justifyContent='center' alignItems={'center'} 
            borderRadius={'20px'} backgroundColor={'#fff'}
            onClick={()=> scrollToBottom()}
            border={'1px solid #efefef'}
          >
            <Icon as={MdOutlineArrowDownward} width="25px" height="25px" color={navbarIcon} />
          </Box>
        </Box>
        {
          ( !isChatDisabled?.isState && !isChatDisabled?.isAlertMsg ) && (
            <ChatDisable
              isChatDisabled={isChatDisabled}
              setChatDisabled={setChatDisabled}
              userBasicInfo={userBaseInfo}
            />
          )
        }
        { ( isFocus && isChatDisabled.isState ) && ( <ChatWarningInfo /> )}
        <Textarea
          minH="48px"
          resize="none"
          as={ResizeTextarea}
          h="100%"
          sx={{WebkitOverflowScrolling: "touch",overflowY: "auto",touchAction: "manipulation", pr:'40px'}}
          maxH={"150px"}
          border="1px solid"
          borderColor={borderColor}
          bg={isFocus ? textareaBgcolor1 :textareaBgcolor2}
          readOnly={isReceiving}
          maxLength={mConstants.inputMaxMessage}
          borderRadius="25px"
          lineHeight={inputCode?.length > 10 ? "150%" : "180%"}
          ref={textareaRef}
          fontSize="17px"
          fontWeight="500"
          _focus={{ borderColor: '#2B8FFF' }}
          color={inputColor}
          _placeholder={placeholderColor}
          value={inputCode}
          placeholder="건강 관련 질문이나 증상을 알려주세요"
          //placeholder={`높이 :${mobileViewPortHeight}px`}
          onChange={handleChange}
          onFocus={(e:any) => {
            setIsFocus(true);
            if ( isMobileSafari ) {
              setTimeout(() => {
                try {
                  e.target.scrollIntoView({ block: 'center', behavior: 'auto' });
                } catch (err) {}
              }, 100);
            }
          }}
          //onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onKeyDown={(e:any) => {
            if (e.key === 'Enter' && !e.shiftKey && !isMobileOnly && !isReceiving)  {
              e.preventDefault(); // 줄바꿈 방지
              e.stopPropagation();
              if (isChatDisabled?.isState && inputCode.trim() !== '' && !isReceiving) {
                setHasSent(true); // 일단 막고
                handleSendMessage();
                setIsFocus(false);
                handleForceBlur();
                setInputCode('')
                setTimeout(() => {
                  setHasSent(false);
                }, 1500);
              }
            }
          }}
          id={"textarea_content"}
          disabled={(!isChatDisabled?.isState || isReceiving)}
        />
        <Box display={'flex'} position={'absolute'} bottom={'6px'} right={'20px'} w={'55px'} height={'55px'} justifyContent={'flex-end'} alignItems={'center'}>
          {
            isReceiving && !hasSent ? (
              <Box
                onClick={(e) => { e.preventDefault(); e.stopPropagation();debouncedStopRequest(); }}
                cursor={'pointer'}
                zIndex={10}
              >
                <Image src={LoadingBar} alt="LoadingBar" style={{ width: '30px', height: '30px' }} />
              </Box>
            ) : !isChatDisabled?.isState ? (
              <Box zIndex={10}>
                <SendButtonOff boxSize={'32px'}  />
              </Box>
            ) : (
              <Box
                zIndex={101}
                pointerEvents="auto"
                onTouchEnd={(e:any) => {
                  e.preventDefault();e.stopPropagation();
                  if (isChatDisabled?.isState && !functions.isEmpty(inputCode) && !isReceiving) {
                    setHasSent(true); // 일단 막고
                    handleSendMessage();
                    setIsFocus(false);
                    handleForceBlur();
                    setTimeout(() => {
                      setHasSent(false);
                    }, 1000);
                  }
                }}
                cursor={'pointer'}
              >
                { 
                isFocus ? (
                  <SendButtonOn boxSize={'32px'} style={{ pointerEvents: 'none' }}  />
                ) : (
                  <SendButtonOff boxSize={'32px'} style={{ pointerEvents: 'none' }} />
                )}
              </Box>
            )
          }
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
                    <CustomTextBold700 color={'white'} noOfLines={1}>{selectedDoctor?.name?.replace("교수","")} 교수</CustomTextBold700>
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
    </>
  );
}

export default ChatBotMobile;