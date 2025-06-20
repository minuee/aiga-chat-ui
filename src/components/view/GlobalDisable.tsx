'use client';
import React from 'react';
// chakra imports
import {Flex,Box,useColorModeValue,Text,Button } from '@chakra-ui/react';
import Image from 'next/image';
//import IconAttension from "@/assets/icons/img-attention.png";
import { IconAttension } from '@/components/icons/svgIcons';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";


export interface GolbalDisableProps {
  setRetry : () => void;
}

function GolbalDisable(props: GolbalDisableProps) {

  const {  setRetry } = props;
  const confirmRef = React.useRef();
  const bgColor = useColorModeValue('#DFE3EA', 'white');
  const textColor2 = useColorModeValue('#FA6464', 'white');
  const titleColor = useColorModeValue('#212127', 'navy.800');
  const dateColor = useColorModeValue('#7F879B', 'white');
  
  return (
    <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'calc( 100vh - 200px )'} width={'100%'}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={'50px'}> 
        <IconAttension boxSize={'40px'} />
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt="20px"> 
        <CustomText fontSize={'17px'} color={textColor2}>
          일시적인 문제가 발생하였습니다.
        </CustomText>
      </Box>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt="20px"> 
        <Button 
          colorScheme='gray' 
          ref={confirmRef as any} 
          onClick={() => setRetry()} 
          id="button_retry" 
          bg={bgColor}
          sx={{borderRadius:'4px'}}
        >
          <CustomTextBold700 fontSize={'17px'} color={titleColor}>새로고침</CustomTextBold700>
        </Button>
      </Box>
    </Flex>
  )

}

export default GolbalDisable;