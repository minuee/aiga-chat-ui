import React from 'react';
import { Box,Flex,useColorMode,useColorModeValue ,Icon} from '@chakra-ui/react';
import { AiOutlineMeh } from "react-icons/ai";
import CustomText from "@/components/text/CustomText";
import { IconChatAiga,DefaultHeaderLogo} from '@/components/icons/svgIcons';
type ForceStopProps = {
    msg: string;
    indexKey : any
};

const ForceStop = ({  msg = "대답이 중지되었습니다.", indexKey}: ForceStopProps) => {

  console.log("ForceStop 렌더링"); // ← 디버깅용
  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  
  return (
    <Flex w="100%" key={indexKey} flexDirection={'column'} my="10px">
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
        <Icon as={AiOutlineMeh} width="20px" height="20px" color={textSystemStopIconColor} />
        <CustomText color={textSystemStopColor} fontSize={'17px'} lineHeight={'150%'} whiteSpace="pre-line" pl="5px">
          {msg}
        </CustomText>
      </Flex>
    </Flex>
  )
};
  
export default React.memo(ForceStop);