'use client';
/*eslint-disable*/
import { signIn, signOut, useSession } from "next-auth/react";
import customfetch from '@/utils/customfetch';
import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import { 
    Box,Button,Flex,Icon,Textarea,Text,useColorModeValue,Drawer,DrawerOverlay,DrawerContent,DrawerBody,DrawerCloseButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,
    ModalCloseButton,useToast,SkeletonText,useColorMode
} from '@chakra-ui/react';
import { useEffect, useState,useRef,useCallback } from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit, MdInfoOutline, MdPerson } from 'react-icons/md';
import DoctorDetail  from '@/components/modal/Doctor';
import SelectBody  from '@/components/msgType/SelectBody';
import SelectDoctor  from '@/components/msgType/SelectDoctor';
import SelectName  from '@/components/msgType/SelectName';
import Welcome  from '@/components/msgType/Welcome';
import MotionWelcome,{MotionWelcomeImage}  from '@/components/msgType/MotionWelcome';
import Processing  from '@/components/msgType/Processing';

import SelectType  from '@/components/msgType/SelectType';
import { useTranslations } from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import HeadTitle from '@/components/modal/Title';
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';
import * as ChatService from "@/services/chat/index";
import SendButtonOff from "@/assets/icons/send_btn_off.png";
import SendButtonOn from "@/assets/icons/send_btn_on.png";

