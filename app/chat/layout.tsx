'use client';
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { useColorModeValue, Box, Portal, Icon, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Header from '@/components/header/MainHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import AppWrappers from '../AppWrappers';

export default function PageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isShowScroll, setShowScroll] = useState(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    console.log(initialKey);
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  return (
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>
            <Box>
              {/* <Sidebar setApiKey={setApiKey} routes={routes} /> */}
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
                    setApiKey={setApiKey}
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
                <Box
                  display={{base : 'none', lg:'block'}}
                >
                  <Footer />
                </Box>
              </Box>
              
            </Box>
        </AppWrappers>
      </body>
    </html>
  );
}
