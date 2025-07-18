'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Drawer,DrawerBody,useColorModeValue,DrawerOverlay,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import functions from '@/utils/functions';
import { routing } from '@/i18n/routing';
import  mConstants from '@/utils/constants';

export interface ChatModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function ChatScreenModal(props: ChatModalProps) {
  const { isOpen, setClose } = props;
  const [locale, setLocale] = React.useState<string>(routing.defaultLocale);

  React.useEffect(() => {  
    const locale = mCookie.getCookie('currentLocale'); 
    if ( !functions.isEmpty(locale) ) {
      setLocale(locale);
    }
  },[isOpen]);

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  // SIDEBAR
  return (
    <Box display={{ base: 'block', xl: 'block' }} position="fixed" minH="100%">
      <Drawer
        isOpen={isOpen}
        onClose={setClose}
        placement={'left'}
      >
        <DrawerOverlay />
        <DrawerContent
          w="100%"
          maxW={`${mConstants.modalMaxWidth}px`}
          borderRadius="0px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={setClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW={`${mConstants.modalMaxWidth}px`} px="0rem" pb="0">
            <iframe
              src={`/${locale}/chat`}
              width="100%"
              height="100%"
              style={{ border: "none", paddingBottom: "20px" }}
            />
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default ChatScreenModal;