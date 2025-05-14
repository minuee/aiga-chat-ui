'use client';
/*eslint-disable*/
import { signIn, signOut, useSession } from "next-auth/react";
import customfetch from '@/utils/customfetch';
import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { 
    Box,Button,Flex,Icon,Textarea,Input,Text,useColorModeValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Portal
} from '@chakra-ui/react';
import { useEffect, useState,useRef } from 'react';
import Image from "next/image";
import { MdOutlineArrowDownward, MdFitbit, MdInfoOutline, MdPerson } from 'react-icons/md';
import DoctorDetail  from '@/components/modal/Doctor';
import SelectBody  from '@/components/msgType/SelectBody';
import SelectDoctor  from '@/components/msgType/SelectDoctor';
import SelectName  from '@/components/msgType/SelectName';
import Welcome  from '@/components/msgType/Welcome';
import SelectType  from '@/components/msgType/SelectType';
import {useTranslations} from 'next-intl';
import LoadingBar from "@/assets/icons/loading.gif";
import HeadTitle from '@/components/modal/Title';
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';


export default function ChatBot() {
  const t = useTranslations('Messages');
  // 세션 상태 확인
  const { data: session, status } = useSession();
  console.log("session",session,status)
  // Input States
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isAccessFirst, setAccessFirst] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [isShowScroll, setShowScroll] = useState(false);
  const [isReceiving, setReceiving] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  // Response message
  const [outputCode, setOutputCode] = useState<any>([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef(null)
  const formBtnRef = useRef(null)
  const reviewBtnRef = useRef(null)
  // Loading state
  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const [isOpenDoctorDrawer, setIsOpenDoctorDrawer] = useState<boolean>(false);
  const [isOpenReview, setIsOpenReview] = useState<boolean>(false);
  const [isOpenRequestModal, setIsOpenRequestModal] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'black');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const themeColor = useColorModeValue('white', 'navy.900');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue('14px 27px 45px rgba(112, 144, 176, 0.2)','none');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });
  

  const isSystemText = [
    "system_text","system_doctors","system_list","system_select","system_image"
  ]

  useEffect(() => {
    if ( !isAccessFirst ) {
      
    }
    return () => setAccessFirst(false);
  }, [isAccessFirst]);

  useEffect(() => {
    console.log("isNewChat",isNewChat,outputCode.length)
    if ( isNewChat && outputCode.length > 0 ) {
      
      // 현 데이터를 히스토리에 넣는다 * 저장방식을 고민을 해야 한다 
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
          console.log("스크롤 상태 변경:", !prev);
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
      console.log("scrollToBottom",el)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setShowScroll(false)
    }
  };

  const handleTranslate = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    
    if ( isSystemText.includes(inputCodeText) ) {
      console.log("ddddddddd", inputCodeText,outputCode[outputCode?.length -1]?.msg)
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

    const url = 'http://localhost:9999/api/v1/chat'
 
    const payload = {
      "user_id": "minuee",
      "msg_type": isText,
      "msg": inputCodeText
    }

     /*let reader:any = null;
    const response = await fetch('http://localhost:9999/api/v1/see',{credentials: 'include'});
    const reader = response?.body?.getReader();
    console.log("reader",reader) */
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
        setLoading(false);
        setReceiving(false);
        console.log('🔚 스트림 종료됨');
        break;
      }
    
      const chunk = decoder.decode(value, { stream: true });
      console.log('📥 받은 메시지:', chunk);
     
      if ( chunk ) {
        //setOutputCode((prevCode) => prevCode + chunk);
        //setOutputCode((prevCode:any) => prevCode.push({ismode:"server",msg:chunk}));
        streamData = streamData.concat(chunk);
      }else{
        console.error('data가 null입니다. getReader를 호출할 수 없습니다.');
      }
      //setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "server", msg: streamData }]);
      // 필요하다면 chunk를 파싱해서 처리하세요 (예: data: ... 형식 파싱)
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
    //setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "server", msg: streamData }]);
    //if (scrollRef?.current) scrollRef?.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowScroll(false)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, outputCode?.ismode == "me" ? 0 : 300); // or 100ms 정도로 조정 가능
    console.log("outputCode",outputCode)
    return () => clearTimeout(timeout);
  }, [outputCode]);


  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const onSendButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  const onSendWelcomeButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  const onSendDoctorButton = async( isBool : boolean,isType : number) => {
    console.log("onSendDoctorButton",isBool,isType)
    setIsOpenReview(false);
    if ( isType == 1 ) {
      setIsOpenDoctorModal(isBool);
    }else{
      setIsOpenDoctorDrawer(isBool);
    }
  }

  const onSendNameButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  const onSendTypeButton = async( typeString : string ) => {
    console.log("onSendTypeButton",typeString)
    await handleTranslate(typeString);
  }

  const handleTranslate_get = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "me", msg: inputCodeText }]);
    setInputCode('')

    const response = await fetch('http://localhost:9999/api/v1/see',{credentials: 'include'});
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

  const onHandleRegistReview = (data:any) => {
    console.log("onHandleRegistReview",data)
  }

  const onHandleEditDoctor = (id:string) => {
    console.log("onHandleEditDoctor",id)
    if ( id ) {
      setIsOpenRequestModal(true);
    }
  }

  const onHandleRequestDoctor = (data:any) => {
    console.log("onHandleRequestDoctor",data)
  }

  return (
    <Flex
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      maxWidth={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      //pt={{ base: '0px', lg: '0px' }}
      padding={"10px"}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={'100%'}
        overflowY='scroll'
        //minH={{ base: '75vh', md: '85vh'  }}
        //minH="calc(100vh - 150px)"
        //maxH={{ base: '75vh', md: '85vh'  }}
        //height={`calc(var(--vh, 1vh) * 85)`}
        //maxW="1024px"
        minH="calc(100vh - 100px)"
      >
        {/* <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          
        </Flex> */}
        <Flex
          direction="column"
          w="100%"
          //maxH={{ base: '75vh', md: '85vh' }}
          //height={`calc(var(--vh, 1vh) * 100)`}
          maxH="calc(100vh - 200px)" /* 여기가 하단 스크롤 영역 영향 받음 */
          overflowY='auto'
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
          ref={scrollRef}
        >
          <Box>
            <Welcome 
              msg={`${t("welcome_msg",{app_name:"AIGA"})}`}
              onSendButton={onSendButton}
            />
          </Box>
          <Box>
            <SelectType 
              onSendButton={onSendTypeButton}
            />
          </Box>
          {/* <Box>
            <SelectBody 
              onSendButton={onSendWelcomeButton}
            />
          </Box>
          <Box>
            <SelectDoctor 
              onSendButton={onSendDoctorButton}
            />
          </Box>
          <Box mb={3}>
            <SelectName 
              data={[]}
              onSendButton={onSendNameButton}
            /> 
          </Box>*/}
          { 
            outputCode.map((element:any,index:number) => {
              if ( element.ismode == 'me') {
                return (
                  <Flex w="100%" align={'center'} mb="10px"  mt="5px"  key={element.id} justifyContent='flex-end'>
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
                      <Icon
                        as={MdPerson}
                        width="20px"
                        height="20px"
                        color={brandColor}
                      />
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
                        <Icon
                          as={MdFitbit}
                          width="20px"
                          height="20px"
                          color="white"
                        />
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
                      <Icon
                        as={MdFitbit}
                        width="20px"
                        height="20px"
                        color="white"
                      />
                    </Flex>
                    <MessageBoxChat output={element.msg} />
                  </Flex>
                )
              }
            })
          }
          
          { isShowScroll &&  
            (
              <Box
                position={'absolute'}
                right="10px"
                bottom={{base : "100px", md:"150px"}}
                width="50px"
                height={"50px"}
                zIndex={10}
                display={'flex'}
                justifyContent='center'
                alignItems={'center'}
                onClick={()=> scrollToBottom()}
              >
                <Icon
                  as={MdOutlineArrowDownward}
                  width="40px"
                  height="40px"
                  color={navbarIcon}
                />
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
                <Icon as={MdInfoOutline} width="20px" height="20px" color={navbarIcon} />
                <Text fontSize='0.8rem' color='gray.500' lineHeight={'0.8rem'}>
                  AIGA는 의료행위가 아니며 또한 실수 할 수 있습니다. 그 어떠한 책임도 안집니다. 
                </Text>
              </Box>
            </Box>
            <Textarea
              minH="40px"
              h="100%"
              maxH="55px"
              border="1px solid"
              borderColor={borderColor}
              readOnly={isReceiving}
              borderRadius="15px"
              me="10px"
              fontSize="sm"
              fontWeight="500"
              _focus={{ borderColor: 'none' }}
              color={inputColor}
              _placeholder={placeholderColor}
              value={inputCode}
              placeholder="Type your message here..."
              onChange={handleChange}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
            <Button
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="15px"
              ms="auto"
              w={{ base: '160px', md: '210px' }}
              h="54px"
              _hover={{
                boxShadow:
                  '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
                _disabled: {
                  bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                },
              }}
              onClick={() => handleTranslate(inputCode)}
              isLoading={loading ? true : false}
            >
              {
                isReceiving
                ?
                <Image 
                  src={LoadingBar}  
                  alt="LoadingBar" 
                  style={{width:'30px', height:'30px'}}
                /> 
                :
                <Text>
                  전송
                </Text>
              }
            </Button>
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
                      isOpen={isOpenDoctorDrawer}
                      setClose={() => setIsOpenDoctorDrawer(false)}
                      onHandleWriteReview={() => setIsOpenReview(true)}
                      onHandleEditDoctor={(id) => onHandleEditDoctor(id)}
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
                    isOpen={isOpenDoctorModal}
                    setClose={() => setIsOpenDoctorModal(false)}
                    onHandleWriteReview={() => setIsOpenReview(true)}
                    onHandleEditDoctor={(id) => onHandleEditDoctor(id)}
                  />
                </ModalBody>
               {/*  <ModalFooter>
                  <Button onClick={() => setIsOpenDoctorModal(false)}>Close</Button>
                </ModalFooter> */}
              </ModalContent>
            </Modal>
          )
        }
      </Flex>
    </Flex>
  );
}
