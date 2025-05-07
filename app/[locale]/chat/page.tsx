'use client';
import React, { Children } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import SubPage from '@/components/view/Chatbot';
import { Box, useDisclosure } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';

export default function Index() {

  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <PageLayout title="AIGA Chatbot">
      <Box>
        <Box
          pt={{ base: '60px', md: '100px' }}
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="hidden" /* 여기가 중요 */
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: '100%' }}
          maxWidth={{ base: '100%', xl: '100%' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
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
            p={{ base: '20px', lg: '20px' }}
          >
            <SubPage />
          </Box>
          <Box display={{base : 'none', lg:'block'}}>
              <Footer />
            </Box>
          </Box>
        </Box>
    </PageLayout>
  )
}