export default function ChatBot() {
  const t = useTranslations('Messages');
  // 세션 상태 확인
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  // Input States
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isAccessFirst, setAccessFirst] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [isShowScroll, setShowScroll] = useState(false);
  const [isReceiving, setReceiving] = useState(false);
  const toast = useToast();
  // Response message
  const [outputCode, setOutputCode] = useState<any>([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Loading state
  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const [isOpenDoctorDrawer, setIsOpenDoctorDrawer] = useState<boolean>(false);
  const [isOpenReview, setIsOpenReview] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');
  const infoIcon = useColorModeValue('#f94848', 'white');
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue( 'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)','whiteAlpha.200' );
  const brandColor = useColorModeValue('brand.500', 'white');
  const themeColor = useColorModeValue('white', 'navy.900');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue('14px 27px 45px rgba(112, 144, 176, 0.2)','none');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });
  
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

  const getNewSessionID =  async() => {
    try{
      console.log("chatSessionId",chatSessionId)
      if ( functions.isEmpty(chatSessionId) ) {
        const res:any = await ChatService.getChatNewSession();
        console.log("res of getNewSessionID",res)
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
      setTimeout(() => {
        setNewChatOpen(false);
      }, 1000);
    }
  }, [isNewChat]);
  
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
    setIsOpenReview(false);
    setSelectedDoctor(data)
    if ( isType == 1 ) {
      setIsOpenDoctorModal(true);
    }else{
      setIsOpenDoctorDrawer(true);
    }
  }

  const onSendNameButton = async( str : string) => {
    if ( !isReceiving ) await handleTranslate(str);
  }

  const onSendTypeButton = async( typeString : string ) => {
    if ( !isReceiving ) await handleTranslate(typeString);
  }

  const handleTranslate_get = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "me", msg: inputCodeText }]);
    setInputCode('')

    const BaseAPI = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
    const response = await fetch(`${BaseAPI}/see`,{credentials: 'include'});

    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    
    let streamData:string = "";
    while (true) {
      const { value, done } : any = await reader?.read();
    
      if (done) {
        setLoading(false);
        setReceiving(false);
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

  if (isLoading) {
    return (
      <Flex
        w={{ base: '100%',md: `${mConstants.desktopMinWidth}px` }}
        maxWidth={{ base: '100%', md: `${mConstants.desktopMinWidth-30}px` }}
        height={'100%'}
        padding={"10px"}
        direction="column"
        position="relative"
      >
        <Flex direction="column" mx="auto" w={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
          <SkeletonText mt='4' noOfLines={10} spacing='4' skeletonHeight='2' />
        </Flex>
      </Flex>
    )
   }
  return (
    <Flex
      top={"35px"}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      maxWidth={'640px'}
      padding={"10px"}
      direction="column"
      position="relative"
    >
      <Flex 
        direction="column" 
        mx="auto" 
        w={'100%'} 
        overflowY='scroll' 
        //minH="calc(100vh - 100px)"
      >
        <Flex
          direction="column"
          w="100%"
          maxH="calc(100vh - 100px)" /* 여기가 하단 스크롤 영역 영향 받음 */
          minH="calc(100vh - 100px)"
          overflowY='auto'
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
          ref={scrollRef}
        >
          <Box 
            display={outputCode?.length == 0 ? 'flex' : 'none'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            paddingTop={{base : "70px", md : "60px"}}
          >
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
                    <Flex
                      p="10px"
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="14px"
                      w="auto"
                      zIndex={'2'}
                    >
                      <Text
                        color={textColor}
                        fontWeight="600"
                        fontSize={{ base: 'sm', md: 'md' }}
                        lineHeight={{ base: '24px', md: '26px' }}
                        whiteSpace="pre-line"
                      >
                        {element?.msg}
                      </Text>
                    </Flex>
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg={'transparent'}
                      border="1px solid"
                      borderColor={borderColor}
                      ms="10px"
                      h="40px"
                      minH="40px"
                      minW="40px"
                    >
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
          {
            isReceiving && (
              <Box>
                <Processing 
                  msg="증상 분석중"
                />
              </Box>
            )
          }
          
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
        {/* Chat Input */}
        {/* <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          maxH="60px"
          justifySelf={'flex-end'}
        > */}
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
            w={{ base: '100%', md: `${mConstants.desktopMinWidth-10}px` }}
            maxWidth={'640px'}
            position={'relative'}
            display={'flex'} 
            flexDirection={'row'}
          >
            <Box 
              display={isFocus ? 'flex' : 'none'} 
              position={'absolute'}
              top={{base : '-40px', md : '-30px'}}
              left={'0'}
              w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
              height={'30px'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box display='flex' alignItems='center' gap='5px' width={"90%"}>
                <Icon as={MdInfoOutline} width="20px" height="20px" color={infoIcon} />
                <Text fontSize='0.8rem' color='gray.500' lineHeight={'0.8rem'}>
                  AIGA는 실수를 할 수 있습니다. 본 AI서비스는 의료행위가 아니며 답변에 어떠한 책임도 지지 않습니다.
                </Text>
              </Box>
            </Box>
            <Textarea
              minH="50px"
              //minH="unset"
              resize="vertical"
              h="100%"
              maxH="100px"
              border="1px solid"
              borderColor={borderColor}
              bg={isFocus ? 'transparent' :'#f4f6fa'}
              readOnly={isReceiving}
              borderRadius="25px"
              //me="10px"
              fontSize="sm"
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
            />
            <Box 
              display={'flex'} 
              position={'absolute'}
              bottom={'0px'}
              right={'10px'}
              w={'55px'}
              height={'55px'}
              justifyContent={'flex-end'}
              alignItems={'center'}
            >
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
                    <Image 
                      src={SendButtonOn}
                      alt="send"
                      style={{width:'32px',objectFit: 'contain'}}
                    />
                    :
                    <Image 
                      src={SendButtonOff}
                      alt="send"
                      style={{width:'32px',objectFit: 'contain'}}
                    />
                  }
                </Box>
              }
            </Box>
          </Box>
        </Flex>
        {
          isOpenDoctorDrawer && (
            <Box display={ isOpenReview ? 'none' : 'block'} position="fixed" minH="100%">
              <Drawer
                isOpen={isOpenDoctorDrawer}
                onClose={() => setIsOpenDoctorDrawer(false)}
                placement={'left'}
              >
                <DrawerOverlay />
                <DrawerContent
                  w="100%"
                  maxW={`${mConstants.modalMaxWidth}px`}
                  borderRadius="0px"
                  bg={sidebarBackgroundColor}
                >
                  <HeadTitle title={"의사명 프로필"}/>
                  <DrawerCloseButton
                    zIndex="3"
                    onClick={() => setIsOpenDoctorDrawer(false)}
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ boxShadow: 'none' }}
                  />
                  <DrawerBody maxW={`${mConstants.modalMaxWidth}px`} px="10px" pb="0">
                    <DoctorDetail
                      data={selectedDoctor}
                    />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Box>
          )
        }
        {
          isOpenDoctorModal && (
            <Modal
              onClose={() => setIsOpenDoctorModal(false)}
              isOpen={isOpenDoctorModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1}>
                <ModalHeader>{"의사명 프로필"}</ModalHeader>
                <ModalCloseButton />
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