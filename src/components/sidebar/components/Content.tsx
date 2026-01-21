'use client';
// chakra imports
import { Box,Button,Flex,Icon,Menu,MenuButton,Stack,Text,useColorModeValue,useDisclosure,SkeletonText, Modal,ModalOverlay,ModalContent,ModalHeader,useToast,ModalBody } from '@chakra-ui/react';
import Image from "next/image";
import { HSeparator } from '@/components/separator/Separator';
//   Custom components
import { DefaultProfile } from '@/components/icons/svgIcons';
import NextImage from 'next/legacy/image';
import Alert from '@/components/alert/Alert';
import ProfileSetting from '@/components/modal/ProfileSetting';
import Brand from '@/components/sidebar/components/Brand';
import React, { useRef } from 'react';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import * as ChatService from "@/services/chat/index";
import { MdOutlineSettings,MdArrowBack,MdOutlineClose, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import mConstants from '@/utils/constants';
import * as history from '@/utils/history';
import functions from "@/utils/functions";
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import groupSessionsByDateSorted from "./GroupSort";
import LoadingBar from "@/assets/icons/loading.gif";
//새창열기 전역상태
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore } from '@/store/newChatStore';
import { ModalMypageStore,DrawerHistoryStore } from '@/store/modalStore';
import HistoryItem from '@/components/text/HistoryItem';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconNotice } from '@/components/icons/svgIcons';
import TokenGuard from '@/components/apiModal/TokenGuard';

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { onParentClose } = props;  
  const [ isLoading, setIsLoading] = React.useState(true);
  const [ isReceiving, setIsReceiving] = React.useState(false);
  const { isOpenSetupModal } = ModalMypageStore(state => state);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [historyData, setHistoryData] = React.useState<any>([]);
  const toast = useToast();
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);

  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);

  const handleToggle = (index: number) => {
    setOpenIndexes(prevIndexes =>
      prevIndexes.includes(index)
        ? prevIndexes.filter(i => i !== index)
        : [...prevIndexes, index]
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const iconSubColor = useColorModeValue('gray.500', 'white');
  const iconColor = useColorModeValue('navy.700', 'white');
  const setupBgColor = useColorModeValue( '#e9edf3','navy.900' );
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor2 = useColorModeValue('gray.500', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const buttonBgColor = useColorModeValue('#2b8fff', 'rgb(0, 133, 250)');
  const buttonTextColor = useColorModeValue('white', '#ffffff');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = useRef();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollAfterOpenIndexesChangeRef = useRef(false);
  const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
  const currentHistorySelectDate = ChatSesseionIdStore(state => state.currentHistorySelectDate);
  const setChatSessionId = ChatSesseionIdStore((state) => state.setChatSessionId);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const setOldHistoryData = CallHistoryDataStore((state) => state.setOldHistoryData);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);

  React.useEffect(() => {
    console.log('dateString currentHistorySelectDate',currentHistorySelectDate)
  }, [currentHistorySelectDate]);

  React.useEffect(() => {
    if (openIndexes.length > 0 && scrollContainerRef.current && scrollAfterOpenIndexesChangeRef.current) {
        const indexToScrollTo = openIndexes[0];
        const targetGroupElement = groupRefs.current[indexToScrollTo];

        if (targetGroupElement) {
            setTimeout(() => {
                targetGroupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                scrollAfterOpenIndexesChangeRef.current = false; // Reset flag after scroll
            }, 100);
        }
    }
  }, [openIndexes, scrollContainerRef.current]);

  React.useEffect(() => {
    setTimeout(() => {
      getMyHistoryData();
    }, 300)
  }, []);

  React.useEffect(() => {
    if (historyData?.length > 0) { // Check historyData.length
        if (currentHistorySelectDate) {
            const index = historyData.findIndex((group: any) => group.date === currentHistorySelectDate);
            if (index !== -1) {
                setOpenIndexes([index]);
                scrollAfterOpenIndexesChangeRef.current = true; // Set flag
            } else {
                setOpenIndexes([0]);
                scrollAfterOpenIndexesChangeRef.current = true; // Set flag
            }
        } else { // No currentHistorySelectDate, default to first group
            setOpenIndexes([0]);
            scrollAfterOpenIndexesChangeRef.current = true; // Set flag
        }
    } else { // No historyData
        setOpenIndexes([]);
        // No scroll needed if no history
    }
  }, [historyData, currentHistorySelectDate]);

  const getMyHistoryData = async() => {
    try{
      const res:any = await ChatService.getChatHistoryList();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        const reData = groupSessionsByDateSorted(res?.data?.history.sessions)
        setHistoryData(reData)
        setIsLoading(false)
      }
    }catch(e:any){
      setIsLoading(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onDeleteHistory = async(session_id: any) => {

    /* if ( chatSessionId == session_id ) {
      toast({
        title: "현재 사용중인 세션은 삭제가 불가합니다.",
        position: 'top-right',
        isClosable: true,
        duration:2000,
        status: 'info',
        containerStyle: {
          color: '#ffffff',
        }
      });
      return;
    } */

    try{
      setIsReceiving(true)
      const res:any = await ChatService.removeChatHistory(session_id);
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsReceiving(false)
        //const newHistoryData = historyData.filter((item:any) => item.session_id !== session_id);
        const newHistoryData = await historyData.map((item:any) => {
          const newSessions = item.sessions.filter((subItem: any)  => subItem.session_id !== session_id);
          return {
            ...item,
            sessions: newSessions,
          };
        })
        setHistoryData(newHistoryData);
        toast({
          title: "정상적으로 삭제되었습니다.",
          position: 'top-left',
          isClosable: true,
          duration:1500,
          status: 'success',
          containerStyle: {
            color: '#ffffff',
          }
        });
        if ( chatSessionId == session_id ) {
          setTimeout(() => {
            onHandleNewChat(false)
          },300)
        }
      }          
    }catch(e:any){
      setIsReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleNewChat = ( isClose:boolean = true) => {
    if ( isClose ) {
      onClose();
      onParentClose();
    }
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 60);
  }

  const onHandReplaceHistory = async( data:any,dateString:string ) => {
    try{
      let newData = [] as any;

      setIsReceiving(true)
      const res:any = await ChatService.getChatHistory(data?.session_id);
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsReceiving(false)

        res?.data.forEach((conversations:any) => {
          if ( mConstants.chatAnswerType.includes(conversations?.chat_type) ) {
            newData.push({
              ...conversations,
              ismode : 'me',
              isHistory : true,
              id: conversations?.chat_id,
              question : conversations?.question
            })
            newData.push({
              ...conversations,
              ismode : 'server',
              isHistory : true,
              id: conversations?.chat_id,
              user_question : conversations?.question,
              answer : !functions.isEmpty(conversations?.answer) ?  functions.parseMaybeJson(conversations?.answer) : [],
              chat_type: conversations?.chat_type,
              used_token : conversations?.used_token
            })
          }
        })
        setOldHistoryData({
          session_id : data?.session_id,
          session_title : data?.title,
          chattings: newData
        });
        console.log(`dateString ${dateString}`)
        setChatSessionId(data?.session_id, dateString);
      }else{
        toast({
          title: "일시적 장애가 발생하였습니다. 잠시후 다시 시도해 주십시요.",
          position: 'top-left',
          isClosable: true,
          duration:2000,
          status: 'info',
          containerStyle: {
            color: '#ffffff',
          }
        });
      }
    }catch(e){
      console.log("newData e",e)
    }
  }

  const onHandleUpdateTitle = async(inputs: any) => {

    try{
      setIsReceiving(true)
      const res:any = await ChatService.updateChatHistoryTitle(inputs.session_id,inputs?.title);
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsReceiving(false)
        const newHistoryData = await historyData.map((item:any) => {
          const newSessions = item.sessions.map((subItem: any) => {
            if (subItem.session_id === inputs.session_id) {
              return { ...subItem, title: inputs.title == "" ? "무제" : inputs.title, updateAt :  new Date() };
            }
            return subItem;
          });
          return {
            ...item,
            sessions: newSessions,
          };
        })
        setHistoryData(newHistoryData);
        toast({
          title: "정상적으로 수정되었습니다.",
          position: 'top-right',
          isClosable: true,
          duration:1500,
          status: 'success',
          containerStyle: {
            color: '#ffffff',
          }
        });
      }           
    }catch(e:any){
      setIsReceiving(false);
      toast({
        title: "수정중 오류가 발생되었습니다.",
        position: 'top-right',
        isClosable: true,
        duration:1500,
        status: 'error',
        containerStyle: {
          color: '#ffffff',
        }
      });
    }
  } 

  const onSendProfileButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_10}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    setIsOpenSetupModal(true);
  }

  const fn_close_modal_mypage = async( isLogout = false) => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSetupModal(false);
   
    if ( isLogout ) {
      setOpenHistoryDrawer(false)
      router.replace(`/${locale}/chat`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',``)
      }, 200);
    }else{
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_20}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_20}`)
      }, 200);
    }
  }

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" borderRadius="30px" w="100%">
      <TokenGuard />
      <Brand />
      <Flex 
        flexDirection={'column'} alignItems={'center'}  width={'100%'} px="basePadding" py="20px"
        borderBottom={'1px solid'}
        borderColor={borderColor}
      >
        <Button 
          colorScheme='blue' 
          bgColor={buttonBgColor}
          color={buttonTextColor}
          variant='solid' 
          width={'100%'} 
          maxWidth={`${mConstants.modalMaxWidth-50}px`} 
          height={'48px'}
          borderRadius={'10px'}
          onClick={onOpen}
          id="button_new_dialig"
        >
          새 대화 
        </Button>
      </Flex>
      {
        isLoading
        ?
        <Stack direction="column" mb="auto"  width={'100%'} minHeight={'calc(100vh - 140px'}>
          <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} justifyContent={'center'}>
            <Box padding='6' boxShadow='lg' bg={skeletonColor} width={'96%'}>
              <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='5' />
            </Box>
          </Flex>
        </Stack>
        :
        <Stack ref={scrollContainerRef} direction="column" mb="auto"  width={'100%'}  overflowY={'auto'} minHeight={'calc(100vh - 140px'}>
          {
            isReceiving
            &&
            (<Flex position={'absolute'} top="100px" left={0} width="100%" height={"100%"} justifyContent={'center'} pt="calc( 100vh / 5 )">
              <Image src={LoadingBar} alt="LoadingBar" style={{width:'30px', height:'30px'}} /> 
            </Flex>)
          }
          <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} pb="100px" overflowY={'auto'}>
            {
              historyData?.length == 0 
              ?
              <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'calc( 100vh - 300px )'} width={'100%'}>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'}> 
                  <IconNotice boxSize={'40px'}/>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'} mt="20px"> 
                  <CustomText fontSize={'17px'} color={textColor2}>
                    이력내용이 없습니다.
                  </CustomText>
                </Box>
              </Flex>
              :
              historyData.map(({ date, sessions } : any, index:number) => (
                <Flex ref={(el) => (groupRefs.current[index] = el)} key={date} flexDirection={'column'} width={'100%'}>
                  { index > 0 && <HSeparator mt="20px" mb="15px" w="100%"  />}
                  <Flex 
                    display={sessions.length > 0 ? 'flex' : 'none'} 
                    width={'100%'} 
                    mt={1} 
                    py="basePadding" 
                    px="25px" 
                    onClick={() => handleToggle(index)}
                    cursor="pointer"
                    justifyContent={'space-between'}
                    alignItems="center"
                  >
                    <Flex alignItems="center">
                      <CustomTextBold400 fontSize={'15px'} color={textColor2}>
                        {date ? date.toString() : "YYYY-MM-DD"}
                      </CustomTextBold400>
                      {!openIndexes.includes(index) && (
                        <CustomTextBold400 fontSize={'15px'} color={textColor2} ml="2">
                          {`(${sessions.length} rows)`}
                        </CustomTextBold400>
                      )}
                    </Flex>
                    <Icon as={openIndexes.includes(index) ? MdKeyboardArrowUp : MdKeyboardArrowDown} color={textColor2} />
                  </Flex>
                  {openIndexes.includes(index) && (
                    <Box display={sessions.length > 0 ? 'flex' : 'none'}  flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%"  px="basePadding">
                      <Stack>
                        {sessions.map((item:any) => (
                          <HistoryItem 
                            key={item.session_id} 
                            data={item} 
                            onDeleteHistory={onDeleteHistory} 
                            onHandleUpdateTitle={onHandleUpdateTitle}
                            onHandCallHistory={(data:any) => onHandReplaceHistory(data,date.toString())}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Flex>
              ))
            }
            {historyData?.length > 0 && <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />}
          </Flex>
        </Stack>
      }

      <Flex position={'fixed'} left={0} bottom={0} width='100%' maxWidth={`${mConstants.modalMaxWidth}px`} height={'80px'} alignItems="center"  justifyContent={'space-between'} bg={setupBgColor}  px="20px" zIndex={10}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          {
            functions.isEmpty(userBaseInfo?.profileImage) 
            ?
            <DefaultProfile boxSize={'34px'} borderRadius={'17px'} />
            :
            <NextImage  src={userBaseInfo?.profileImage} alt="프로필이미지" style={{ borderRadius: '50%', objectFit: 'cover' }}  width={34} height={34}/>
          }
          <Box pl="10px">
            <CustomTextBold700 color={iconSubColor} fontSize="xs" me="10px">
              {userBaseInfo?.nickName}
            </CustomTextBold700>
          </Box>
        </Box>
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="transparent"
              aria-label=""
              border="1px solid"
              borderColor={borderColor}
              borderRadius="full"
              w="34px"
              h="34px"
              px="0px"
              p="0px"
              minW="34px"
              me="10px"
              justifyContent={'center'}
              alignItems="center"
              color={iconColor}
              onClick={()=> onSendProfileButton()}
            >
              <Box display={'flex'} justifyContent={'center'} >
                <Icon as={MdOutlineSettings} width="20px" height="20px" color={iconSubColor} />
              </Box>
            </MenuButton>
          </Menu>
        </Box>
      </Flex>
      {
        isOpenSetupModal && (   
          <Modal
            onClose={() => fn_close_modal_mypage(false)}
            finalFocusRef={reviewBtnRef}
            isOpen={isOpenSetupModal}
            scrollBehavior={'inside'}
            blockScrollOnMount={false}
            preserveScrollBarGap={true}
            trapFocus={false}
            autoFocus={false}
            size={'full'} 
          >
            <ModalOverlay bg="rgba(0,0,0,0.6)" />
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000} margin={0} padding={0}>
              <ModalHeader bg={navbarBg} padding="basePadding">
                <Flex flexDirection={'row'} position={'relative'}>
                  <Box 
                    position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}}  alignItems={'center'}  
                    onClick={() => fn_close_modal_mypage(false)} cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                  </Box>
                  <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                    <Text color={'white'} noOfLines={1}>마이페이지</Text>
                  </Box>
                  <Box 
                    position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                    onClick={() => fn_close_modal_mypage(false)}  cursor={'pointer'}
                  >
                    <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                <ProfileSetting
                  isOpen={isOpenSetupModal}
                  setClose={() => fn_close_modal_mypage(false)}
                  setLogout={() => fn_close_modal_mypage(true)}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      }
      {
        isOpen && (
          <Alert 
            AppName='AIGA'
            bodyContent='새로운 대화로 이동하시겠습니까? 이전 데이터는 히스토리를 통해 열람하실 수 있습니다.'
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => onHandleNewChat(true)}
            closeText='취소'
            confirmText='열기'
          />
        )
      }
    </Flex>
  );
}

export default SidebarContent;