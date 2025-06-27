'use client';

import React, { Children } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import SubPage from '@/components/view/Chatbot';
import { Flex,Box, SkeletonCircle, useDisclosure,useColorModeValue,useColorMode } from '@chakra-ui/react';
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

export default function Index() {

  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useColorMode();
  const { userId, ...userInfo } = UserStateStore(state => state);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const setConfigInfoStore = ConfigInfoStore((state) => state.setConfigInfoStore);
  const { isGlobalState } = GlobalStateStore(state => state);
  const setGlobalState = GlobalStateStore((state) => state.setGlobalState);
  const [isClient, setIsClient] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const themeColor = useColorModeValue('white', 'navy.800');

  const getConfigData = React.useCallback(
    async() => {
      try{
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
    getConfigData()
  }, [getConfigData]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onHandleRetry  = () => {
    getConfigData();
  }

  if (isLoading) {
   return (
    <Flex  bg={themeColor} height={"100%"} width="100%" justifyContent={'center'} alignItems={'center'}>
      <SkeletonCircle size='10' />
    </Flex>
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
            isGlobalState 
            ?
            <Flex 
              mt="60px"
              alignItems={'center'} 
              px='basePadding' 
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
