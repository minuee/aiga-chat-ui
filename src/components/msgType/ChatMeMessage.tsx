import { Box,Flex,Text,useColorModeValue ,Icon} from '@chakra-ui/react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
type ChatMeMessageProps = {
  question: string;
    indexKey : any
};
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
const ChatMeMessage = ({  question = "대답이 중지되었습니다.", indexKey}: ChatMeMessageProps) => {

  const bgMeColor = useColorModeValue('#2B8FFF', 'navy.600');
  const textMeColor = useColorModeValue('white', 'white');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  
  return (
    <Flex w="100%" align={'center'} mb="28px"  mt={ indexKey === 0 ? isMobileOnly ? "16px" : 0 : "28px"}  justifyContent='flex-end'>
      <Flex 
        padding="12px 20px" 
        border={`1px solid ${bgMeColor}`} 
        bgColor={bgMeColor} 
        borderTopLeftRadius="24px" 
        borderTopRightRadius="2px" 
        borderBottomLeftRadius="24px"
        borderBottomRightRadius="24px" 
        w="auto" 
        zIndex={2}
      >
        <CustomText color={textMeColor} fontSize={'17px'} lineHeight={'150%'} whiteSpace="pre-line">
          {question}
        </CustomText>
      </Flex>
    </Flex>
  )
};
  
export default ChatMeMessage;