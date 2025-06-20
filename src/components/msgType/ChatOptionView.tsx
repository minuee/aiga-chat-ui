
import { Box,Flex,Text,useColorModeValue ,Icon} from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import {  MdInfoOutline, MdPerson,MdOutlineMoodBad,MdOutlineClose } from 'react-icons/md';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

type ChatDisableProps = {
  isChatDisabled : any;
  setChatDisabled: (data: any) => void; 
};

export const ChatDisable = ({ isChatDisabled,setChatDisabled }: ChatDisableProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  const oopsColor = useColorModeValue('#1D73DC', 'white');

  return (
    <Flex 
      position={'absolute'}
      bottom={"50px"}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      height={'140px'}
      justifyContent={'center'}
      alignItems={'center'}
      bg='#D5E9FF'
    >
      <Flex  padding='20px' width={"100%"}  height={'100%'} flexDirection={'column'} alignItems={'space-evenly'}>
        <Box display={'flex'} alignItems={'center'} flex={1}>
          <Icon as={MdOutlineMoodBad} width="20px" height="20px" color={oopsColor} mr={3} />
          <CustomTextBold700 fontSize='17px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
          일일 질문 제한?
          </CustomTextBold700>
        </Box>
        <Box display={'flex'} alignItems={'center'} flex={2}>
          <CustomText fontSize='15px' color={oopsColor} lineHeight={'150%'} letterSpacing={"-5%"}>
            오늘의 질문 제한에 도달했습니다. {"자동계산?"} 이후에 다시 시도해 주세요.
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
        >
          <Icon as={MdOutlineClose} width="20px" height="20px" color={oopsColor} />
        </Flex>
    </Flex>
  )
};



export const ChatWarningInfo = () => {

  const infoIcon = useColorModeValue('#f94848', 'white');
  return (
    <Flex 
      position={'absolute'}
      top={{base : '-40px', md : '-30px'}}
      left={'0'}
      w={{ base: '100%', md: `${mConstants.desktopMinWidth}px` }}
      height={'30px'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box display='flex' alignItems='center' gap='5px' width={"90%"}>
        <Icon as={MdInfoOutline} width="20px" height="20px" color={infoIcon} />
        <CustomText fontSize='0.8rem' color='gray.500' lineHeight={'0.8rem'}>
          AIGA는 실수를 할 수 있습니다. 본 AI서비스는 의료행위가 아니며 답변에 어떠한 책임도 지지 않습니다.
        </CustomText>
      </Box>
    </Flex>
  )
};