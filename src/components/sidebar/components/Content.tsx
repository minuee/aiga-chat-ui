'use client';
// chakra imports
import { Box,Button,Flex,Icon,Menu,MenuButton,Stack,Text,useColorModeValue,useDisclosure,SkeletonText, Modal,ModalOverlay,ModalContent,ModalHeader,useToast,ModalBody } from '@chakra-ui/react';
import Image from "next/image";
import { HSeparator } from '@/components/separator/Separator';
//   Custom components
import defaultProfile from '@/assets/images/avatar0.png';
import { NextAvatar } from '@/components/image/Avatar';
import NextImage from 'next/legacy/image';
import Alert from '@/components/alert/Alert';
import ProfileSetting from '@/components/modal/ProfileSetting';
import Brand from '@/components/sidebar/components/Brand';
import React, { useRef } from 'react';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import * as ChatService from "@/services/chat/index";
import { MdOutlineSettings,MdArrowBack,MdOutlineClose } from 'react-icons/md';
import mConstants from '@/utils/constants';
import * as history from '@/utils/history';
import functions from "@/utils/functions";
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import groupSessionsByDateSorted from "./GroupSort";
import LoadingBar from "@/assets/icons/loading.gif";
//새창열기 전역상태
import UserStateStore from '@/store/userStore';
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore } from '@/store/newChatStore';
import { ModalMypageStore,DrawerHistoryStore } from '@/store/modalStore';
import HistoryItem from '@/components/text/HistoryItem';

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
  const { ...userBaseInfo } = UserStateStore(state => state);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue( '14px 17px 40px 4px rgba(112, 144, 176, 0.18)','14px 17px 40px 4px rgba(12, 44, 55, 0.18)' );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue( '4px 17px 40px 4px rgba(112, 144, 176, 0.08)','none' );
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor2 = useColorModeValue('gray.500', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
  const buttonTextColor = useColorModeValue('white', '#2b8fff');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = useRef();
  const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const setOldHistoryData = CallHistoryDataStore((state) => state.setOldHistoryData);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  
  React.useEffect(() => {
    //setIsLoading(false)
    getMyHistoryData();
  }, []);

  const getMyHistoryData = async() => {
    try{
      const res:any = await ChatService.getChatHistoryList();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        const reData = groupSessionsByDateSorted(res?.data?.history.sessions)
        setHistoryData(reData)
        setIsLoading(false)
      }
    }catch(e:any){
      console.log("error of getNewSessionID",e)
    }
  }

  const onDeleteHistory = async(session_id: any) => {

    if ( chatSessionId == session_id ) {
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
    }

    try{
      setIsReceiving(true)
      const res:any = await ChatService.removeChatHistory(session_id);
      console.log('apidata onDeleteHistory',res)
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
      setIsReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleNewChat = () => {
    console.log("onHandleNewChat")
    onClose();
    onParentClose()
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 300);
  }

  const onHandReplaceHistory = async( data:any) => {
    setOldHistoryData(data)
  }

  const onHandleUpdateTitle = async(inputs: any) => {

    try{
      setIsReceiving(true)
      console.log('getMyHistoryData inputs?.title',inputs?.title)
      const res:any = await ChatService.updateChatHistoryTitle(inputs.session_id,inputs?.title);
      console.log('getMyHistoryData onHandleUpdateTitle',res)
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsReceiving(false)
        const newHistoryData = await historyData.map((item:any) => {
          const newSessions = item.sessions.map((subItem: any) => {
            if (subItem.session_id === inputs.session_id) {
              return { ...subItem, title: inputs.title };
            }
            return subItem;
          });
          return {
            ...item,
            sessions: newSessions,
          };
        })
        setHistoryData(newHistoryData);
      }           
    }catch(e:any){
      setIsReceiving(false)
      console.log("error of onHandleUpdateTitle",e)
    }
  } 

  const onSendProfileButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_10}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    setIsOpenSetupModal(true);
  }

  const fn_close_modal_mypage = async( isLogout = false) => {
    console.log("apidata isLogout", isLogout)
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSetupModal(false);
    setOpenHistoryDrawer(false)
    if ( isLogout ) {
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
    <Flex direction="column" height="100%" borderRadius="30px" w="100%" >
      <Brand />
      <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} px="basePadding" my="10px">
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
        <Stack direction="column" mb="auto"  width={'100%'}  overflowY={'auto'} minHeight={'calc(100vh - 140px'}>
          <Box padding='6' boxShadow='lg' bg={skeletonColor}>
            <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='5' />
          </Box>
        </Stack>
        :
        <Stack direction="column" mb="auto"  width={'100%'}  overflowY={'auto'} minHeight={'calc(100vh - 140px'}>
          {
            isReceiving
            &&
            (<Flex position={'absolute'} top="100px" left={0} width="100%" height={"100%"} justifyContent={'center'} pt="calc( 100vh / 5 )">
              <Image src={LoadingBar} alt="LoadingBar" style={{width:'30px', height:'30px'}} /> 
            </Flex>)
          }
          <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} pb="100px">
            {
              historyData.map(({ date, sessions } : any) => (
              <Flex key={date} flexDirection={'column'} width={'100%'}>
                <HSeparator mt="20px" mb="15px" w="100%"  />
                <Box display={'flex'} width={'100%'} mt={1} py="basePadding" px="25px">
                  <Text fontSize={'15px'} color={textColor2} fontWeight={'semibold'}>
                    {date? date.toString() : "YYYY-MM-DD"}
                  </Text>
                </Box>
                <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%"  px="basePadding">
                  <Stack>
                    {sessions.map((item:any, index:number) => (
                      <HistoryItem 
                        key={index} 
                        data={item} 
                        onDeleteHistory={onDeleteHistory} 
                        onHandleUpdateTitle={onHandleUpdateTitle}
                        onHandCallHistory={(data:any) => onHandReplaceHistory(data)}
                      />
                    ))}
                  </Stack>
                </Flex>
              </Flex>
              ))
            }
            <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />
          </Flex>
        </Stack>
      }

      <Flex 
        position={'fixed'}
        left={0}
        bottom={0}
        width='100%'
        maxWidth={`${mConstants.modalMaxWidth}px`}
        height={'80px'}
        alignItems="center" 
        justifyContent={'space-between'} 
        bg='#e9edf3' 
        px="20px"
        zIndex={10}
      >
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          {
            functions.isEmpty(userBaseInfo?.profileImage) 
            ?
            <NextAvatar h="34px" w="34px" src={defaultProfile} me="10px" />
            :
            <NextImage  src={userBaseInfo?.profileImage} alt="프로필이미지" style={{ borderRadius: '50%', objectFit: 'cover' }}  width={34} height={34}/>
          }
          <Box pl="10px">
            <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
              {userBaseInfo?.nickName}
            </Text>
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
                <Icon as={MdOutlineSettings} width="20px" height="20px" color="inherit" />
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
            size={'full'} 
          >
            <ModalOverlay />
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000} margin={0} padding={0}>
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
                    onClick={() => fn_close_modal_mypage(false)} cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                  </Box>
                  <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                    <Text color={'white'} noOfLines={1}>마이페이지</Text>
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
            onConfirm={() => onHandleNewChat()}
            closeText='취소'
            confirmText='열기'
          />
        )
      }
    </Flex>
  );
}

export default SidebarContent;
