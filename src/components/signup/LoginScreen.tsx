'use client';
import React, { PropsWithChildren } from 'react';
import Image from "next/image";
// chakra imports
import { Box,Flex,Stack,useColorModeValue,useToast } from '@chakra-ui/react';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

import BaseImage from "@/assets/images/img-login.png";
import { IconKakao,IconNaver } from '@/components/icons/svgIcons';

export interface LoginScreenProps extends PropsWithChildren {
  onClickJoin  : (str:string) => void;
  onClcikClose : (str:string) => void;
  isProduction : boolean
}

function LoginScreen(props: LoginScreenProps) {
  const { onClickJoin,isProduction = false } = props;
  const [ isLoading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();

  const fontColor = useColorModeValue('#17191D', 'white');
  const fontColor2 = useColorModeValue('#7F879B', 'white');
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    toast.closeAll();
  };


    return (
      <Flex flexDirection="column" width="100%" height="100%" justifyContent="flex-start" alignItems="center" >
        <Stack flexDir="column" pt="10" mb="2" width="100%" height="100%" justifyContent="center" alignItems="center">
          <Box display={'flex'} flexDirection={'column'} flex={2} alignItems={'center'}>
            <CustomTextBold700 color={fontColor} fontSize={"21px"} lineHeight={"150%"}>AIGA 로그인</CustomTextBold700>
            <CustomText color={fontColor2} fontSize={"16px"} lineHeight={"200%"}>SNS 계정으로 편리하게 AIGA를 시작하세요</CustomText>
            <Image 
              src={BaseImage}
              alt="BaseImage"
              style={{width:'200px',objectFit: 'contain',maxWidth:"200px"}}
            />
          </Box>
          <Box display='flex' flex={1} flexDirection={'column'} w={"100%"} minW={"100%"} justifyContent={'flex-end'}> 
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('kakao')} bg='#F9DF32' py="10px" mb="10px" cursor={'pointer'}>
              <IconKakao boxSize={"30px"}  /> 
              <CustomText color="#212127" fontSize={"16px"}>카카오톡 로그인</CustomText>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('naver')} bg='#1EC800' py="10px"  cursor={'pointer'}>
              <IconNaver boxSize={"30px"} /> 
              <CustomText color="#ffffff" fontSize={"16px"}>네이버 로그인</CustomText>
            </Box>
          </Box>
        </Stack>
      </Flex>
    );

}

export default LoginScreen;