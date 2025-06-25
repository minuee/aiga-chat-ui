'use client';

import React, { Children } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import PageLayout from '@/components/layout/PageLayout';
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
import CahtPageView from "@/components/view/ChatPage"


export default function Index() {

  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useColorMode();
  const { userId, ...userInfo } = UserStateStore(state => state);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  return (
    <PageLayout title="AIGA Chatbot">
      <CahtPageView />
    </PageLayout>
  )
}
/* 
return (
  <PageLayout title="AIGA Chatbot">
    <Box display={'flex'} justifyContent={'center'}>
      <Box
        minHeight="100vh"
        height="100%"
        overflow="hidden" 
        position="relative"
        maxHeight="100%"
        w={{ base: '100%', md : `${mConstants.desktopMinWidth}px`  }}
        maxW={`${mConstants.desktopMinWidth}px` }
      >
        <Box width="100%" maxWidth={`${mConstants.desktopMinWidth}px`}>
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
          <Box 
            display={'flex'} 
            alignItems={'center'} 
            px='basePadding' 
            width="100%" 
            maxWidth={`${mConstants.desktopMinWidth}px`} 
            overflow={'hidden'}
            bg='green'
          >
            <SubPage />
          </Box>
          :
          <Box display={'flex'} alignItems={'center'} px='basePadding' width="100%" maxWidth={`${mConstants.desktopMinWidth}px`} overflow={'hidden'}>
            <GlobalDisable
              setRetry={() => onHandleRetry() }
            />
          </Box>
        }
      </Box>
    </Box>
  </PageLayout>
) */