'use client';
import React, { PropsWithChildren } from 'react';
import CustomText from "@/components/text/CustomText";
// chakra imports
import { Box,Flex,Drawer,DrawerBody,Icon,useColorModeValue,DrawerOverlay,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';
import Content from '@/components/sidebar/components/Content';
import mConstants from '@/utils/constants';
import { IRoute } from '@/types/navigation';
import { isWindowAvailable } from '@/utils/navigation';
import { MdOutlineMenu,MdOutlineClose } from "react-icons/md";
import functions from "@/utils/functions";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { DrawerHistoryStore,ModalSignupStoreStore,DoctorFromListStore,ModalMypageStore } from '@/store/modalStore';
import LoginModal  from '@/components/modal/SignUpScreen';

import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const { routes, setApiKey } = props;
  let variantChange = '0.2s linear';
  let shadow = useColorModeValue( '14px 17px 40px 4px rgba(112, 144, 176, 0.08)','unset' );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');

  let sidebarRadius = '14px';
  let sidebarMargins = '0px';
  // SIDEBAR
  return (
    <Box display={{ base: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg} transition={variantChange} w="100%" maxW={`${mConstants.modalMaxWidth}px`} ms={{ sm: '16px' }} my={{ sm: '16px' }} h="calc(100vh - 32px)"
        m={sidebarMargins} borderRadius={sidebarRadius} minH="100%" overflowX="hidden" boxShadow={shadow}
      >
        <Content setApiKey={setApiKey} routes={routes} />
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props: { routes: IRoute[] }) {

  const { routes } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [currentPathnameCheck, setCurrentPathnameCheck] = React.useState('');
  //const [isOpenLoginModal, setIsOpenLoginModal] = React.useState<boolean>(false);
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let drawerBackgroundColor = useColorModeValue('transparent', 'transparent');
  // // SIDEBAR
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const { isOpenHistoryDrawer } = DrawerHistoryStore(state => state);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const { isOpenLoginModal } = ModalSignupStoreStore(state => state);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal);
  const { isOpenSetupModal } = ModalMypageStore(state => state);
  const oopsColor = useColorModeValue('#111111', 'white');
  const basicColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('#2b8fff', 'navy.800');
  const iconColor = useColorModeValue('white', 'navy.800');

  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);

  const onSendHistoryButton = () => {
    if ( isOpenHistoryDrawer ) setOpenHistoryDrawer(false);
    setOpenHistoryDrawer(true);
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_20}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_20}`)   
    
  }

  const fn_close_drawer_history = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenHistoryDrawer(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','')  
    }, 200);
  }

  

  const fn_close_modal_user_login = async() => {

    const currentPathname = await mCookie.getCookie('currentPathname');
    if ( currentPathname == mConstants.pathname_modal_21_2 ) { //의사 상세위에서 로그인화면 
      const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
      if ( isFromDoctorDepth2 ) {//true이면 list > detail
        router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
          setIsOpenSignupModal(false);
        }, 200);
      }else{
        router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
          setIsOpenSignupModal(false);
        }, 200);
      }
    }else{
      const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
      setIsOpenSignupModal(false);
      router.replace(`/${locale}/chat`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname','')
      }, 200);
    }
  }

  const onSendsignupButton = async() => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_21}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21}`)
    setIsOpenSignupModal(true);
  }

  return (
    <Flex alignItems="center">
      <Flex w="max-content" h="max-content"  alignItems={'center'}>
        {
          ( userBaseInfo?.isState && !functions.isEmpty(userBaseInfo?.userId) ) 
          ?
          <Box onClick={() => onSendHistoryButton()} alignItems={'center'} display={'flex'} cursor={'pointer'}>
            <Icon as={MdOutlineMenu} width="24px" height="24px" color={iconColor} />
          </Box>
          :
          <Box 
            display={'flex'} minW={'52px'} height={'28px'} justifyContent={'center'} alignItems={'center'} bg={navbarIcon} borderRadius={'5px'}
            cursor='pointer' onClick={()=> onSendsignupButton()}
          >  
          <CustomText fontSize={'13px'} color={basicColor}>로그인</CustomText>
        </Box>
        }
      </Flex>
      
      <Drawer
        isOpen={isOpenHistoryDrawer}
        onClose={()=>fn_close_drawer_history()}
        placement={'left'}
      >
        <DrawerOverlay bg={ isOpenSetupModal ?  "transparent" :  "rgba(0,0,0,0.6)"   }/>
        <DrawerContent
          w="100%"
          maxW={`${mConstants.modalMaxWidth}px`} 
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={()=>fn_close_drawer_history()}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody 
            w="100%"
            maxW={`${mConstants.modalMaxWidth}px`} 
            px="0rem" 
            pt="20px"
          >
            <Content 
              routes={routes} 
              onParentClose={()=>fn_close_drawer_history()}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
   
      {
        isOpenLoginModal && (
        <Drawer
          isOpen={isOpenLoginModal}
          onClose={ () => fn_close_modal_user_login()}
          placement={'bottom'}
        >
          <DrawerOverlay />
          <DrawerContent
            w="100%"
            height={{base:"60vh",sm:"70vh", md:"60vh"}}
            maxW={`${mConstants.modalMaxWidth}px`}
            bg={drawerBackgroundColor}
            borderTopLeftRadius={"10px"}
            borderTopRightRadius={"10px"}
            alignItems={'center'}
            zIndex={10000}
          > 
            <DrawerBody 
              w="100%" 
              maxW={`${mConstants.modalMaxWidth}px`} 
              height="100%" 
              backgroundColor={sidebarBackgroundColor}
              borderTopLeftRadius={"10px"}
              borderTopRightRadius={"10px"}
              position={'relative'}
              zIndex={10000}
            >
              <Flex 
                position={'absolute'} top={0} right={0} width="50px" height={'50px'} justifyContent={'center'} alignItems={'center'} zIndex={10000}
                onClick={() => fn_close_modal_user_login()} cursor={'pointer'} 
              >
                <Icon as={MdOutlineClose} width="20px" height="20px" color={oopsColor} />
              </Flex>
              <LoginModal
                isOpen={isOpenLoginModal}
                setClose={() => fn_close_modal_user_login()}
              />
            </DrawerBody>
            </DrawerContent>
          </Drawer>
        )
      }
    </Flex>
  );
}
export default React.memo(Sidebar);