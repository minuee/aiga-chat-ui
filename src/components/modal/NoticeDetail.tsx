'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Text,Flex,Stack,useColorModeValue,} from '@chakra-ui/react';
import { SkeletonText } from '@chakra-ui/react'
import mConstants from '@/utils/constants';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

export interface NoticerDetailModalProps extends PropsWithChildren {
  noticeID : any;
}
function NoticerDetailModal(props: NoticerDetailModalProps) {
  const { noticeID  } = props;
  const [ isLoading, setLoading] = React.useState(true);
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const skeletonColor = useColorModeValue('white', 'navy.800');
  const textColor2 = useColorModeValue('#7F879B', 'white');
  const titleColor = useColorModeValue('#212127', 'white');
  const dateColor = useColorModeValue('#7F879B', 'white');

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [noticeID]);

  if ( isLoading ) {
    <Stack direction="column" mb="auto"  width={'100%'} minHeight={'calc(100vh - 140px'}>
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='5' />
      </Box>
    </Stack>
  }
  
  // SIDEBAR
  return (
    <Flex flexDirection={'column'}  width="100%" height='100%' >
      <Flex width="100%" flexDirection={'column'}  borderBottom={'1px solid #DFE3EA'} pb="10px">
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
          <CustomText fontSize={'15px'} color={dateColor} lineHeight={"150%"}>{"YYYYY-MM-DD"}</CustomText>
          <CustomTextBold700 fontSize={'21px'} color={titleColor} lineHeight={"200%"}>공지사항 타이틀</CustomTextBold700>
        </Box>
      </Flex>
      <Flex width="100%" flexDirection={'column'} mt="10px" overflowY='auto'>
          <CustomText fontSize={'17px'} color={titleColor} lineHeight={"150%"}>본문내용...</CustomText>
      </Flex>
    </Flex>
  );
}

export default NoticerDetailModal;