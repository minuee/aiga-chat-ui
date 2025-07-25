
import React from 'react';
import { Box,Flex,Text,useColorModeValue ,Icon, UnorderedList,ListItem } from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import {  MdInfoOutline, MdPerson,MdOutlineMoodBad,MdOutlineClose } from 'react-icons/md';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import functions from '@/utils/functions';
import { isMobileOnly } from "react-device-detect";


type ChatDisableProps = {
  isChatDisabled : any;
  userBasicInfo : any;
  setChatDisabled: (data: any) => void; 
};

export const ChatDisable = React.memo(({ isChatDisabled,userBasicInfo,setChatDisabled }: ChatDisableProps) => {
  
  console.log("ChatDisable 렌더링"); // ← 디버깅용
  const closeColor = useColorModeValue('#000000', 'white');
  const oopsColor = useColorModeValue('#1D73DC', 'white');
  const bgColor = useColorModeValue('#EAF4FF', 'navy.600');
  const borderColor = useColorModeValue('#D5E9FF', 'navy.600')

  if ( userBasicInfo?.isGuest ) {
    return (
      <Flex 
        position={'absolute'}
        bottom={{base:"94px", sm:'66px'}}
        left={'0'}
        w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
        minHeight={'160px'}
        maxHeight={'300px'}
        justifyContent={'center'}
        alignItems={'center'}
        bg={bgColor}
        borderTopLeftRadius={"20px"}
        borderTopRightRadius={"20px"}
        borderTop="1px solid"
        borderColor={borderColor}
        zIndex={9999}
        boxShadow={'0px -4px 12px 0px #00000014'}
        overflowX={'hidden'}
        overflowY={'hidden'}
      >
        <Flex  padding={isMobileOnly ? "15px" : '20px 32px'} width={"100%"}  height={'100%'} flexDirection={'column'} alignItems={'space-evenly'}>
          <Box display={'flex'} alignItems={'center'} flex={1}>
            <Icon as={MdOutlineMoodBad} width="20px" height="20px" color={oopsColor} mr={3} />
            <CustomTextBold700 fontSize={isMobileOnly ? '16px' : {base:'15px', sm :'17px'}} color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
            비회원 일일 질문 제한
            </CustomTextBold700>
          </Box>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} flex={2} mt='5px'>
            <CustomTextBold400 fontSize={isMobileOnly ? '13px' :{base:'13px', sm :'15px'}} color={oopsColor} lineHeight={isMobileOnly ? '130%' : {base:'130%', sm :'150%'}} letterSpacing={isMobileOnly ? "-10%" : "-5%"}>
              오늘의 질문 제한에 도달했습니다. {functions.formatAvailabilityMessage2(isChatDisabled?.reTrytimeStamp, isChatDisabled?.remainTimeStamp)} 이후에 다시 시도해 주세요.
            </CustomTextBold400>
            <CustomTextBold400 fontSize={isMobileOnly ? '13px' :{base:'13px', sm :'15px'}} color={oopsColor} lineHeight={isMobileOnly ? '130%' : {base:'130%', sm :'150%'}}  letterSpacing={isMobileOnly ? "-10%" : "-5%"}>
              회원가입 하시면 다음과 같은 서비스를 제공받으실수 있습니다.
            </CustomTextBold400>
            <UnorderedList px="10px">
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={isMobileOnly ? '13px' : {base:'13px', sm :'15px'}} color={oopsColor} lineHeight={isMobileOnly ? '130%' : {base:'130%', sm :'150%'}} letterSpacing={"-5%"}>질문횟수증가</CustomTextBold400></ListItem>
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={isMobileOnly ? '13px' : {base:'13px', sm :'15px'}} color={oopsColor} lineHeight={isMobileOnly ? '130%' : {base:'130%', sm :'150%'}} letterSpacing={"-5%"}>대화내역저장</CustomTextBold400></ListItem>
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={isMobileOnly ? '13px' : {base:'13px', sm :'15px'}} color={oopsColor} lineHeight={isMobileOnly ? '130%' : {base:'130%', sm :'150%'}} letterSpacing={"-5%"}>개인 맞춤형 응답</CustomTextBold400></ListItem>
            </UnorderedList>
          </Box>
        </Flex>
        <Flex 
            position={'absolute'}
            top={0}
            right={0}
            width="50px"
            height={'50px'}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => setChatDisabled({...isChatDisabled, isAlertMsg : true })}
            cursor={'pointer'}
            zIndex={100}
          >
            <Icon as={MdOutlineClose} width="20px" height="20px" color={closeColor} />
          </Flex>
      </Flex>
    )
  }

  return (
    <Flex 
      position={'absolute'}
      bottom={{base:"94px", sm:'66px'}}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      minHeight={'100px'}
      maxHeight={'180px'}
      justifyContent={'center'}
      alignItems={'center'}
      bg={bgColor}
      borderTopLeftRadius={"20px"}
      borderTopRightRadius={"20px"}
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={9999}
      boxShadow={'0px -4px 12px 0px #00000014'}
      overflowX={'hidden'}
    >
      <Flex  padding='20px 32px' width={"100%"}  height={'100%'} flexDirection={'column'} alignItems={'space-evenly'}>
        <Box display={'flex'} alignItems={'center'} flex={1}>
          <Icon as={MdOutlineMoodBad} width="20px" height="20px" color={oopsColor} mr={3} />
          <CustomTextBold700 fontSize='17px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
          일일 질문 제한
          </CustomTextBold700>
        </Box>
        <Box display={'flex'} alignItems={'center'} flex={2} mt={2}>
          <CustomText fontSize={{base:'13px', sm :'15px'}} color={oopsColor} lineHeight={{base:'130%', sm :'150%'}} letterSpacing={"-5%"} noOfLines={2}>
            오늘의 질문 제한에 도달했습니다. {functions.formatAvailabilityMessage2(isChatDisabled?.reTrytimeStamp, isChatDisabled?.remainTimeStamp)} 이후에 다시 시도해 주세요.
          </CustomText>
        </Box>
      </Flex>
      <Flex 
          position={'absolute'}
          top={0}
          right={0}
          width="50px"
          height={'50px'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => setChatDisabled({...isChatDisabled, isAlertMsg : true })}
          cursor={'pointer'}
          zIndex={100}
        >
          <Icon as={MdOutlineClose} width="20px" height="20px" color={closeColor} />
        </Flex>
    </Flex>
  )
});

