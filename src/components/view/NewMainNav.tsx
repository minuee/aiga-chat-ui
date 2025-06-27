'use client';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import { Box,Flex,HStack,IconButton,useDisclosure,Drawer,DrawerOverlay,DrawerContent,DrawerBody,VStack,Link,Text,useToast } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useTranslations,useLocale} from 'next-intl';
import { usePathname, useRouter } from "@/i18n/routing";
import { IconFlagKorea } from '@/components/icons/svgIcons';

import Image from "next/image";
import FlagKorea from "@/assets/icons/flag-korea.png";
import FlagJapan from "@/assets/icons/flag-japan.png";
import FlagRussia from "@/assets/icons/flag-russia.png";
import FlagUsa from "@/assets/icons/flag-usa.png";
import FlagChina from "@/assets/icons/flag-china.png";

export default function ResponsiveNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);
  const toast = useToast();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('BrandPage');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const handleChange = ( str:string) => {
    if ( str == 'ko' || str == 'ja' ) {
      const locale = str;
      router.push({ pathname }, { locale });
    }else{
      toast({
        title: "해당언어는 준비중입니다.",
        position: 'top-right',
        status: 'info',
        containerStyle: {
          color: '#ffffff',
        },
        isClosable: true,
        duration:1500
      });
    }
    
  };

  const menuItems = [
    { label: `${t('nav_home')}`, href: '#home' },
    { label: `${t('nav_company')}`, href: '#about' },
    { label:`${t('nav_servide')}`, href: '#team' },
    { label: `${t('nav_contact')}`, href: '#contact' },
  ];

  return (
    <Box className="fix_nav"  w="100%" py={3}>
      <Box className="root_container" maxW="1200px" mx="auto" px={4}>
        <Flex className="nav-container" align="center" justify="space-between">
          <Text className="main_logo" fontWeight="bold" fontSize="xl">
            AIGA
          </Text>

          { ( isMobile  ) ? (
            <>
              <IconButton
                aria-label="메뉴 열기"
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="blue"
                onClick={onOpen}
              />
              <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg="#000000" color="white" maxWidth={"200px"}>
                  <DrawerBody>
                    <VStack spacing={6} mt={8}>
                      <Text className="main_logo" fontWeight="bold" fontSize="xl">
                          AIGA
                      </Text>
                      <Flex>
                        <Box onClick={()=>handleChange('ko')} cursor={'pointer'}>
                          <Image 
                            src={FlagKorea}
                            alt="FlagKorea"
                            style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                          />
                        </Box>
                        <Box onClick={()=>handleChange('ja')} cursor={'pointer'}>
                          <Image 
                            src={FlagJapan}
                            alt="FlagJapan"
                            style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                          />
                        </Box>
                        <Box onClick={()=>handleChange('en')} cursor={'pointer'}>
                          <Image 
                            src={FlagUsa}
                            alt="FlagUsa"
                            style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                          />
                        </Box>
                        <Box onClick={()=>handleChange('ru')} cursor={'pointer'}>
                          <Image 
                            src={FlagRussia}
                            alt="FlagRussia"
                            style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                          />
                        </Box>
                        <Box onClick={()=>handleChange('cn')} cursor={'pointer'}>
                          <Image 
                            src={FlagChina}
                            alt="FlagChina"
                            style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                          />
                        </Box>
                      </Flex>
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          fontSize="lg"
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <HStack as="ul" spacing={8}  listStyleType="none" alignItems={'flex-start'}>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </HStack>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
