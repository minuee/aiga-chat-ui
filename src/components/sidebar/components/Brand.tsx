'use client';
// Chakra imports
import { Flex,useColorMode } from '@chakra-ui/react';

import mConstants from '@/utils/constants';
import Image from 'next/image';
import { DefaultHeaderLogo,IconChatAiga } from '@/components/icons/svgIcons';

export function SidebarBrand() {
  //   Chakra color mode
  const { colorMode } = useColorMode();

  return (
    <Flex alignItems="flex-start" justifyContent={'center'} flexDirection="column" height={'50px'} pl="20px">
     { colorMode == 'dark' ? <DefaultHeaderLogo width={'61px'} height={'17px'} />  : <IconChatAiga width={'61px'} height={'17px'} /> }
    </Flex>
  );
}

export default SidebarBrand;
