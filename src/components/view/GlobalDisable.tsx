'use client';
import React from 'react';
// chakra imports
import {Flex,Box,useColorModeValue,Text,Button } from '@chakra-ui/react';
import Image from 'next/image';
import ImageNullList from "@/assets/icons/img-attention.png";

export interface GolbalDisableProps {
  setRetry : () => void;
}

function GolbalDisable(props: GolbalDisableProps) {

  const {  setRetry } = props;
  const confirmRef = React.useRef();
  const skeletonColor = useColorModeValue('white', 'navy.800');
  const textColor2 = useColorModeValue('#FA6464', 'white');
  const titleColor = useColorModeValue('#212127', 'white');
  const dateColor = useColorModeValue('#7F879B', 'white');
  
  return (
    <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'calc( 100vh - 200px )'} width={'100%'}>
      <Box display={'flex'} justifyContent={'center'} alignContent={'center'}> 
        <Image 
          src={ImageNullList}
          alt="Warning"
          style={{width:'32px',objectFit: 'contain',maxWidth:"32px"}}
        />
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignContent={'center'} mt="20px"> 
        <Text fontSize={'17px'} color={textColor2}>
          일시적인 문제가 발생하였습니다.
        </Text>
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignContent={'center'} mt="20px"> 
        <Button colorScheme='gray' ref={confirmRef as any} onClick={() => setRetry()} id="button_retry" bg='#DFE3EA'>
          새로고침
        </Button>
      </Box>
    </Flex>
  )

}

export default GolbalDisable;