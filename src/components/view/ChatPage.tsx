'use client';

import React from 'react';
const isMobileSafari = typeof window !== 'undefined' && /iPhone/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent);
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

  // Mobile layout states and effects, moved from ChatView
  const isKeyboardOpen = useDetectKeyboardOpen();
  const [mobileContentScrollHeight, setMobileContentScrollHeight] = React.useState(0);
  const [mobileViewportHeight, setMobileViewportHeight] = React.useState<number | string>('100vh');
  const [mobileKeyboardOffset, setMobileKeyboardOffset] = React.useState(0);
  const [isKeyboardOpenSafari, setIsKeyboardOpenSafari] = React.useState(false);
  const initialViewportHeight = React.useRef<number | null>(null); // For Safari zoom

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    // This effect only runs when the mobile view is active.
    if (!isMobileOnly) return;

    const originalBodyPosition = document.body.style.position;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyWidth = document.body.style.width;

    // Apply app-mode styles to override global CSS
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Cleanup function to restore original styles when component unmounts
    return () => {
        document.body.style.position = originalBodyPosition;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.width = originalBodyWidth;
    };
  }, [isMobileOnly]); // Run only when mobile view is activated/deactivated

  // Calculate mobile layout dimensions based on visual viewport
  React.useEffect(() => {
    if (isMobileOnly) {
      const handleResize = () => {
        const visualHeight = window.visualViewport?.height ?? window.innerHeight;
        setMobileViewportHeight(visualHeight);
        const isKeyboardVisible = (window.innerHeight - visualHeight) > 100;
        
        let contentHeight = visualHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;
        if (!isKeyboardVisible) {
            contentHeight = window.innerHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;
        }
        setMobileContentScrollHeight(contentHeight);

        let keyboardOffset = window.innerHeight - visualHeight;
        if (keyboardOffset < 0) keyboardOffset = 0; // Ensure offset is not negative
        setMobileKeyboardOffset(keyboardOffset);

        setIsKeyboardOpenSafari(isKeyboardVisible);
      };

      window.visualViewport?.addEventListener('resize', handleResize);
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial calculation

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMobileOnly]); // Rerun only if mobile status changes


  // Safari specific zoom handling
  React.useEffect(() => {
    if (!isMobileSafari) return;
  
    const handleResize = () => {
      const visualHeight = window.visualViewport?.height ?? window.innerHeight;
      setMobileViewportHeight(visualHeight);
      
      if (!initialViewportHeight.current) {
        initialViewportHeight.current = visualHeight;
      }
  
      const keyboardHeight = initialViewportHeight.current - visualHeight;
      const isKeyboardVisible = keyboardHeight > 100;
  
      const safeKeyboardHeight = isKeyboardVisible ? keyboardHeight : 0;
      const contentHeight = visualHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;
      setIsKeyboardOpenSafari(isKeyboardVisible)
      setMobileKeyboardOffset(safeKeyboardHeight);
      setMobileContentScrollHeight(contentHeight); // Update content height here too
    };
  
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('touchend', handleResize);
  
    handleResize(); 
  
    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener("touchend", handleResize);
    };
  }, [isMobileSafari]);


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
      <Box height={mobileViewportHeight} overflow="hidden" position="relative"> {/* Use 100vh for fixed full height for containing fixed children */}
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