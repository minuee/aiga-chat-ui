import MessageBoxChat from '@/components/MessageBox';
import { Button,Flex,Stack,useColorModeValue ,Icon} from '@chakra-ui/react';
import { MdFitbit, MdPerson } from 'react-icons/md';

type WelcomeProps = {
    msg: string;
    onSendButton: (str: string) => void; 
};

const Welcome = ({ 
    msg = "안녕하세요? 건강AI AIGA에요\n누가 아프신가요?",
    onSendButton 
  }: WelcomeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex w="100%" mt="10px" flexDirection={'column'}>
      <Flex >
        <Flex
          borderRadius="full"
          justify="center"
          align="center"
          bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
          h="40px"
          minH="40px"
          minW="40px"
        >
          <Icon as={MdFitbit} width="20px" height="20px" color="white" />
        </Flex>
        <MessageBoxChat output={msg} />
      </Flex>
      <Flex pl="40px" pt="10px">
        <Stack direction='row' spacing={4}>
          <Button rightIcon={<MdPerson />} colorScheme='teal' variant='outline' onClick={() => onSendButton('본인')}>
            본인
          </Button>
          <Button rightIcon={<MdPerson />} colorScheme='teal' variant='outline' onClick={() => onSendButton('가족')}>
            가족
          </Button>
          <Button rightIcon={<MdPerson />} colorScheme='teal' variant='outline' onClick={() => onSendButton('아이')}>
            아이
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
};
  
export default Welcome;