'use client';
/*eslint-disable*/
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { Box,Flex,Icon,Textarea,Text,useColorModeValue,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,useToast,useColorMode } from '@chakra-ui/react';
import ResizeTextarea from "react-textarea-autosize";
import { useEffect, useState,useRef,useLayoutEffect } from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit, MdPerson,MdOutlineClose,MdArrowBack } from 'react-icons/md';
import DoctorDetail  from '@/components/modal/Doctor';
import LoadingDots  from '@/components/icons/ProgressDot';
import RecommandDoctor  from '@/components/msgType/RecommandDoctor';
import SearchDoctor  from '@/components/msgType/SearchDoctor';
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

import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import mConstants from '@/utils/constants';

//새창열기 전역상태
import ConfigInfoStore,{ GlobalStateStore } from '@/store/configStore';
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore,CurrentDialogStore } from '@/store/newChatStore';
import historyStore from '@/store/historyStore';
import { 
  ModalDoctorDetailStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorListStore,DrawerHistoryStore,ModalMypageStore,ModalMypageNoticeStore,ModalMypageNoticeDetailStore,
  ModalMypageRequestStore,ModalMypageEntireStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageMingamStore,ModalSignupStoreStore,ModalSignupAgreeStoreStore,DoctorFromListStore,ReviewAlertStore
} from '@/store/modalStore';
 import UserStateStore from '@/store/userStore';
import * as ChatService from "@/services/chat/index";
import { SendButtonOff,SendButtonOn } from '@/components/icons/svgIcons';


