import NextImage from 'next/legacy/image';
import { Flex,useColorModeValue,Text,Box,Icon} from '@chakra-ui/react';
import LoadingDots  from '@/components/icons/ProgressDot';
import ProcessingBar from "@/assets/icons/processing2x.gif";
type ProcessingProps = {
    msg: string;
};
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
const Processing = ({ msg = "분석 중"}: ProcessingProps) => {

  const textColor = useColorModeValue('#7F879B', 'white')
  
  return (
    <Flex w="100%" mt="10px" alignItems={'center'}>
      {/* <Flex
        borderRadius="full"
        justify="center"
        align="center"
        bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
        me="10px"
        h="40px"
        minH="40px"
        minW="40px"
      >
        <Icon as={MdFitbit} width="20px" height="20px" color="white" />
      </Flex> */}
      <Box ml={2} pt={2}>
        <LoadingDots />
        {/* <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} /> */}
      </Box>
      <Box ml={2} pt={1}>
        <CustomText color={textColor}>{msg}</CustomText>
      </Box>
    </Flex>
  )
};
  
export default Processing;