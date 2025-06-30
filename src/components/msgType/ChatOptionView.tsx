
import { Box,Flex,Text,useColorModeValue ,Icon, UnorderedList,ListItem } from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import {  MdInfoOutline, MdPerson,MdOutlineMoodBad,MdOutlineClose } from 'react-icons/md';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import functions from '@/utils/functions';
import ConfigInfoStore,{ GlobalStateStore } from '@/store/configStore';

type ChatDisableProps = {
  isChatDisabled : any;
  userBasicInfo : any;
  setChatDisabled: (data: any) => void; 
};

export const ChatDisable = ({ isChatDisabled,userBasicInfo,setChatDisabled }: ChatDisableProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  const oopsColor = useColorModeValue('#1D73DC', 'white');
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  if ( userBasicInfo?.isGuest ) {
    return (
      <Flex 
        position={'absolute'}
        bottom={"58px"}
        left={'0'}
        w={{ base: '100%', md: `${mConstants.desktopMinWidth-20}px` }}
        height={'100%'}
        minHeight={'190px'}
        maxHeight={'250px'}
        justifyContent={'center'}
        alignItems={'center'}
        bg='#D5E9FF'
        borderTopLeftRadius={"20px"}
        borderTopRightRadius={"20px"}
        zIndex={10}
      >
        <Flex  padding='20px' width={"100%"}  height={'100%'} flexDirection={'column'} alignItems={'space-evenly'}>
          <Box display={'flex'} alignItems={'center'} flex={1}>
            <Icon as={MdOutlineMoodBad} width="20px" height="20px" color={oopsColor} mr={3} />
            <CustomTextBold700 fontSize='17px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
            비회원 일일 질문 제한
            </CustomTextBold700>
          </Box>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} flex={2} mt='5px'>
            <CustomTextBold400 fontSize='15px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
              오늘의 질문 제한에 도달했습니다. {functions.formatAvailabilityMessage(isChatDisabled?.reTrytimeStamp, userBasicInfo?.isGuest ? guestRetryLimitSec : userRetryLimitSec)} 이후에 다시 시도해 주세요.
            </CustomTextBold400>
            <CustomTextBold400 fontSize='15px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
              회원가입 하시면 다음과 같은 서비스를 제공받으실수 있습니다.
            </CustomTextBold400>
            <UnorderedList>
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={'15px'} color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>질문횟수증가</CustomTextBold400></ListItem>
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={'15px'} color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>대화내역저장</CustomTextBold400></ListItem>
              <ListItem color={oopsColor}><CustomTextBold400 fontSize={'15px'} color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>개인 맞춤형 응답</CustomTextBold400></ListItem>
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
            <Icon as={MdOutlineClose} width="20px" height="20px" color={oopsColor} />
          </Flex>
      </Flex>
    )
  }

  return (
    <Flex 
      position={'absolute'}
      bottom={"58px"}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth-20}px` }}
      height={'100%'}
      minHeight={'140px'}
      maxHeight={'180px'}
      justifyContent={'center'}
      alignItems={'center'}
      bg='#D5E9FF'
      borderTopLeftRadius={"20px"}
      borderTopRightRadius={"20px"}
      zIndex={10}
    >
      <Flex  padding='20px' width={"100%"}  height={'100%'} flexDirection={'column'} alignItems={'space-evenly'}>
        <Box display={'flex'} alignItems={'center'} flex={1}>
          <Icon as={MdOutlineMoodBad} width="20px" height="20px" color={oopsColor} mr={3} />
          <CustomTextBold700 fontSize='17px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
          일일 질문 제한
          </CustomTextBold700>
        </Box>
        <Box display={'flex'} alignItems={'center'} flex={2}>
          <CustomText fontSize='15px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
            오늘의 질문 제한에 도달했습니다. {functions.formatAvailabilityMessage(isChatDisabled?.reTrytimeStamp, userBasicInfo?.isGuest ? guestRetryLimitSec : userRetryLimitSec)} 이후에 다시 시도해 주세요.
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
          <Icon as={MdOutlineClose} width="20px" height="20px" color={oopsColor} />
        </Flex>
    </Flex>
  )
};



export const ChatWarningInfo = () => {

  const bgColor = useColorModeValue('#ffffff', 'tranparent');
  const infoIcon = useColorModeValue('#f94848', '#ffffff');
  const textColor = useColorModeValue('#7F879B', '#ffffff');
  return (
    <Flex 
      position={'absolute'}
      top={{base : "-37px", sm2:'-22px'}}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      minHeight={{base : '40px' , sm2:'25px'}}
      height={'auto'}
      justifyContent={'center'}
      alignItems={'flex-end'}
      bg={bgColor}
      zIndex={9}
      borderTop="1px solid #E9EDF3"
    >
      <Box display='flex' alignItems='center' width={"100%"} px="16px">
        <Icon as={MdInfoOutline} width="14px" height="14px" color={infoIcon}  />
        <CustomText fontSize='12px' color={textColor} lineHeight={'130%'} letterSpacing={'-5%'} pl="5px" noOfLines={2}>
          AIGA는 실수를 할 수 있습니다. 본 AI서비스는 의료행위가 아니며 답변에 어떠한 책임을 지지 않습니다.
        </CustomText>
      </Box>
    </Flex>
  )
};