export default function ChatBot() {
  const t = useTranslations('Messages');
  const { colorMode, toggleColorMode } = useColorMode();
  const alreadyInitialized = useRef(false);
  const keyboardHeight = useKeyboardHeight();
  const isKeyboardOpen = useKeyboardStatus();
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
  //const [outputCode, setOutputCode] = useState<any>([]);
  const outputCode = CurrentDialogStore(state => state.messageData);
  const setOutputCode = CurrentDialogStore((state) => state.setCurrentMessageData);
  
  // ChatGPT model
  const [isChatDisabled, setChatDisabled] = useState<any>({
    isState :  true,
    isAlertMsg : false,
    reTryTimeStamp : 0
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('#000000', 'navy.800');
  const { nickName, ...userBasicInfo } = UserStateStore(state => state);
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
  
  /* useEffect(() => {
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
    setOpenAlert(false)
  }

  useEffect(() => {
    if (!alreadyInitialized.current) {
      console.log('🔥 최초 1회만 실행');
      //firstForceStep();
      //getNewSessionID(); // ✅ 여기서만 실행됨
      alreadyInitialized.current = true;
      
      setTimeout(() => {
        setIsLoading(false);
        /* const msgLen = outputCode?.length;
        const sampleMsg1 = mConstants.sample_msg_1;
        const sampleMsg2 = mConstants.sample_msg_2;
        const sampleMsg3 = mConstants.sample_msg_3;
        const sampleMsg4 = mConstants.sample_msg_4;
        const sampleMsg5 = mConstants.sample_msg_5;
        const sampleMsg6 = mConstants.sample_msg_6;
        setOutputCode((prevCode: any[]) => {
          const newArray = [...prevCode];
          const lastIndex = msgLen;
          newArray[lastIndex] = {
            ismode : 'server',
            id: sampleMsg6?.chat_id,
            user_question : sampleMsg6?.question,
            answer : sampleMsg6?.answer,
            chat_type: sampleMsg6?.chat_type,
            used_token : sampleMsg6?.used_token
          };
          newArray[lastIndex+1] = {
            ismode : 'server',
            id: sampleMsg2?.chat_id,
            user_question : sampleMsg2?.question,
            answer : sampleMsg2?.answer,
            chat_type: sampleMsg2?.chat_type,
            used_token : sampleMsg2?.used_token
          };
          newArray[lastIndex+2] = {
            ismode : 'server',
            id: sampleMsg3?.chat_id,
            user_question : sampleMsg3?.question,
            answer : sampleMsg3?.answer,
            chat_type: sampleMsg3?.chat_type,
            used_token : sampleMsg3?.used_token
          };
          newArray[lastIndex+3] = {
            ismode : 'server',
            id: sampleMsg4?.chat_id,
            user_question : sampleMsg4?.question,
            answer : sampleMsg4?.answer,
            chat_type: sampleMsg4?.chat_type,
            used_token : sampleMsg4?.used_token
          };
          newArray[lastIndex] = {
            ismode : 'server',
            id: sampleMsg5?.chat_id,
            user_question : sampleMsg5?.question,
            answer : sampleMsg5?.answer,
            chat_type: sampleMsg5?.chat_type,
            used_token : sampleMsg5?.used_token
          };
          return newArray;
        }) */
      }, 60);
    }
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname; // 항상 최신값 유지
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
    if ( isNewChat && outputCode.length > 0 ) {
      // 현 데이터를 히스토리에 넣는다 * 저장방식을 고민을 해야 한다 
      
      setChatSessionId('')
      setOutputCode([]);
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
  }, [isNewChat]);

  useEffect(() => {
    if ( !functions.isEmpty(oldHistoryData) ) {
      if ( !functions.isEmpty(oldHistoryData?.session_id) ) {
        setChatSessionId(oldHistoryData?.session_id)
        setOutputCode(oldHistoryData?.chattings);
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
      if ( userBasicInfo?.isGuest  ) {//비회원
        if ( in24UsedToken >= guestMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            isState : false,
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
          })
        }else{
          setChatDisabled({
            ...isChatDisabled,
            isState : true,
          })
        }
      }
    }
  }, [in24UsedToken,oldHistoryData,isNewChat]);
  /* 대화 불능 상태 컨트롤 */
 /*  useEffect(() => {
 
    if ( outputCode.length == mConstants.userMaxToken && !functions.isEmpty(chatSessionId)) {
      console.log('handleTranslate outputCode,chatSessionId chatSessionId else')
      setChatDisabled({
        ...isChatDisabled,
        isState : false,
        isAlertMsg : false
      })
    }else if (  outputCode.length < mConstants.userMaxToken && !functions.isEmpty(chatSessionId) ) {
      setChatDisabled({
        ...isChatDisabled,
        isState : true,
        isAlertMsg : true
      })
    }
  }, [outputCode,chatSessionId]); */
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
  
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaX !== 0) return;
        setShowScroll((prev) => {
          const goingUp = e.deltaY < 0;
          return goingUp !== prev ? !prev : prev;
        });
      };
  
      el.addEventListener("wheel", handleWheel);
      // 정리
      return () => {
        console.log("handleWheel ❌ wheel 이벤트 해제");
        el.removeEventListener("wheel", handleWheel);
      };
    }, 500); // 0.5초 후에 강제 시도
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const check = setInterval(() => {
      const el = scrollRef.current;
      const target = scrollBottomRef.current;
      
      if (el && target) {
        console.log('✅ 초기화 성공:', el, target);
  
        const observer = new IntersectionObserver(
          ([entry]) => {
            console.log('📍 감지됨:', entry.isIntersecting);
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
    }, 100);
  
    return () => clearInterval(check);
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
    if ( isReceiving ) {
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
      }else{
        setOutputCode([
          { chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg }
        ]);
      }
    }
  }

  const handleSendMessage = () => {
    if (!isReceiving) {
      handleTranslate(inputCode);
    } else {
      toast({
        title: 'AIGA',
        position: 'top-right',
        description: '수신중입니다. 잠시만 기다려주세요',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const onHandleTypeDone = () => {
    setIsLoading(false);
    setReceiving(false);
    setIsFocus(false);
  }

  const addMessage = (newItem: any) => {
    CurrentDialogStore.getState().setCurrentMessageData((prev: any) => [...prev, newItem]);
  }

  const handleTranslate = async( isText:any = '') => {
    const nowTokens = calculateTokenCount(inputCode);
    const nowTimeStamp = functions.getKSTUnixTimestamp();

    if ( in24UsedToken > 0 ) { 
      const realTimeIn24UsedToken = in24UsedToken+nowTokens;
      if ( userBasicInfo?.isGuest  ) {//비회원
        if ( realTimeIn24UsedToken >= guestMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            reTryTimeStamp : nowTimeStamp,
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
      setReceiving(true);
      const msgLen = parseInt(outputCode.length+1);
      const inputCodeText = isText;

      if ( isSystemText.includes(inputCodeText) ) {
        if( inputCodeText != outputCode[outputCode?.length -1]?.msg) { 
          if (Array.isArray(outputCode)) {
            setOutputCode([
              ...outputCode,
              { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }
            ])
          }else{
            setOutputCode([{ chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }])
          }
          //setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(), ismode: "system", msg: inputCodeText }]);
          setIsLoading(false);
          setReceiving(false);
          setIsFocus(false)
          return;
        }else{
          setIsLoading(false);
          setReceiving(false);
          setIsFocus(false)
          return;
        }
      }else{
        //setOutputCode((prevCode: any[]) => [...prevCode, { chat_id: functions.getUUID(),ismode: "me", question: inputCodeText }]);
        const newItem = {
          chat_id: functions.getUUID(),
          ismode: "me",
          question: inputCodeText,
        };
       /*  setOutputCode([
          ...(Array.isArray(outputCode) ? outputCode : []),
          newItem,
        ]); */
        console.log('setOutputCode 1',outputCode)
     
        addMessage(newItem)
      }
     
      try{
        setInputCode('')
        const questionResult:any = await ChatService.getChatMessage(chat_sessinn_id,inputCodeText.trim());
        if ( mConstants.apiSuccessCode.includes(questionResult?.statusCode) ) {
          const answerMessage = questionResult?.data;
          setIn24UsedToken(answerMessage?.in24_used_token);
          if ( answerMessage?.chat_type !== 'general' ) {
            setIsLoading(false);
            setReceiving(false);
            setIsFocus(false);
          }

          setTimeout(() => {
            addMessage(
              {
                ismode : 'server',
                isHistory : false,
                id: answerMessage?.chat_id,
                user_question : answerMessage?.question,
                answer : answerMessage?.answer,
                chat_type: answerMessage?.chat_type,
                used_token : answerMessage?.used_token
              }
            )
          }, 60); 
         
        }else{
          if ( questionResult?.message?.statusCode == '404') {
            const parsedMessage = parseLooselyFormattedJsonString(questionResult?.message?.message);
            if ( !functions.isEmpty(parsedMessage) && parsedMessage.message == '최대 토큰수 초과 에러') {
              setChatDisabled({
                reTrytimeStamp : parseInt(parsedMessage?.timestamp),
                isState : false,
                isAlertMsg : false
              })
              setIn24UsedToken(parsedMessage?.in24_used_token)
              setIsLoading(false);
              setReceiving(false);
              setIsFocus(false)
              
              setTimeout(() => {
                addMessage(
                  {
                    ismode : 'system',
                    isHistory : false,
                    id: functions.getUUID(),
                    user_question : inputCodeText,
                    answer : null,
                    msg: `일일 질문이 제한되었습니다.`,
                    chat_type : 'system',
                    used_token : 0
                  }
                )
              }, 60); 
              
            }else{
              call_fn_error_message();
            }
          }else{
            call_fn_error_message()
          }
        }
      }catch(e:any){
        console.log("handleTranslate error",e);
        call_fn_error_message();
      }
    }else{
      call_fn_error_message();
    }
  }


  const call_fn_error_message = () => {
    setIsLoading(false);
    setReceiving(false);
    toast({
      title: 'AIGA',
      position: 'top-right',
      description: '시스템이 불안정합니다. 잠시 뒤에 다시 시도해주십시요',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
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
    }, outputCode?.ismode == "me" ? 0 : 300); // or 100ms 정도로 조정 가능
    return () => clearTimeout(timeout);
  }, [outputCode]);

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
    /* const nowTokens = calculateTokenCount(Event.target.value);
    const nowTimeStamp = functions.getKSTUnixTimestamp();
    console.log('nowTokens',in24UsedToken,nowTokens,nowTimeStamp)
    if ( in24UsedToken > 0 ) { 
      const realTimeIn24UsedToken = in24UsedToken+nowTokens;
      if ( userBasicInfo?.isGuest  ) {//비회원
        if ( realTimeIn24UsedToken >= guestMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            reTryTimeStamp : nowTimeStamp,
            isState : false,
          })
        }else{
          setInputCode(Event.target.value);
        }
      }else{
        if ( realTimeIn24UsedToken >= userMaxToken ) {
          setChatDisabled({
            ...isChatDisabled,
            reTryTimeStamp : nowTimeStamp,
            isState : false,
          })
        }else{
          setInputCode(Event.target.value);
        }
      }
    }else{
      setInputCode(Event.target.value);
    } */
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
    <Flex 
      w={'100%'} 
      maxWidth={`${mConstants.desktopMinWidth}px`} 
      direction="column" 
      position="relative"
     
    >
      <Flex direction="column" w={'100%'} maxWidth={`${mConstants.desktopMinWidth}px`} >
        <Flex
          as="div"
          direction="column" w="100%" maxWidth={`${mConstants.desktopMinWidth}px` }
          maxH={"calc(100vh - 130px)"} /* 여기가 하단 스크롤 영역 영향 받음 */
          minH={"calc(100vh - 106px)" }
          overflowY='auto'
          ref={scrollRef}
          position="relative"
        >
          <Box display={outputCode?.length == 0 ? 'flex' : 'none'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} >
            <MotionWelcomeImage
              pt="120px"
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
          {/* <Box>
            <SelectType 
              onSendButton={onSendTypeButton}
              isDevelope={false}
            />
          </Box> */}
          { 
            outputCode.map((element:any,index:number) => {
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
                        isHistory={element?.isHistory}
                        onSendButton={onSendDoctorButton}
                      />
                    </Box>
                  )
                }else if ( element.chat_type === "search_doctor" ) {
                  return (
                    <Box key={index} display={functions.isEmpty(element) ? 'none' : 'block'}>
                      <SearchDoctor 
                        data={element}
                        isHistory={element?.isHistory}
                        onSendButton={onSendDoctorButton}
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
                        />
                      </Flex>
                    </Box>
                  )
                }else if ( element.chat_type === "general" ) {
                  return (
                    <Box key={index} display={functions.isEmpty(element.answer) ? 'none' : 'block'}>
                      <Flex w="100%" key={index}>
                        <GeneralMessage 
                          output={functions.makeLinkify(functions.cleanEscapedCharacters(element.answer.replace(/^"(.*)"$/, '$1').replaceAll(/\"/g, '')))} 
                          isHistory={element?.isHistory}
                          setIsTypingDone={() => onHandleTypeDone()}
                        />
                      </Flex>
                    </Box>
                  )
                }else {
                  return (
                    <Box key={index}>
                      <ChatWrongMessage
                        indexKey={index}
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
              }else if ( element.ismode == 'system') {
                return (
                  <Box key={index}>
                    <ChatWrongMessage
                      indexKey={index}
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
          { isReceiving && ( <Box><Processing  msg="분석중" /></Box> ) }
          <Box ref={scrollBottomRef} h="1px" pb={"60px"} visibility="hidden" />
        </Flex>
        <Flex 
          position="fixed" bottom={isMobileOnly ? `${keyboardHeight}px` : 0} left="0" w="100%"  bg={themeColor} zIndex="100" display={'flex'} justifyContent='center'
          transition="transform 0.2s ease"
          transform={`translateY(-${keyboardHeight}px)`}
        >
          <Box w={'100%'} position={'relative'} display={'flex'} flexDirection={'row'} zIndex="100" px="10px" py="10px"  borderTop={`1px solid  ${borderTopColor}`}>
            {
              ( !isChatDisabled?.isState && !isChatDisabled?.isAlertMsg ) && (
                <ChatDisable
                  isChatDisabled={isChatDisabled}
                  setChatDisabled={setChatDisabled}
                  userBasicInfo={userBasicInfo}
                />
              )
            }
            { ( isFocus && isChatDisabled.isState ) && ( <ChatWarningInfo /> )}
            <Flex 
              position={'absolute'}
              display={isShowScroll ? 'flex' : 'none'} 
              top={isFocus ? {base : '-80px', md : '-70px'} : {base : '-55px', md : '-45px'}}
              left={'0'}
              w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
              height={'30px'}
              justifyContent={'center'}
              alignItems={'center'}
              bg='transparent'
              zIndex={1000}
            >
              <Box
                display={'flex'}  width="40px" height={"40px"} cursor={'pointer'} zIndex={10} justifyContent='center' alignItems={'center'} 
                borderRadius={'20px'} backgroundColor={'#fff'}
                onClick={()=> scrollToBottom()}
                border={'1px solid #efefef'}
              >
                <Icon as={MdOutlineArrowDownward} width="25px" height="25px" color={navbarIcon} />
              </Box>
            </Flex>
            <Textarea
              minH="48px"
              //minH="unset"
              resize="none"
              as={ResizeTextarea}
              h="100%"
              maxH="150px"
              border="1px solid"
              borderColor={borderColor}
              bg={isFocus ? textareaBgcolor1 :textareaBgcolor2}
              readOnly={isReceiving}
              maxLength={mConstants.inputMaxMessage}
              borderRadius="25px"
              lineHeight={inputCode?.length > 10 ? "150%" : "180%"}
              //me="10px"
              fontSize="md"
              fontWeight="500"
              _focus={{ borderColor: '#2B8FFF' }}
              color={inputColor}
              _placeholder={placeholderColor}
              value={inputCode}
              placeholder="메시지 입력"
              onChange={handleChange}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              id={"textarea_content"}
              disabled={(!isChatDisabled?.isState || isReceiving)}
            />
            <Box display={'flex'} position={'absolute'} bottom={'6px'} right={'20px'} w={'55px'} height={'55px'} justifyContent={'flex-end'} alignItems={'center'}>
              {
                isReceiving
                ?
                <Box onClick={() => onHandleStopRequest()}  cursor={'pointer'} zIndex={10}>
                  <Image src={LoadingBar} alt="LoadingBar" style={{width:'30px', height:'30px'}} /> 
                </Box>
                :
                <Box
                  zIndex={10}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  cursor={'pointer'}
                >
                {
                  ( isFocus && isChatDisabled?.isState ) ? <SendButtonOn boxSize={'32px'} /> : <SendButtonOff boxSize={'32px'} />
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
      </Flex>
    </Flex>
  );
}