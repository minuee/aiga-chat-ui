'use client';
// Chakra imports
import { Flex, useColorModeValue,Text } from '@chakra-ui/react';

import mConstants from '@/utils/constants';
import Image from 'next/image';
import LogoImage from "@/assets/images/logo.png";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="flex-start" justifyContent={'center'} flexDirection="column" height={'50px'} pl="20px">
      <Image 
          src={LogoImage}
          alt="Aiga Logo"
          style={{width:'76px',objectFit: 'contain'}}
        />
    </Flex>
  );
}

export default SidebarBrand;
