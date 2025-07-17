import React from 'react';
import { Flex,useColorModeValue,Box} from '@chakra-ui/react';
import LoadingDots  from '@/components/icons/ProgressDot';

type ProcessingProps = {
    msg: string;
};
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
const Processing = ({ msg = "분석 중"}: ProcessingProps) => {

  const textColor = useColorModeValue('#7F879B', 'white')
  console.log("Processing 렌더링"); // ← 디버깅용
  return (
    <Flex w="100%" mt="10px" alignItems={'center'}>
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
  
export default React.memo(Processing);