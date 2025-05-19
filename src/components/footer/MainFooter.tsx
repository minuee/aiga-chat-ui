'use client';
/*eslint-disable*/

import { Box,Flex,List,ListItem,Text,useColorModeValue } from '@chakra-ui/react';
import Link from '@/components/link/Link';

export default function Footer() {

  const textColor = useColorModeValue('gray.500', 'black');

  return (
    <Flex
      zIndex="3"
      flexDirection={{ base: 'column', sm :'row' }}
      alignItems={{ base: 'center', sm : 'center' }}
      justifyContent={{ base: 'space-between', sm :'center' }}
      //px={{ base: '30px', md: '50px' }}
      //pb="10px"
      minHeight={"100px"}
    >
      <Box padding={"10px 20px"} flex={1} >
        <Text
          color={textColor}
          fontSize={{ base: 'xs', md: 'sm' }}
          textAlign={{ base: 'center', xl: 'start' }}
          fontWeight="500"
          mb={{ base: '10px', xl: '0px' }}
        >
          {' '}
          &copy; {new Date().getFullYear()}
          <Text as="span" fontWeight="500" ms="4px">
            © AIGA All rights reserved.
          </Text>
        </Text>
      </Box>
      <Box 
        display={'flex'}
        flexDirection={{ base : 'row'}}
        justifyContent={'flex-end'}
        flex={1}
        padding={"10px 20px"}
      >
      <List display="flex">
        <ListItem
          me={{base: '10px',md: '44px'}}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="https://kormedi.com/"
            target='_blank'
          >
            회사소개
          </Link>
        </ListItem>
        <ListItem
          me={{base: '10px',md: '44px'}}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="https://kormedi.com/%ec%9d%b4%ec%9a%a9%ec%95%bd%ea%b4%80-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/"
            target='_blank'
          >
            이용약관
          </Link>
        </ListItem>
        <ListItem>
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="https://kormedi.com/%ea%b0%9c%ec%9d%b8%ec%a0%95%eb%b3%b4%ec%b2%98%eb%a6%ac%eb%b0%a9%ec%b9%a8-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/"
            target='_blank'
          >
            개인정보처리방침
          </Link>
        </ListItem>
      </List>
      </Box>
    </Flex>
  );
}
