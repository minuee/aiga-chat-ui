'use client';

import React, { Children } from 'react';
import Head from 'next/head';
import PageLayout from '@/components/layout/PageLayout';
import SubPage from '@/components/view/Chatbot';
import { Box, SkeletonCircle, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import mConstants from '@/utils/constants';
import UserStateStore from '@/store/userStore';
import ConfigInfoStore from '@/store/configStore';

import * as CommonService from "@/services/common/index";
import functions from '@/utils/functions';

export default function Index() {

  const pathname = usePathname();
  const { userId, ...userInfo } = UserStateStore(state => state);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const setConfigInfoStore = ConfigInfoStore((state) => state.setConfigInfoStore);
  const [isClient, setIsClient] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getConfigData = React.useCallback(
    async() => {
      try{
        const res:any = await CommonService.getCommonConfig();
        console.log("res of getCommonConfig",res)
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsLoading(false)
          setConfigInfoStore(
            functions.isEmpty(res?.data?.config?.user_max_token) ? 0 : parseInt(res?.data?.config?.user_max_token),
            functions.isEmpty(res?.data?.config?.user_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.user_retry_limit_sec),
            functions.isEmpty(res?.data?.config?.guest_max_token) ? 0 : parseInt(res?.data?.config?.guest_max_token),
            functions.isEmpty(res?.data?.config?.guest_retry_limit_sec) ? 0 : parseInt(res?.data?.config?.guest_retry_limit_sec)
          )
        }else{
          setConfigInfoStore(0,0,0,0)
        }          
      }catch(e:any){
        console.log("error of getCommonConfig",e)
        setConfigInfoStore(0,0,0,0)
      }
    },[userId,userInfo?.userMaxToken,userInfo?.userRetryLimitSec]
  );

  React.useEffect(() => {
    console.log("useEffect")
    getConfigData()
  }, [getConfigData]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
   return (
    <Box padding='6' boxShadow='lg' bg={'white'}>
      <SkeletonCircle size='10' />
    </Box>
   )
  }

  return (
    <PageLayout title="AIGA Chatbot">
      <Box display={'flex'} justifyContent={'center'}>
        <Box
          pt={{ base: '60px', md: '100px' }}
          minHeight="100vh"
          height="100%"
          overflow="hidden" /* 여기가 중요 */
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
          maxWidth={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
          borderLeft={'1px solid #e0e0e0'}
          borderRight={'1px solid #e0e0e0'}
        >
          <Box>
            <Navbar
              onOpen={onOpen}
              logoText={'AIGA Beta'}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Box>
          <Box
            display={'flex'}
            alignItems={'center'}
            p={{ base: '20px', lg: '20px' }}
          >
            <SubPage />
          </Box>
          {/* <Box 
            display={{base : 'none', lg:'block'}}
            width={'100%'}
          >
            <Footer />
          </Box> */}
        </Box>
      </Box>
    </PageLayout>
  )
}