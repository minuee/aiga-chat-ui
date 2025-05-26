'use client';
// Chakra imports
import { Flex, useColorModeValue,Text,Box } from '@chakra-ui/react';

import { HorizonLogo,AigaLog } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function HeadTitle(props: {title: string}) {
  const { title } = props;
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="left" flexDirection="column" >
      {/* <AigaLog h="26px" w="146px" my="30px" color={logoColor} /> */}
      <Box sx={{width:'100%',height:'100%',paddingLeft:'20px',marginTop:'20px'}}>
        <Text
          color={logoColor}
          fontWeight="500"
          fontSize="xl"
        >
          {title}
        </Text>
      </Box>
      <HSeparator mt="10px" mb="10px" w="100%" />
    </Flex>
  );
}

export default HeadTitle;