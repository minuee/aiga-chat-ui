'use client';

import React, { Children } from 'react';
import Head from 'next/head';
import PageLayout from '@/components/layout/PageLayout';
import SubPage from '@/components/view/Chatbot';
import { Box, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import mConstants from '@/utils/constants';

export default function Index() {

  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // 또는 로딩 스피너를 표시할 수 있습니다.
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
          <Box 
            display={{base : 'none', lg:'block'}}
            width={'100%'}
          >
            <Footer />
          </Box>
          </Box>
        </Box>
    </PageLayout>
  )
}

