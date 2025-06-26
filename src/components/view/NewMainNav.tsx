'use client';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import { Box,Flex,HStack,IconButton,useDisclosure,Drawer,DrawerOverlay,DrawerContent,DrawerBody,VStack,Link,Text } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

export default function ResponsiveNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { label: '홈', href: '#home' },
    { label: '회사소개', href: '#about' },
    { label: '서비스', href: '#team' },
    { label: 'CONTACT', href: '#contact' },
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
