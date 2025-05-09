'use client';
/* eslint-disable */
// Chakra Imports
import { 
  Box,
  Flex,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useColorModeValue 
} from '@chakra-ui/react';
import { useState, useEffect,useRef } from 'react';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { isWindowAvailable } from '@/utils/navigation';
import Image from 'next/image';
import LogoImage from "@/assets/images/logo.png";
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';

export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scrolled, setScrolled] = useState(false);
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
  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'none';
  let navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)',
  );
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
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="10px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      px={{ base: '8px',md: '10px',}}
      ps={{ base: '8px',md: '12px',}}
      pt="8px"
      top={{ base: '10px', md: '10x', xl: '10px' }}
      width={{base:'100%',md:'768px'}}
      /* w={{
        base: 'calc(100vw - 5%)',
        md: 'calc(100vw - 5%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 50px)',
        '2xl': 'calc(100vw - 65px)',
      }} */
    >
      <Flex
        w={{base:'100%',md:`${mConstants.desktopMinWidth}px`}}
        flexDirection={'row'}
        //flexDirection={{ base: 'row', sm: 'column' , md: 'row' , lg: 'row'}}
        alignItems={{ xl: 'center' }}
        mb={gap}
      >
        <Box mb={{ base: '8px', md: '0px' }} onClick={onOpen}>
          {/* <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="34px"
            p="0px"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText}
          </Link> */}
          <Image 
            src={LogoImage}
            alt="Aiga Logo"
            style={{width:'100px',objectFit: 'contain',maxWidth:"100px"}}
          />
        </Box>
        <Box ms="auto" w={{ sm: '100%', md: 'auto' }} maxW="160px">
          <AdminNavbarLinks secondary={props.secondary} />
        </Box>
      </Flex>
      <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={confirmRef as any}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent backgroundColor='white'>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                AIGA
              </AlertDialogHeader>

              <AlertDialogBody>
                새로운 대화로 이동하시겠습니까?
                이전 데이터는 히스토리를 통해 열람하실 수 있습니다.
              </AlertDialogBody>
             
              <AlertDialogFooter>
                <Button ref={confirmRef as any} onClick={onClose}>
                  취소
                </Button>
                <Button colorScheme='red' onClick={() => {setNewChatOpen(true);onClose()}} ml={3}>
                  열기
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
    </Box>
  );
}
