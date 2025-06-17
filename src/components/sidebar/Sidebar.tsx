'use client';
import React, { PropsWithChildren } from 'react';
import axios from 'axios';

// chakra imports
import { Box,Flex,Text,Drawer,DrawerBody,Icon,useColorModeValue,DrawerOverlay,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';
import Content from '@/components/sidebar/components/Content';
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import mConstants from '@/utils/constants';
import { IRoute } from '@/types/navigation';
import { isWindowAvailable } from '@/utils/navigation';
import { MdOutlineMenu,MdOutlineClose } from "react-icons/md";
import functions from "@/utils/functions";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { DrawerHistoryStore,ModalSignupStoreStore } from '@/store/modalStore';
import LoginModal  from '@/components/modal/SignUpScreen';
import UserStateStore from '@/store/userStore';

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
        bg={sidebarBg}
        transition={variantChange}
        w="100%"
        maxW={`${mConstants.modalMaxWidth}px`}
        ms={{ sm: '16px' }}
        my={{ sm: '16px' }}
        h="calc(100vh - 32px)"
        m={sidebarMargins}
        borderRadius={sidebarRadius}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          universal={true}
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content setApiKey={setApiKey} routes={routes} />
        </Scrollbars>
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
  //const [isOpenLoginModal, setIsOpenLoginModal] = React.useState<boolean>(false);
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenHistoryDrawer } = DrawerHistoryStore(state => state);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const { isOpenLoginModal } = ModalSignupStoreStore(state => state);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal);
  const oopsColor = useColorModeValue('#111111', 'white');
  const basicColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('#2b8fff', 'gray.500');
  

  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { ...userBasicInfo } = UserStateStore(state => state);

  const onSendHistoryButton = async() => {
    setOpenHistoryDrawer(false);
    console.log("onSendHistoryButton",isOpenHistoryDrawer)
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_20}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_20}`)   
    setTimeout(() => {
      setOpenHistoryDrawer(true);
    }, 60);
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
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','')
    }, 200);
  }

  const onSendsignupButton = async() => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_21}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21}`)
    setIsOpenSignupModal(true);
  }

  return (
    <Flex 
      //display={{ sm: 'flex', xl: 'none' }} 
      alignItems="center"
    >
      <Flex w="max-content" h="max-content"  alignItems={'center'}>
        {
          ( userBasicInfo?.isState && !functions.isEmpty(userBasicInfo?.userId) ) 
          ?
          <Box onClick={() => onSendHistoryButton()} alignItems={'center'} display={'flex'} cursor={'pointer'}>
            <Icon as={MdOutlineMenu} width="24px" height="24px" color={basicColor} />
          </Box>
          :
          <Box 
            display={'flex'} minW={'52px'} height={'28px'} justifyContent={'center'} alignItems={'center'} bg={navbarIcon} borderRadius={'5px'}
            cursor='pointer' onClick={()=> onSendsignupButton()}
          >  
          <Text fontSize={'17px'} color={basicColor}>
            로그인
          </Text>
        </Box>

        }
       
        
      </Flex>
      <Drawer
        isOpen={isOpenHistoryDrawer}
        onClose={()=>fn_close_drawer_history()}
        placement={
          isWindowAvailable() && document.documentElement.dir === 'rtl'
            ? 'right'
            : 'left'
        }
      >
        <DrawerOverlay />
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
            maxW={`${mConstants.modalMaxWidth-10}px`} 
            px="0rem" 
            pb="0"
          >
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content 
                routes={routes} 
                onParentClose={()=>fn_close_drawer_history()}
              />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {
        <Drawer
          isOpen={isOpenLoginModal}
          onClose={ () => fn_close_modal_user_login()}
          placement={'bottom'}
        >
          <DrawerOverlay />
          <DrawerContent
            w="100%"
            height={{base:"60vh", md:"60vh"}}
            maxW={`${mConstants.modalMaxWidth}px`}
            //bg={sidebarBackgroundColor}
            borderTopLeftRadius={"10px"}
            borderTopRightRadius={"10px"}
            alignItems={'center'}
          > 
           {/*  <DrawerCloseButton
              zIndex="3"
              onClick={ () => fn_close_modal_user_login()}
              _focus={{ boxShadow: 'none' }}
              _hover={{ boxShadow: 'none' }}
              
            />
             */}
            <DrawerBody 
              w="100%" 
              maxW={`${mConstants.modalMaxWidth-20}px`} 
              height="100%" 
              backgroundColor="white"
              borderTopLeftRadius={"10px"}
              borderTopRightRadius={"10px"}
              position={'relative'}
            >
              <Flex 
                position={'absolute'}
                top={0}
                right={0}
                width="50px"
                height={'50px'}
                justifyContent={'center'}
                alignItems={'center'}
                onClick={() => fn_close_modal_user_login()}
                cursor={'pointer'}
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
        }
    </Flex>
  );
}
// PROPS

export default Sidebar;
