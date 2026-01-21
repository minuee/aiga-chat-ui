'use client';

import React from 'react';
import { Flex,Box, SkeletonCircle, useDisclosure,useColorModeValue,useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Navbar from '@/components/navbar/Navbar';
import mConstants from '@/utils/constants';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import ConfigInfoStore,{ GlobalStateStore } from '@/store/configStore';
import GlobalDisable from "@/components/view/GlobalDisable";
import TokenGuard from '@/components/apiModal/TokenGuard';
import * as CommonService from "@/services/common/index";
import functions from '@/utils/functions';
import useDetectKeyboardOpen from "use-detect-keyboard-open";

const ChatView = dynamic(() => import('@/components/view/ChatView'), {
    ssr: false,
    loading: () => (
      <Flex height={"100%"} minHeight={"100vh"} width="100%" justifyContent={'center'} alignItems={'center'}>
        <SkeletonCircle size='10' />
      </Flex>
    ),
});

const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 60;

export default function Index() {
  const isMobileSafari = React.useMemo(() => {
    return typeof window !== 'undefined' && /iPhone/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent);
  }, []);
  const [isMobileOnly, setIsMobileOnly] = React.useState(false);
  console.log('[ChatPage] Rendering. isMobileOnly =', isMobileOnly);
  const pathname = usePathname();

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileOnly(window.innerWidth < (mConstants.desktopMinWidth || 768));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);
  const userId = userBaseInfo?.userBaseInfo
  const alreadyInitialized = React.useRef(false);
  const setConfigInfoStore = ConfigInfoStore((state) => state.setConfigInfoStore);
  const { isGlobalState, setGlobalState } = GlobalStateStore(state => state);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasMounted, setHasMounted] = React.useState(false);

  const themeColor = useColorModeValue('white', 'navy.800');

    // Mobile layout states and effects, from V0

    const isKeyboardOpen = useDetectKeyboardOpen();

    const [isKeyboardOpenSafari, setIsKeyboardOpenSafari] = React.useState(false);

    const [mobileKeyboardOffset, setMobileKeyboardOffset] = React.useState(0);

    

    const [mobileViewPortHeight, setMobileViewPortHeight] = React.useState(0);

    const [mobileContainerHeight, setMobileContainerHeight] = React.useState(0);

    const [mobileContentScrollHeight, setMobileContentScrollHeight] = React.useState(0);

  

    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const initialViewportHeight = React.useRef<number | null>(null); 

  

    React.useEffect(() => {

      setHasMounted(true);

    }, []);

  

  

    React.useEffect(() => {

      if ( isMobileOnly ) {

        const vpHeight = window.visualViewport?.height || window.innerHeight;

        const fullHeight = window.innerHeight;

        const keyboardHeight = fullHeight - vpHeight;

        const isKeyboardVisible = keyboardHeight > 100;

        if (isKeyboardOpen || isKeyboardVisible) {

          const vpHeight = window.visualViewport?.height || window.innerHeight;

          const maxContentHeight = vpHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;

          setMobileContentScrollHeight(maxContentHeight);

        } else {

          const fullHeight = window.innerHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;

          setMobileContentScrollHeight(fullHeight);

        }

      }

    }, [isMobileOnly, isKeyboardOpen, mobileKeyboardOffset]);

    

    React.useEffect(() => {

      if ( isMobileOnly ) {

        const handleResize = () => {

          const height = window.visualViewport?.height || window.innerHeight;

          setMobileContainerHeight(height);

        };

  

        if (window.visualViewport) {

          window.visualViewport.addEventListener('resize', handleResize);

          handleResize(); // 최초 호출

        } else {

          window.addEventListener('resize', handleResize);

          handleResize();

        }

  

        return () => {

          if (window.visualViewport) {

            window.visualViewport.removeEventListener('resize', handleResize);

          } else {

            window.removeEventListener('resize', handleResize);

          }

        };

      }

    }, [isMobileOnly]);

  

    

    React.useEffect(() => {

      if (!isMobileOnly || !isMobileSafari) return; // iOS Safari에서만 적용

    

      const handleResize = () => {

        const visualHeight = window.visualViewport?.height ?? window.innerHeight;

        

        if (!initialViewportHeight.current) {

          initialViewportHeight.current = visualHeight;

        }

    

        const keyboardHeight = initialViewportHeight.current - visualHeight;

        const isKeyboardVisible = keyboardHeight > 100;

    

        const safeKeyboardHeight = isKeyboardVisible ? keyboardHeight : 0;

        const contentHeight = visualHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;

        setIsKeyboardOpenSafari(isKeyboardVisible)

        setMobileKeyboardOffset(safeKeyboardHeight);

        setMobileViewPortHeight(contentHeight);

        setMobileContainerHeight(visualHeight);

      };

    

      window.visualViewport?.addEventListener('resize', handleResize);

      window.addEventListener('touchend', handleResize); // iOS Safari 딜레이 대응

    

      handleResize(); // 초기 실행

    

      return () => {

        window.visualViewport?.removeEventListener('resize', handleResize);

        window.removeEventListener('touchend', handleResize);

      };

    }, [isMobileOnly, isMobileSafari]);

  

    React.useEffect(() => {

      if (!isMobileOnly || isMobileSafari) return; // 사파리는 제외

    

      const updateOffset = () => {

        const isNaverInApp = /NAVER\(inapp/.test(navigator.userAgent);

        const screenHeight = window.screen.height;

        const innerHeight = window.innerHeight;

        const keyboardHeight = screenHeight - innerHeight;

        const isKeyboardVisible = keyboardHeight > 100;

        const safeKeyboardHeight = isKeyboardVisible ? keyboardHeight : 0;

        const height = isKeyboardVisible ? innerHeight - keyboardHeight : innerHeight;

    

        setMobileViewPortHeight(isNaverInApp ? height+safeKeyboardHeight : height);

        setMobileKeyboardOffset(isKeyboardVisible ? keyboardHeight : 0);

      };

    

      window.addEventListener('resize', updateOffset);

      updateOffset(); // 초기 실행

    

      return () => {

        window.removeEventListener('resize', updateOffset);

      };

    }, [isMobileOnly, isMobileSafari]);


  const getConfigData = React.useCallback(
    async() => {
      try{
        const res:any = await CommonService.getCommonConfig();
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setGlobalState(true);
          setConfigInfoStore(
            functions.isEmpty(res?.data?.config?.user_max_token) ? 0 : parseInt(res?.data?.config?.user_max_token),
            functions.isEmpty(res?.data?.config?.user_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.user_retry_limit_sec),
            functions.isEmpty(res?.data?.config?.guest_max_token) ? 0 : parseInt(res?.data?.config?.guest_max_token),
            functions.isEmpty(res?.data?.config?.guest_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.guest_retry_limit_sec)
          )
        }else{
          setGlobalState(false)
          setConfigInfoStore(0,0,0,0)
        }          
      }catch(e:any){
        setGlobalState(false)
        setConfigInfoStore(0,0,0,0)
      } finally {
        setIsLoading(false);
      }
    },[ setGlobalState, setConfigInfoStore]
  );

  React.useEffect(() => {
    if (!alreadyInitialized.current) {
        alreadyInitialized.current = true;
        getConfigData()
    }
  }, [getConfigData]);

  const onHandleRetry  = () => {
    setIsLoading(true);
    getConfigData();
  }

  if (!hasMounted) {
    return (
        <Flex bg={themeColor} height="100vh" width="100%" justifyContent='center' alignItems='center'>
            <SkeletonCircle size='10' />
        </Flex>
    )
  }

  if ( isMobileOnly ) {
    return (
      <Box height={`${mobileContainerHeight}px`} overflow={isMobileSafari ? 'auto' : 'hidden'} position={'relative'} ref={mobileScrollRef}>
        { !functions.isEmpty(userBaseInfo?.email) && <TokenGuard /> }
        { isLoading && ( 
          <Flex bg={themeColor} height={"100%"} minHeight={"100vh"} width="100%" justifyContent={'center'} alignItems={'center'} zIndex={999999999} position={'absolute'} left={0} top={0} right={0} bottom={0}>
            <SkeletonCircle size='10' />
          </Flex>
          )
        }
        <Flex position={'fixed'} top={0} left={0} right={0} height={'60px'} alignItems={'center'} justifyContent={'center'} zIndex={10}>
          <Navbar
            onOpen={onOpen}
            logoText={'AIGA Alpha'}
            brandText={getActiveRoute(routes, pathname)}
            secondary={getActiveNavbar(routes, pathname)}
          />
        </Flex>
        { ( process.env.NODE_ENV === 'development' || isGlobalState ) ?
          <ChatView 
              isMobile={isMobileOnly}
              isMobileSafari={isMobileSafari}
              mobileContentScrollHeight={mobileContentScrollHeight}
              mobileKeyboardOffset={mobileKeyboardOffset}
              isKeyboardOpenSafari={isKeyboardOpenSafari}
              isKeyboardOpen={isKeyboardOpen}
            /> :
          <Flex alignItems={'center'} px='basePadding' width="100%" maxWidth={`${mConstants.desktopMinWidth}px`} overflow={'hidden'} bg={themeColor}>
            <GlobalDisable setRetry={onHandleRetry} />
          </Flex>
        }
      </Box>
    )
  }

  return (
      <Flex justifyContent={'center'} position="relative">
        { isLoading && ( 
          <Flex bg={themeColor} height={"100%"} minHeight={"100vh"} width="100%" justifyContent={'center'} alignItems={'center'} zIndex={999999999} position={'absolute'} left={0} top={0} right={0} bottom={0}>
            <SkeletonCircle size='10' />
          </Flex>
          )
        }
        <Flex
          minHeight={"100vh"}
          height="100%"
          overflow="hidden"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', md : `${mConstants.desktopMinWidth}px`  }}
          maxW={`${mConstants.desktopMinWidth}px` }
          borderRadius="sm"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
        >
          <Box 
            position={'fixed'}
            top={0}
            left={0}
            right={0}
            height={'60px'}
            width="100%" 
            maxWidth={`${mConstants.desktopMinWidth}px`}
            display={'flex'}
            justifyContent={'center'}
          >
            <Navbar
              onOpen={onOpen}
              logoText={'AIGA Beta'}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Box>
          { ( process.env.NODE_ENV === 'development' || isGlobalState ) ?
            <Flex 
              mt="60px"
              alignItems={'center'} 
              width="100%" 
              maxWidth={`${mConstants.desktopMinWidth}px`} 
              height="calc(100vh - 60px)"
              bg={themeColor}
            >
              <ChatView />
            </Flex> :
            <Flex alignItems={'center'} px='basePadding' width="100%" maxWidth={`${mConstants.desktopMinWidth}px`} overflow={'hidden'} bg={themeColor}>
              <GlobalDisable setRetry={onHandleRetry} />
            </Flex>
          }
        </Flex>
      </Flex>
  )
}