'use client';
// Chakra imports
import { Flex, useColorModeValue,Text } from '@chakra-ui/react';

import { HorizonLogo,AigaLog } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      {/* <AigaLog h="26px" w="146px" my="30px" color={logoColor} /> */}
      <Text
        color={logoColor}
        fontWeight="500"
        fontSize="xl"
      >
        AIGA 의사추천 
      </Text>
      <HSeparator mt="20px" mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
