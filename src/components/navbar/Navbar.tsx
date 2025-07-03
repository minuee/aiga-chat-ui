'use client';
/* eslint-disable */
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// Chakra Imports
import { Box,Flex,useColorMode,useColorModeValue,Icon,Text,Button } from '@chakra-ui/react';
import { useState, useEffect,useRef } from 'react';
import NavbarLinks from './NavbarLinks';
import { isWindowAvailable } from '@/utils/navigation';
import Image from 'next/image';
import LogoImage from "@/assets/images/logo.png";
import mConstants from '@/utils/constants';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
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

  const { secondary, brandText } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  const navbarIcon = useColorModeValue('gray.500', 'gray.500');
  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'none';
  const basicColor = useColorModeValue('white', 'rgba(0, 59, 149, 1)');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgb(255, 255, 255)');
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';
  let gap = '0px';

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
      //borderTopLeftRadius={ isDesktop ? '15px' : 0}
      //borderTopRightRadius={ isDesktop ? '15px' : 0}

    >
      <Flex
        w={{base:'100%',md:`${mConstants.desktopMinWidth}px`}}
        flexDirection={'row'}
        //flexDirection={{ base: 'row', sm: 'column' , md: 'row' , lg: 'row'}}
        alignItems={{ xl: 'center' }}
      >
        <Box display={'flex'} flex={1} pl={"20px"} alignItems={'center'}>
          {/* <Image 
            src={LogoImage}
            alt="Aiga Logo"
            style={{width:'70px',objectFit: 'contain'}}
          /> */}
          {/* <Icon as={MdOutlineArrowBack} width="25px" height="25px" color={basicColor} />
          <Icons.AigaWelcomeIcon h="40px" w="60px" color={basicColor} /> */}
        </Box>
        <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'center'}>
         {/*  <CustomTextBold700 fontSize={'17px'} color={basicColor}>AIGA</CustomTextBold700> */}
         {
            colorMode == 'dark' 
            ?
            <IconChatAiga width={'61px'} height={'17px'} />
            :
            <DefaultHeaderLogo width={'61px'} height={'17px'} />
         }
         
        </Box>
        <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'flex-end'} pr="10px">
          <NavbarLinks secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