export const ChatWarningInfo = React.memo(() => {
  console.log("ChatWarningInfo 렌더링"); // ← 디버깅용
  const bgColor = useColorModeValue('#ffffff', 'navy.800');
  const infoIcon = useColorModeValue('#f94848', '#ffffff');
  const textColor = useColorModeValue('#7F879B', '#ffffff');
  const borderTopColor = useColorModeValue('#E9EDF3', 'navy.800');
  return (
    <Flex 
      position={'absolute'}
      top={{base :isMobileOnly ?  "-31px": "-37px", sm2:isMobileOnly ?'-18px' :  '-22px'}}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      minHeight={{base :isMobileOnly ? '38px' : '40px',sm2: isMobileOnly ? '21px' : '25px'}}
      height={'auto'}
      justifyContent={'center'}
      alignItems={'flex-end'}
      bg={bgColor}
      zIndex={9}
      borderTop={`1px solid  ${borderTopColor}`}
    >
      <Box display='flex' alignItems='center' width={"100%"} px="10px">
        <Icon as={MdInfoOutline} width="14px" height="14px" color={infoIcon}  />
        <CustomText fontSize='12px' color={textColor} lineHeight={'130%'} letterSpacing={'-5%'} pl="5px" noOfLines={2}>
          AIGA는 실수를 할 수 있습니다. 본 AI서비스는 의료행위가 아니며 답변에 어떠한 책임을 지지 않습니다.
        </CustomText>
      </Box>
    </Flex>
  )
});