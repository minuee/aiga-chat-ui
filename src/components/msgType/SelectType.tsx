import { Button,Flex,Stack,useColorModeValue,Box } from '@chakra-ui/react';
import { Md13Mp, MdFamilyRestroom, MdHub, MdEarbuds,MdGridView } from 'react-icons/md';
type SelectTypeProps = {
    onSendButton: (str: string) => void; 
    isDevelope : boolean
};

const SelectType = ({
    onSendButton,
    isDevelope = false
  }: SelectTypeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex 
      w="100%" 
      maxWidth={"600px"}
      mt="40px" 
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={"flex-start"}
      overflowX={'auto'}
    >
      <Box pl="0px" pt="10px" display={isDevelope ? 'flex' : 'none'} >
        <Stack direction='row' spacing={4}>
          <Button rightIcon={<Md13Mp />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_text')} id="button_type_text">
            텍스트
          </Button>
          <Button rightIcon={<MdEarbuds />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_doctors')} id="button_type_doctors">
            의사추천
          </Button>
          <Button rightIcon={<MdHub />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_list')} id="button_type_list">
            병명안내
          </Button>
          <Button rightIcon={<MdFamilyRestroom />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_select')} id="button_type_select">
            주체선택
          </Button>
          <Button rightIcon={<MdGridView />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_image')} id="button_type_image">
            그림선택
          </Button>
        </Stack>
      </Box>
    </Flex>
  )
    
};
  
export default SelectType;