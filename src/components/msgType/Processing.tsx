import NextImage from 'next/legacy/image';
import { Flex,useColorModeValue,Text,Box,Icon} from '@chakra-ui/react';
import { MdFitbit } from 'react-icons/md';
import { loadingImage } from "@/components/icons/IconImage";

type ProcessingProps = {
    msg: string;
};

const Processing = ({ msg = "증상 분석 중"}: ProcessingProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex w="100%" mt="10px" alignItems={'center'}>
      <Flex
        borderRadius="full"
        justify="center"
        align="center"
        bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
        me="10px"
        h="40px"
        minH="40px"
        minW="40px"
      >
        <Icon
          as={MdFitbit}
          width="20px"
          height="20px"
          color="white"
        />
      </Flex>
      <Box ml={2} pt={2}>
        <NextImage
          width="25"
          height="25"
          src={loadingImage}
          alt={'loading'}
        />
      </Box>
      
      <Box ml={2} pt={1}>
        <Text color={textColor}>{msg}</Text>
      </Box>
      
    </Flex>
  )
    
};
  
export default Processing;