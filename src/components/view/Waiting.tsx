'use client';
import React, { Children } from 'react';
import '@/styles/Main.css';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import { Box,Flex,Stack,useColorModeValue,} from '@chakra-ui/react';
export default function MainPage() {
  
  return (
    <>
        <Flex
            minBlockSize={'100vh'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'column'}
            bg={'#f5f5f5'}
            textAlign={'center'}
        >
            <img
                src="/img/renual.png"
                alt="공사중"
                width='400'
            />
        </Flex>
    </>
  ) 
}
