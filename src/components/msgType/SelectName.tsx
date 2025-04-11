import { useState,useEffect } from "react";
import functions from "../../utils/functions";
import dynamic from 'next/dynamic';
import MessageBoxChat from '@/components/MessageBox';
import { Box,Flex,Stack,useColorModeValue ,Text} from '@chakra-ui/react';
import { MdAutoAwesome, MdFitbit, MdCall, MdPerson } from 'react-icons/md';
import Image from 'next/image';
import Card from '@/components/card/Card'
type SelectNameProps = {
    data: any;
    onSendButton: (str: string) => void; 
};

const SelectName = ({ 
    data,
    onSendButton 
  }: SelectNameProps) => {

  const textColor = useColorModeValue('navy.700', 'white');
  const textSelectedColor = useColorModeValue('blue', 'yellow')
  const [chioceNo, setChioceNo] = useState<any>( null );

  const onClickData = (str:string) => {
    setChioceNo(str);
    onSendButton(str)
  }
  return (
    <Flex w="100%" mt="10px" flexDirection={'column'}>
      {
        ['질환명 모름','가와사끼병','간질성폐질환','감영성심내막염','고지혈증','관상동맥'].map((element, index) => {
          return  (
            <Box 
              key={index} 
              onClick={() => onClickData(element)}
              border={'1px solid #cccccc'}
              padding="5px 10px"
              marginBottom='1px'
              borderRadius='3px'
            >
              <Text 
                color={ chioceNo == element ? textSelectedColor :textColor}
                fontWeight={ chioceNo == element ? 'bold' : 'normal'}
              >
                {element}
              </Text>
            </Box>
          )
        })
      }
      
    </Flex>
  )
    
};
  
export default SelectName;