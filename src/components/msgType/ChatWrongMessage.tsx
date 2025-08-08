import React from 'react';
import { Box,Flex,useColorMode,useColorModeValue ,Icon} from '@chakra-ui/react';
import { AiOutlineMeh } from "react-icons/ai";
import CustomText from "@/components/text/CustomText";
import { IconChatAiga,DefaultHeaderLogo} from '@/components/icons/svgIcons';

type ChatWrongMessageProps = {
    msg: string;
    isMode : string;
    indexKey : any
};

const ChatWrongMessage = ({  isMode, msg = "흠..뭔가 잘못된 것 같습니다.", indexKey}: ChatWrongMessageProps) => {

  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'navy.600');
  const textSystemStopColor = useColorModeValue('#F94848', 'white');
  const textSystem400Color = useColorModeValue('#0AA464', 'white');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'white');
  const textSystem400IconColor = useColorModeValue('#0AA464', 'white');
  
  return (
    <Flex w="100%" key={indexKey} flexDirection={'column'} mt="10px">
      <Box my="5px">
        { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
      </Box>
      <Flex 
        padding="12px 20px" 
        border={`1px solid ${bgSystemStopColor}`} 
        bgColor={bgSystemStopColor} 
        borderTopLeftRadius="2px" 
        borderTopRightRadius="20px" 
        borderBottomLeftRadius="20px"
        borderBottomRightRadius="20px" 
        w="auto" 
        zIndex={2}
        alignItems={'center'}
      > 
        <Icon as={AiOutlineMeh} width="20px" height="20px" color={isMode == 'system_400' ?  textSystem400IconColor : textSystemStopIconColor} />
        <CustomText color={isMode == 'system_400' ? textSystem400Color : textSystemStopColor} fontSize={'17px'} lineHeight={'150%'} whiteSpace="pre-line" pl="5px">
          {msg}
        </CustomText>
      </Flex>
    </Flex>
  )
};
  
export default React.memo(ChatWrongMessage);