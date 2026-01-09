'use client';

import React from 'react';
import { isMobileOnly,isMobileSafari} from "react-device-detect";
import SubPage from '@/components/view/Chatbot';
import SubMobilePage from '@/components/view/ChatbotMobile';
import { Flex,Box, SkeletonCircle, useDisclosure,useColorModeValue,useToast, Button, Checkbox, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Navbar from '@/components/navbar/Navbar';
import mConstants from '@/utils/constants';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import ConfigInfoStore,{ GlobalStateStore, GlobalLocationStore } from '@/store/configStore';
import GlobalDisable from "@/components/view/GlobalDisable";
import TokenGuard from '@/components/apiModal/TokenGuard';
import * as CommonService from "@/services/common/index";
import functions from '@/utils/functions';
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import CustomAlert from '@/components/alert/CustomAlert';
import { useLocationStore } from '@/store/locationStore';

const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 60;

export default function Index() {
  
  const pathname = usePathname();
  const toast = useToast();
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);
  const userId = userBaseInfo?.userBaseInfo
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

  const [isLocationAlertOpen, setLocationAlertOpen] = React.useState(false);
  const [dontAskAgain, setDontAskAgain] = React.useState(false);
  const { latitude, longitude, setLocation } = useLocationStore();
  const { locationPermissionState, setLocationPermissionState, hasHydrated: hasLocationStoreHydrated } = GlobalLocationStore();
  
  const handleRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: newLat, longitude: newLon } = position.coords;
        setLocation(newLat, newLon);
        setLocationPermissionState('granted');
        toast({
          title: "위치 정보가 허용되었습니다.",
          position: 'top-right',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      },
      (error) => {
        let message = "위치 정보를 가져올 수 없습니다.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "위치 정보 접근이 차단되었습니다. 브라우저 설정을 확인해주세요.";
        }
        setLocationPermissionState('denied');
        toast({
          title: message,
          position: 'top-right',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleConfirmLocation = () => {
    handleRequestLocation();
    setLocationAlertOpen(false);
  };

  const handleCloseLocationAlert = React.useCallback(() => {
    if (dontAskAgain) {
      setLocationPermissionState('dont_ask');
    }
    setLocationAlertOpen(false);
  }, [dontAskAgain, setLocationPermissionState, setLocationAlertOpen]);

  React.useEffect(() => {
    if (!hasLocationStoreHydrated) {
      return;
    }
    
    if (locationPermissionState === 'dont_ask') {
      return;
    }
    
    if ( functions.isEmpty(latitude) || functions.isEmpty(longitude) || (latitude === 0 && longitude === 0)) { // Check if location is not set in useLocationStore
      if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
            setLocationAlertOpen(true);
          } else if (permissionStatus.state === 'granted') {
             navigator.geolocation.getCurrentPosition((position) => {
                 const { latitude: newLat, longitude: newLon } = position.coords;
                 setLocation(newLat, newLon);
                 setLocationPermissionState('granted');
             });
          } else if (permissionStatus.state === 'denied') {
              setLocationPermissionState('denied');
          }
        });
      }
    }
  }, [hasLocationStoreHydrated, locationPermissionState, latitude, longitude, setLocation, setLocationPermissionState]);

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
    },[userId,userBaseInfo?.userMaxToken,userBaseInfo?.userRetryLimitSec]
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

  return (
    <>
      {isMobileOnly ? (
        <Box height={`${mobileContainerHeight}px`} overflow={isMobileSafari ? 'auto' : 'hidden'} position={'relative'} ref={mobileScrollRef}>
          {
            !functions.isEmpty(userBaseInfo?.email) && (
              <TokenGuard />
            )
          }
        
          { ( !hasMounted || isLoading ) && ( 
            <Flex 
              bg={themeColor} 
              height={"100%"} 
              minHeight={"100vh"} 
              width="100%" 
              justifyContent={'center'} 
              alignItems={'center'} 
              zIndex={999999999}
              position={'absolute'}
              left={0}
              top={0}
              right={0}
              bottom={0}
            >
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
        </Box>
      ) : (
        <Flex justifyContent={'center'} position="relative">
          { ( !hasMounted || isLoading ) && ( 
            <Flex 
              bg={themeColor} 
              height={"100%"} 
              minHeight={"100vh"} 
              width="100%" 
              justifyContent={'center'} 
              alignItems={'center'} 
              zIndex={999999999}
              position={'absolute'}
              left={0}
              top={0}
              right={0}
              bottom={0}
            >
              <SkeletonCircle size='10' />
            </Flex>
            )
          }
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
      )}

      <CustomAlert
        AppName="위치 정보 동의"
        isShowAppname={true}
        isOpen={isLocationAlertOpen}
        onClose={handleCloseLocationAlert}
        onConfirm={handleConfirmLocation}
        closeText="아니요"
        confirmText="예"
        isCentered={true}
        bodyContent={
          <Box>
            <Text>
              더 나은 의사 추천을 위해 현재 위치 정보가 필요합니다.
              위치 정보 사용에 동의하시겠습니까?
            </Text>
            <Checkbox
              mt={4}
              isChecked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
            >
              다시 묻지 않기
            </Checkbox>
          </Box>
        }
        footerContent={
          <>
            <Button onClick={handleCloseLocationAlert}>아니요</Button>
            <Button colorScheme="blue" onClick={handleConfirmLocation} ml={3}>
              예
            </Button>
          </>
        }
      />
    </>
  );
}
