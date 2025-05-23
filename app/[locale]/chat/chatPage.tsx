'use client';
import React, { ReactNode } from 'react';
import { useColorModeValue, Box, Portal, Icon, useDisclosure } from '@chakra-ui/react';
import routes from '@/routes';
import { SessionProvider } from "next-auth/react";
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import AppWrappers from '../AppWrappers';

export default function PageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    <AppWrappers>
      <SessionProvider>
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
              //mx="auto"
              p={{ base: '20px', lg: '20px' }}
              //pe="20px"
              //minH="100vh"
              //pt="50px"
              //bg="white"
              //ref={scrollRef}
            >
              {children}
              {/* <Component apiKeyApp={apiKey} {...pageProps} /> */}
            </Box>
            <Box display={{base : 'none', lg:'block'}}>
              <Footer />
            </Box>
          </Box>
        </Box>
        </SessionProvider>
      </AppWrappers>
    </>
  );
}
