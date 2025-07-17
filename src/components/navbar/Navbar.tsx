'use client';

// Chakra Imports
import { Box,Flex,useColorMode,useColorModeValue,Spacer } from '@chakra-ui/react';
import { useState, useEffect,useRef } from 'react';
import NavbarLinks from './NavbarLinks';
import { isWindowAvailable } from '@/utils/navigation';

import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';
import { DefaultHeaderLogo,IconChatAiga } from '@/components/icons/svgIcons';
export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const confirmRef = useRef();
  useEffect(() => {
    isWindowAvailable() && window.addEventListener('scroll', changeNavbar);

    return () => {
      isWindowAvailable() && window.removeEventListener('scroll', changeNavbar);
    };
  });

  let navbarPosition = 'fixed' as const;
  let navbarShadow = 'none';
  const basicColor = useColorModeValue('white', 'rgba(0, 59, 149, 1)');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgb(255, 255, 255)');


  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  
  return (
    <Box
      zIndex="100"
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      display={'flex'}
      minH="60px"
      justifyContent={{ xl: 'center' }}
      top={0}
      width={{base:'100%',md: `${mConstants.desktopMinWidth}px`}}
      maxW={`${mConstants.desktopMinWidth}px` }
    >
      <Flex
        w={{base:'100%',md:`${mConstants.desktopMinWidth}px`}}
        flexDirection={'row'}
        //flexDirection={{ base: 'row', sm: 'column' , md: 'row' , lg: 'row'}}
        alignItems={{ xl: 'center' }}
      >
        <Spacer flex={1}  />
        <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'center'}>
         { colorMode == 'dark' ? <IconChatAiga width={'61px'} height={'17px'} /> : <DefaultHeaderLogo width={'61px'} height={'17px'} /> }
        </Box>
        <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'flex-end'} pr="10px">
          <NavbarLinks secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
