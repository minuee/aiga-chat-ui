'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Text,Drawer,DrawerBody,Icon,useColorModeValue,DrawerOverlay,useDisclosure,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';
import Content from '@/components/sidebar/components/Content';
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import mConstants from '@/utils/constants';
import { IRoute } from '@/types/navigation';
import { isWindowAvailable } from '@/utils/navigation';
import { MdOutlineArrowBack,MdOutlineReorder,MdTableRows,MdOutlineMenu } from "react-icons/md";
export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const { routes, setApiKey } = props;
  let variantChange = '0.2s linear';
  let shadow = useColorModeValue( '14px 17px 40px 4px rgba(112, 144, 176, 0.08)','unset' );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  
  let sidebarRadius = '14px';
  let sidebarMargins = '0px';
  // SIDEBAR
  return (
    <Box display={{ base: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="100%"
        maxW={`${mConstants.modalMaxWidth}px`}
        ms={{ sm: '16px' }}
        my={{ sm: '16px' }}
        h="calc(100vh - 32px)"
        m={sidebarMargins}
        borderRadius={sidebarRadius}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          universal={true}
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content setApiKey={setApiKey} routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props: { routes: IRoute[] }) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const basicColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('#2b8fff', 'gray.500');
  const { routes } = props;
  return (
    <Flex 
      //display={{ sm: 'flex', xl: 'none' }} 
      alignItems="center"
    >
      <Flex w="max-content" h="max-content"  alignItems={'center'}>
        <Box onClick={onOpen} alignItems={'center'} display={'flex'} cursor={'pointer'}>
          <Icon as={MdOutlineMenu} width="24px" height="24px" color={basicColor} />
        </Box>
        <Box display={'flex'} minW={'52px'} height={'28px'} justifyContent={'center'} alignItems={'center'} bg={navbarIcon} borderRadius={'5px'}>  
          <Text fontSize={'17px'} color={basicColor}>
            로그인
          </Text>
        </Box>
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={
          isWindowAvailable() && document.documentElement.dir === 'rtl'
            ? 'right'
            : 'left'
        }
      >
        <DrawerOverlay />
        <DrawerContent
          w="100%"
          maxW={`${mConstants.modalMaxWidth}px`} 
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody 
            w="100%"
            maxW={`${mConstants.modalMaxWidth-10}px`} 
            px="0rem" 
            pb="0"
          >
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content 
                routes={routes} 
                onParentClose={onClose}
              />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

export default Sidebar;
