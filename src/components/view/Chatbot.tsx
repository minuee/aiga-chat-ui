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
import SelectName  from '@/components/msgType/SelectName';
import Welcome  from '@/components/msgType/Welcome';
import { ChatDisable,ChatWarningInfo }  from '@/components/msgType/ChatOptionView';
import MotionWelcome,{MotionWelcomeImage}  from '@/components/msgType/MotionWelcome';
import Processing  from '@/components/msgType/Processing';
import SkeletonDefaultText from "@/components/fields/LoadingBar";

import SelectType  from '@/components/msgType/SelectType';
import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';
import historyStore from '@/store/historyStore';
import { ModalDoctorDetailStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorListStore,DrawerHistoryStore,ModalMypageStore,ModalMypageNoticeStore,ModalMypageRequestStore,ModalMypageEntireStore } from '@/store/modalStore';

import * as ChatService from "@/services/chat/index";
import SendButtonOff from "@/assets/icons/send_btn_off.png";
import SendButtonOn from "@/assets/icons/send_btn_on.png";

export default function ChatBot() {
  const t = useTranslations('Messages');
  const { colorMode, toggleColorMode } = useColorMode();
  // Input States
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isAccessFirst, setAccessFirst] = useState<boolean>(false);
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
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocale, setCurrentLocale] = useState('ko');
  // Loading state
  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const setCurrentPathname = historyStore((state) => state.setCurrentPathname);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'white');
  const themeColor = useColorModeValue('white', 'navy.900');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const isSystemText = ["system_text","system_doctors","system_list","system_select","system_image"];

  const [chatSessionId, setChatSessionId] = useState<string>('');

  useEffect(() => {
    if ( functions.isEmpty(chatSessionId) ) {
      //getNewSessionID()
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
    }
    return () => setChatSessionId('');
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
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)
    }, 200);
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
    router.replace(`/${locale}/chat#drawer_history`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','drawer_history');
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

  useEffect(() => {
    const handlePopState = async(event: PopStateEvent) => {
      const currentPathname = await mCookie.getCookie('currentPathname')
      const currentPath = pathnameRef.current;
      // 특정 경로에서만 모달 닫기 또는 리디렉션 처리
      switch(currentPathname) {
        case `${mConstants.pathname_modal_2}`:
        case '' : 
            event.preventDefault(); // 기본 뒤로가기 방지
            fn_close_modal_doctor_detail2();
            fn_close_modal_doctor_detail();
          break;
        case `${mConstants.pathname_modal_3}` :
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_doctor_review()
          break;
        case `${mConstants.pathname_modal_3_2}` :
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_doctor_review2()
          break;
        case `${mConstants.pathname_modal_4}` : 
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_doctor_request();
          break;
        case `${mConstants.pathname_modal_1}` :
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_doctor_list();
          break;
        case `${mConstants.pathname_modal_2_2}` :
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_doctor_detail();
          fn_close_modal_doctor_detail2();
          break;
        case 'drawer_history' :
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_drawer_history()
          break;
        case 'modal_mypage_profile' : 
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_mypage();
          break;
        case `${mConstants.pathname_modal_5}` : 
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_notice_list();
          break;
        case `${mConstants.pathname_modal_6}` : 
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_mypage_request();
          break;
        case `${mConstants.pathname_modal_7}` : 
          event.preventDefault(); // 기본 뒤로가기 방지
          fn_close_modal_mypage_entire();
          break;
        default : 
          event.preventDefault(); // 기본 뒤로가기 방지
      }
    };
    // popstate는 브라우저 뒤로가기, Android 백버튼에서 동작함
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // ✅ 한 번만 등록

  const getNewSessionID =  async() => {
    try{
      if ( functions.isEmpty(chatSessionId) ) {
        const res:any = await ChatService.getChatNewSession();
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsLoading(false)
          setChatSessionId(res?.data?.session_id)
        }          
      }
    }catch(e:any){
      console.log("error of getNewSessionID",e)
    }
  }

  useEffect(() => {
    if ( !isAccessFirst ) {
      
    }
    return () => setAccessFirst(false);
  }, [isAccessFirst]);

  useEffect(() => {
    if ( isNewChat && outputCode.length > 0 ) {
      // 현 데이터를 히스토리에 넣는다 * 저장방식을 고민을 해야 한다 
      getNewSessionID()
      setOutputCode([]);
      setChatDisabled({
        isState : true,
        isAlertMsg : false
      })
      setCurrentPathname('')
      mCookie.setCookie('currentPathname','')
      setTimeout(() => {
        setNewChatOpen(false);
      }, 1000);
    }
  }, [isNewChat]);

  useEffect(() => {
    if ( outputCode.length == 4 ) {
      setChatDisabled({
        isState : false,
        isAlertMsg : false
      })
    }
  }, [outputCode]);
  
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

  const onHandleStopRequest = () => {
    setReceiving(false);
    setLoading(false)
  }

  const handleTranslate = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    
    if ( isSystemText.includes(inputCodeText) ) {
      if( inputCodeText != outputCode[outputCode?.length -1]?.msg) { 
        setOutputCode((prevCode: any[]) => [...prevCode, { id: functions.getUUID(), ismode: "system", msg: inputCodeText }]);
        setLoading(false);
        setReceiving(false);
        return;
      }else{
        setLoading(false);
        setReceiving(false);
        return;
      }
    }else{
      setOutputCode((prevCode: any[]) => [...prevCode, { id: functions.getUUID(),ismode: "me", msg: inputCodeText }]);
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
          setLoading(false);
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
          direction="column"
          w="100%"
          maxWidth={`${mConstants.desktopMinWidth}px` }
          maxH="calc(100vh - 100px)" /* 여기가 하단 스크롤 영역 영향 받음 */
          minH="calc(100vh - 100px)"
          overflowY='auto'
          display={outputCode ? 'flex' : 'none'}
          ref={scrollRef}
        >
          <Box display={outputCode?.length == 0 ? 'flex' : 'none'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}  paddingTop={{base : "70px", md : "60px"}}>
            {/* <Welcome 
              msg={`${t("welcome_msg",{app_name:"AIGA"})}`}
              onSendButton={onSendButton}
            /> */}
            <MotionWelcomeImage
              pt="20px"
            />
            <MotionWelcome 
              msg={`안녕하세요!`}
              pt="20px"
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
            />
          </Box>
          { 
            outputCode.map((element:any,index:number) => {
              if ( element.ismode == 'me') {
                return (
                  <Flex w="100%" align={'center'} mb="10px"  mt="5px" key={element.id} justifyContent='flex-end'>
                    <Flex p="10px" border="1px solid" borderColor={borderColor} borderRadius="14px" w="auto" zIndex={2}>
                      <Text color={textColor} fontWeight="600" fontSize={{ base: 'sm', md: 'md' }} lineHeight={{ base:'24px',md:'26px'}} whiteSpace="pre-line">
                        {element?.msg}
                      </Text>
                    </Flex>
                    <Flex borderRadius="full" justify="center" align="center" bg={'transparent'} border="1px solid" borderColor={borderColor} ms="10px" h="40px" minH="40px" minW="40px">
                      <Icon as={MdPerson} width="20px" height="20px" color={brandColor} />
                    </Flex>
                  </Flex>
                )
              }else if ( element.ismode == 'system') {
                if ( element.msg === "system_doctors" ) {
                  return (
                    <Box key={element.id}>
                      <SelectDoctor 
                        onSendButton={onSendDoctorButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "system_list" ) {
                  return (
                  <Box key={element.id}>
                    <SelectName 
                      data={[]}
                      onSendButton={onSendNameButton}
                    /> 
                  </Box>
                  )
                }else if ( element.msg === "system_select" ) {
                  return (
                    <Box key={element.id}>
                      <Welcome 
                        msg={`안녕하세요? 건강AI AIGA에요\r\n누가 아프신가요?`}
                        onSendButton={onSendButton}
                      />
                    </Box>
                  )
                }else if ( element.msg === "system_image" ) {
                  return (
                    <Box key={element.id}>
                      <SelectBody 
                        onSendButton={onSendWelcomeButton}
                      />
                    </Box>
                  )
                }else {
                  return (
                    <Flex w="100%" key={element.id} margin="10px 0">
                      <Flex
                        borderRadius="full"
                        justify="center"
                        align="center"
                        bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                        me="10px"
                        h="40px"
                        minH="40px"
                        minW="40px"
                      >
                        <Icon as={MdFitbit} width="20px" height="20px" color="white" />
                      </Flex>
                      <MessageBoxChat output={"잘못된 선택입니다.."} />
                    </Flex>
                  )
                }
              }else{
                return (
                  <Flex w="100%" key={element.id} mb="10px">
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                      me="10px"
                      h="40px"
                      minH="40px"
                      minW="40px"
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
                position={'absolute'}
                right="10px"
                bottom={{base : "100px", md:"50px"}}
                width="50px"
                height={"50px"}
                zIndex={10}
                display={'flex'}
                justifyContent='center'
                alignItems={'center'}
                onClick={()=> scrollToBottom()}
              >
                <Icon as={MdOutlineArrowDownward} width="40px" height="40px" color={navbarIcon} />
              </Box>
            )
          }
          <Box ref={scrollBottomRef} h="1px" pb={"30px"} />
        </Flex>
        <Flex
          position="fixed"          // ✅ 고정 위치
          bottom="0"                // ✅ 화면 하단에 붙임
          left="0"
          w="100%"                  // ✅ 전체 너비
          //maxW="1024px"
          px="20px"                 // 양쪽 여백
          py="10px"                 // 위아래 여백
          bg={themeColor}                // 배경색 (필수! 안 넣으면 뒤 채팅이 비쳐요)
          zIndex="100"              // 채팅보다 위에 오게
          //boxShadow="0 -2px 10px rgba(0,0,0,0.05)" // 선택: 살짝 그림자 효과
          display={'flex'}
          justifyContent='center'
          //alignItems={'center'}
        >
          <Box 
            w={{ base: '100%', md: `${mConstants.desktopMinWidth-20}px` }}
            maxWidth={`${mConstants.desktopMinWidth}px` }
            position={'relative'}
            display={'flex'} 
            flexDirection={'row'}
          >
            {
              ( !isChatDisabled?.isState && !isChatDisabled?.isAlertMsg ) && (
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
                        duration: 2000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {
                    isFocus 
                    ?
                    <Image src={SendButtonOn} alt="send" style={{width:'32px',objectFit: 'contain'}} />
                    :
                    <Image src={SendButtonOff} alt="send" style={{width:'32px',objectFit: 'contain'}} />
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
                <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box flex={1} display={{base :'flex', md:'none'}} alignItems={'center'}  onClick={() => fn_close_modal_doctor_detail()} cursor={'pointer'}>
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box flex={3} display={{base :'none', md:'flex'}}  alignItems={'center'} >
                      <Text color={'white'} noOfLines={1}>{"{의사명} 교수"}</Text>
                    </Box>
                    <Box flex={3} display={{base :'flex', md:'none'}} alignItems={'center'} justifyContent={'flex-end'}>
                      <Text color={'white'} noOfLines={1}>{"{의사명} 교수"}</Text>
                    </Box>
                    <Box 
                      flex={1} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  cursor={'pointer'}
                      onClick={() => fn_close_modal_doctor_detail()} 
                     >
                      <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody >
                  <DoctorDetail
                    data={selectedDoctor}
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