import Image from "next/image";
import { Box,Flex,Text,useColorModeValue ,Icon} from '@chakra-ui/react';
import { AiOutlineMeh } from "react-icons/ai";
import LogoImage from "@/assets/images/logo.png";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

type ChatWrongMessageProps = {
    msg: string;
    indexKey : any
};

const ChatWrongMessage = ({  msg = "흠..뭔가 잘못된 것 같습니다.", indexKey}: ChatWrongMessageProps) => {

  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'white');
  const textSystemColor = useColorModeValue('#212127', 'navy.800');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  
  return (
    <Flex w="100%" key={indexKey} flexDirection={'column'} mt="10px">
      <Box my="5px">
        <Image 
          src={LogoImage}
          alt="Aiga Logo"
          style={{width:'45px',objectFit: 'contain'}}
        />
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
  
export default ChatWrongMessage;