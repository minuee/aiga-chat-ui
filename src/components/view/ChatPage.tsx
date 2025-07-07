'use client';

import React, { Children } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile, isMobileSafari} from "react-device-detect";
import SubPage from '@/components/view/Chatbot';
import SubMobilePage from '@/components/view/ChatbotMobile';
import { Flex,Box,Text, SkeletonCircle, useDisclosure,useColorModeValue,useToast } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Navbar from '@/components/navbar/Navbar';
import mConstants from '@/utils/constants';
import UserStateStore from '@/store/userStore';
import ConfigInfoStore,{ GlobalStateStore } from '@/store/configStore';
import GlobalDisable from "@/components/view/GlobalDisable";

import * as CommonService from "@/services/common/index";
import functions from '@/utils/functions';
import useDetectKeyboardOpen from "use-detect-keyboard-open";
const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 60;

export default function Index() {
  
  const pathname = usePathname();
  const toast = useToast();
  const { userId, ...userInfo } = UserStateStore(state => state);
  const alreadyInitialized = React.useRef(false);
  const setConfigInfoStore = ConfigInfoStore((state) => state.setConfigInfoStore);
  const { isGlobalState } = GlobalStateStore(state => state);
  const setGlobalState = GlobalStateStore((state) => state.setGlobalState);
  const [isClient, setIsClient] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasMounted, setHasMounted] = React.useState(false);

  const themeColor = useColorModeValue('white', 'navy.800');

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
  }, [isKeyboardOpen, mobileKeyboardOffset]);
  
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
  }, []);

  /* React.useEffect(() => {
    const updateOffset = () => {
      const screenHeight = isMobileSafari ? window.visualViewport?.height || window.innerHeight :  window.screen.height;
      const innerHeight = window.innerHeight;
      const keyboardHeight = screenHeight - innerHeight;
      const isKeyboardVisible = keyboardHeight > 100;
      // 키보드가 열렸고, 최소 높이 기준 이상일 경우만 적용
      if (isKeyboardOpen || isKeyboardVisible) {
        //const height =  window.innerHeight - mobileKeyboardOffset;
        const offset = keyboardHeight > 0 ? keyboardHeight : mobileKeyboardOffset;
        const height = screenHeight - offset;
        setMobileViewPortHeight(height);
       // setMobileKeyboardOffset(keyboardHeight);
      } else {
        setMobileViewPortHeight(window.innerHeight);
        //setMobileKeyboardOffset(0);
      }
    };
    if ( isMobileOnly ) {
      window.addEventListener('resize', updateOffset);
      window.visualViewport?.addEventListener('resize', updateOffset); // ⬅ 추가
      updateOffset();

      return () => {
        window.removeEventListener('resize', updateOffset);
        window.visualViewport?.removeEventListener('resize', updateOffset); // ⬅ 추가
      };
    }
  }, []);

  React.useEffect(() => {
  
    const handleVisualViewportResize = () => {

      const currentHeight = window.visualViewport?.height || window.innerHeight;

      if (!initialViewportHeight.current) {
        initialViewportHeight.current = currentHeight;
      }

      const vpHeight = window.visualViewport?.height || window.innerHeight;
      const fullHeight = window.innerHeight;

      const keyboardHeight = (initialViewportHeight.current ?? currentHeight) - currentHeight;//fullHeight - vpHeight;
      const isKeyboardVisible = keyboardHeight > 100;
      const contentHeight = vpHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT;
      if ( isKeyboardVisible ) {
        toast({
          title:`vpHeight ${vpHeight},fullHeight ${fullHeight}`,
          position: 'top-right',
          status: 'error',
          containerStyle: {
            color: '#ffffff',
          },
          isClosable: true,
          duration:10000
        });
      }
      setMobileKeyboardOffset( ( isKeyboardOpen || isKeyboardVisible ) ? keyboardHeight : 0);
      setMobileViewPortHeight(currentHeight - MOBILE_HEADER_HEIGHT - MOBILE_INPUT_HEIGHT);
      setMobileContainerHeight(currentHeight);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVisualViewportResize);
      handleVisualViewportResize(); // 최초 실행
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVisualViewportResize);
      }
    };

  }, []) */

  React.useEffect(() => {
    if (!isMobileSafari) return; // iOS Safari에서만 적용
  
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
  }, []);

  React.useEffect(() => {
    if (!isMobileOnly || isMobileSafari) return; // 사파리는 제외
  
    const updateOffset = () => {
      const screenHeight = window.screen.height;
      const innerHeight = window.innerHeight;
      const keyboardHeight = screenHeight - innerHeight;
      const isKeyboardVisible = keyboardHeight > 100;
  
      const height = isKeyboardVisible
        ? innerHeight - keyboardHeight
        : innerHeight;
  
      setMobileViewPortHeight(height);
      setMobileKeyboardOffset(isKeyboardVisible ? keyboardHeight : 0);
    };
  
    window.addEventListener('resize', updateOffset);
    updateOffset(); // 초기 실행
  
    return () => {
      window.removeEventListener('resize', updateOffset);
    };
  }, []);
  
  
  const getConfigData = React.useCallback(
    async() => {
      try{
        alreadyInitialized.current = true;
        const res:any = await CommonService.getCommonConfig();
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setGlobalState(true)
          setIsLoading(false)
          setConfigInfoStore(
            functions.isEmpty(res?.data?.config?.user_max_token) ? 0 : parseInt(res?.data?.config?.user_max_token),
            functions.isEmpty(res?.data?.config?.user_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.user_retry_limit_sec),
            functions.isEmpty(res?.data?.config?.guest_max_token) ? 0 : parseInt(res?.data?.config?.guest_max_token),
            functions.isEmpty(res?.data?.config?.guest_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.guest_retry_limit_sec)
          )
          
        }else{
          setIsLoading(false)
          setGlobalState(false)
          setConfigInfoStore(0,0,0,0)
        }          
      }catch(e:any){
        setIsLoading(false)
        setGlobalState(false)
        setConfigInfoStore(0,0,0,0)
      }
    },[userId,userInfo?.userMaxToken,userInfo?.userRetryLimitSec]
  );

  React.useEffect(() => {
    if (!alreadyInitialized.current) {
      getConfigData()
    }
  }, [getConfigData]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onHandleRetry  = () => {
    getConfigData();
  }

  if (!hasMounted || isLoading) {
   return (
    <Flex bg={themeColor} height={"100%"} minHeight={"100vh"} width="100%" justifyContent={'center'} alignItems={'center'}>
      <SkeletonCircle size='10' />
    </Flex>
    )
  }

  if ( isMobileOnly ) {
    return (
        <Box height={`${mobileContainerHeight}px`} overflow={isMobileSafari ? 'auto' : 'hidden'} position={'relative'} ref={mobileScrollRef}>
          <Flex position={'fixed'} top={0} left={0} right={0} height={'60px'} alignItems={'center'} justifyContent={'center'} zIndex={10}>
            <Navbar
              onOpen={onOpen}
              logoText={'AIGA Alpha'}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Flex>
          {/* ✅ 콘텐츠 영역 */}
          {/* <Box
            ref={mobileContentRef}
            position={'absolute'} top={`${MOBILE_HEADER_HEIGHT}px`} left={0} right={0} bottom={`${MOBILE_INPUT_HEIGHT}px`} boxSizing={'border-box'}
            overflowY={'auto'} width={'100%'} height={`${mobileContentScrollHeight}px`} maxHeight={`${mobileViewPortHeight}px`}
          >
            <Box height={`${mobileViewPortHeight}px`} maxHeight={`${mobileViewPortHeight}px`} overflow={'hidden'}> */}
              {
                ( process.env.NODE_ENV == 'development' || isGlobalState )
                ?
                <SubMobilePage 
                  mobileContentScrollHeight={mobileContentScrollHeight}
                  mobileViewPortHeight={mobileViewPortHeight}
                  mobileKeyboardOffset={mobileKeyboardOffset}
                  isKeyboardOpenSafari={isKeyboardOpenSafari}
                />
                :
                <Flex alignItems={'center'} px='basePadding' width="100%" maxWidth={`${mConstants.desktopMinWidth}px`} overflow={'hidden'} bg={themeColor}>
                  <GlobalDisable
                    setRetry={() => onHandleRetry() }
                  />
                </Flex>
              }
            {/* </Box>
          </Box> */}
          {/* <Flex
            position={'absolute'} bottom={`${mobileKeyboardOffset}px`} left={0} right={0} minHeight="60px" height={'auto'} alignItems={'center'} zIndex={10}
            transition={'bottom 0.25s ease-in-out'}
          >
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              style={{ width: '100%',padding: '0.5rem',fontSize: '1rem',borderRadius: 6,border: '1px solid #ccc',}}
            />
          </Flex> */}
        </Box>
    )
  }

  return (
      <Flex  justifyContent={'center'} >
        <Flex
          minHeight={isMobileOnly ? "100%" : "100vh"}
          height="100%"
          overflow="hidden" /* 여기가 중요 */
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', md : `${mConstants.desktopMinWidth}px`  }}
          maxW={`${mConstants.desktopMinWidth}px` }
          
          //borderBottomLeftRadius={ isDesktop ? '15px' : 0}
          //borderBottomRightRadius={ isDesktop ? '15px' : 0} 
          
          //bg='green'뒤에 쉐도우 주는거 
          borderRadius="sm"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
          //border="1px solid rgba(255, 255, 255, 0.3)"
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
          {
            ( process.env.NODE_ENV == 'development' || isGlobalState )
            ?
            <Flex 
              mt="58px"
              alignItems={'center'} 
              width="100%" 
              maxWidth={`${mConstants.desktopMinWidth}px`} 
              overflow={'hidden'}
              bg={themeColor}
            >
              <SubPage />
            </Flex>
            :
            <Flex alignItems={'center'} px='basePadding' width="100%" maxWidth={`${mConstants.desktopMinWidth}px`} overflow={'hidden'} bg={themeColor}>
              <GlobalDisable
                setRetry={() => onHandleRetry() }
              />
            </Flex>
          }
        </Flex>
      </Flex>

  )
}
