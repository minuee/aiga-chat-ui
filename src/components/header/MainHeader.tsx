'use client';
/*eslint-disable*/

import {
  Flex,
  Box,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import routes from '@/routes';

export default function Footer() {
  const textColor = useColorModeValue('gray.500', 'white');
  let mainText = useColorModeValue('navy.700', 'white');
   const pathname = usePathname();
  const brandText = getActiveRoute(routes, pathname)
  return (
    <Flex
      zIndex="3"
      position={'absolute'}
      display={'flex'}
      left={0}
      top={0}
      width='100%'
      height={"80px"}
      maxHeight={"80px"}
      //bg="red"
      flexDirection={{
        base: 'column',
        sm :'row'
      }}
      alignItems={{
        base: 'center',
        sm : 'center'
      }}
      justifyContent={{
        base: 'space-between',
        sm :'center'
      }}
      //alignItems="center"
      //justifyContent="space-between"
    >
      <Box padding={"10px 20px"} flex={1} >
        <Text
          color={mainText}
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
        </Text>
      </Box>
      <Box 
        display={'flex'}
        flexDirection={{ base : 'row'}}
        justifyContent={'flex-end'}
        flex={1}
        padding={"10px 20px"}
      >
        <Box mr={2}>
          <Text color={mainText} borderRadius="inherit" fontWeight="bold" fontSize="20px">
            회사소개 
          </Text>
        </Box>
        <Box >
          <Text color={mainText} borderRadius="inherit" fontWeight="bold" fontSize="20px">
            Contact US 
          </Text>
        </Box>
        
      </Box>
    </Flex>
  );
}
