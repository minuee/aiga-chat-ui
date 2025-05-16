import { Button,Flex,Stack,useColorModeValue } from '@chakra-ui/react';
import { Md13Mp, MdFamilyRestroom, MdHub, MdEarbuds,MdGridView } from 'react-icons/md';
type SelectTypeProps = {
    onSendButton: (str: string) => void; 
};

const SelectType = ({
    onSendButton 
  }: SelectTypeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex 
      w="100%" 
      mt="10px" 
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={"flex-start"}
      minWidth={'100%'}
      width={'auto'}
      overflowX={'auto'}
    >
      <Flex pl="40px" pt="10px">
        <Stack direction='row' spacing={4}>
          <Button rightIcon={<Md13Mp />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_text')}>
            텍스트
          </Button>
          <Button rightIcon={<MdEarbuds />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_doctors')}>
            의사추천
          </Button>
          <Button rightIcon={<MdHub />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_list')}>
            병명안내
          </Button>
          <Button rightIcon={<MdFamilyRestroom />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_select')}>
            주체선택
          </Button>
          <Button rightIcon={<MdGridView />} colorScheme='teal' variant='outline' onClick={() => onSendButton('system_image')}>
            그림선택
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
    
};
  
export default SelectType;