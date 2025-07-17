import { Flex,useColorModeValue} from '@chakra-ui/react';
import { isMobileOnly } from "react-device-detect";
type ChatMeMessageProps = {
  question: string;
    indexKey : any
};
import CustomText from "@/components/text/CustomText";
const ChatMeMessage = ({  question = "대답이 중지되었습니다.", indexKey}: ChatMeMessageProps) => {

  const bgMeColor = useColorModeValue('#2B8FFF', 'navy.700');
  const textMeColor = useColorModeValue('white', 'white');
  
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