'use client';
// chakra imports
import { Box,Button,Flex,Icon,Menu,MenuButton,Stack,Text,useColorModeValue,useDisclosure,SkeletonText, Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import { format } from 'date-fns';
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
//새창열기 전역상태
import UserStateStore from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import { ModalMypageStore,DrawerHistoryStore } from '@/store/modalStore';
import HistoryItem from '@/components/text/HistoryItem';
import { url } from 'inspector';

const mockupHistoryData = [
  {
    session_id: 1,
    createdAt: '2025-05-05',
    content: '몸이 너무너무 아픕네다',
  },
  {
    session_id: 2,
    createdAt: '2025-05-04',
    content: '수정된 제목입니다. 수정된 제목입니다.',
  },
  {
    session_id: 3,
    createdAt: '2025-05-04',
    content: 'The government of the people, by the people, for the people. a speech by Abraham Lincoln',
  },
  { 
    session_id: 4,
    createdAt: '2025-05-03',
    content: '空気読めない奴だな訳してKYな奴決して許せない。Qさまという番組は俺が一番好きな番組でござんす',
  },
]

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { onParentClose } = props;  
  const [ isLoading, setIsLoading] = React.useState(true);
  const { isOpenSetupModal } = ModalMypageStore(state => state);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [historyData, setHistoryData] = React.useState(mockupHistoryData);

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
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  React.useEffect(() => {
    getMyHistoryData();
    /* setHistoryData(mockupHistoryData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); */
  }, []);

  const getMyHistoryData = async() => {
    try{
      const res:any = await ChatService.getChatHistoryList();
      console.log('apidata getMyHistoryData',res)
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsLoading(false)
        //setHistoryData(res?.data)
      }          
      
    }catch(e:any){
      console.log("error of getNewSessionID",e)
    }
  }

  const onDeleteHistory = async(session_id: any) => {
    try{
      setIsLoading(true)
      const res:any = await ChatService.removeChatHistory(session_id);
      console.log('apidata onDeleteHistory',res)
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsLoading(false)
        const newHistoryData = historyData.filter((item:any) => item.session_id !== session_id);
        setHistoryData(newHistoryData);
      }          
      
    }catch(e:any){
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

  const onHandleUpdateTitle = async(inputs: any) => {

    try{
      setIsLoading(true)
      const res:any = await ChatService.updateChatHistoryTitle(inputs.session_id,inputs?.title);
      console.log('apidata onDeleteHistory',res)
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsLoading(false)
        const newHistoryData = historyData.map((item) => {
          if (item.session_id === inputs.session_id) {
            return { ...item, content: inputs.content };
          }
          return item;
        });
        setHistoryData(newHistoryData);
      }          
      
    }catch(e:any){
      console.log("error of getNewSessionID",e)
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
    <Flex
      direction="column"
      height="100%"
      //pt="20px"
      //pb="40px"
      borderRadius="30px"
      w="100%"
      maxW={`${mConstants.modalMaxWidth-10}px`}
      //px="20px"
    >
      <Brand />
      <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} px="20px" my="10px">
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
      <Stack direction="column" mb="auto"  width={'100%'}  overflowY={'auto'} minHeight={'calc(100vh - 140px'}>
        <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'}>
         
          <HSeparator mt="20px" mb="20px" w="100%"  />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'100%'} mt={1} px="20px">
            <Text fontSize={'17px'} color={textColor2} fontWeight={'bold'}>
               {format(Date.now(), 'yyyy-MM-dd')}
            </Text>
          </Box>
          
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%"  px="20px">
            {
              isLoading ? (
                <Box padding='6' boxShadow='lg' bg={skeletonColor} width="100%" px="20px">
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='4' width={'100%'}  />
                </Box>
              )
              :
              <Stack spacing='2'>
                {historyData.map((item, index) => (
                  <HistoryItem 
                    key={index} 
                    data={item} 
                    onDeleteHistory={onDeleteHistory} 
                    onHandleUpdateTitle={onHandleUpdateTitle}
                  />
                ))}
              </Stack>
              }
          </Flex>

          <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'100%'} mt={1} px="20px">
            <Text fontSize={'17px'} color={textColor2} fontWeight={'bold'}>
               {format(Date.now()-1, 'yyyy-MM-dd')}
            </Text>
          </Box>
          
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%" px="20px">
            {
              isLoading ? (
                <Box padding='6' boxShadow='lg' bg={skeletonColor} width="100%" maxWidth={`${mConstants.modalMaxWidth-50}px`}>
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='4' width={'100%'}  />
                </Box>
              )
              :
              <Stack spacing='2'>
                {historyData.map((item, index) => (
                  <HistoryItem 
                    key={index} 
                    data={item} 
                    onDeleteHistory={onDeleteHistory} 
                    onHandleUpdateTitle={onHandleUpdateTitle}
                  />
                ))}
              </Stack>
              }
          </Flex>
          <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />
        </Flex>
      </Stack>

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
      >
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          {
            functions.isEmpty(userBaseInfo?.profileImage) 
            ?
            <NextAvatar h="34px" w="34px" src={defaultProfile} me="10px" />
            :
            <NextImage 
              src={userBaseInfo?.profileImage}
              alt="프로필이미지"
              //fill={true}
              style={{ borderRadius: '50%', objectFit: 'cover' }} 
              width={34} 
              height={34}
            />
            
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
              <ModalHeader bg={navbarBg}>
                <Flex flexDirection={'row'}>
                  <Box 
                    flex={1} 
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'} 
                    onClick={() => fn_close_modal_mypage(false)} 
                    cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                  </Box>
                  <Box 
                    flex={3} 
                    display={{base :'none', md:'flex'}} 
                    alignItems={'center'} 
                    >
                    <Text color={'white'} noOfLines={1}>마이페이지</Text>
                  </Box>
                  <Box 
                    flex={3} 
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'} 
                    justifyContent={'flex-end'}
                  >
                    <Text color={'white'} noOfLines={1}>마이페이지</Text>
                  </Box>
                  <Box 
                    flex={1} 
                    display={{base :'none', md:'flex'}} 
                    justifyContent={'flex-end'}
                    alignItems={'center'} 
                    onClick={() => fn_close_modal_mypage(false)} 
                    cursor={'pointer'}
                    >
                    <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh">
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
