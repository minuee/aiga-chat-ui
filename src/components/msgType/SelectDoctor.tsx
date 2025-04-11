import { useRef,useEffect } from "react";
import functions from "../../utils/functions";
import dynamic from 'next/dynamic';
import NextImage, { ImageProps } from 'next/legacy/image';
import { Box,Flex,Stack,useColorModeValue ,Icon} from '@chakra-ui/react';
import { MdAutoAwesome, MdFitbit, MdCall, MdPerson } from 'react-icons/md';
import Image from 'next/image';
import Card from '@/components/card/Card'
type SelectDoctorProps = {
    onSendButton: (bool: boolean) => void; 
};

const SelectDoctor = ({ 
    onSendButton 
  }: SelectDoctorProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex
      alignItems={"center"}
      mt="20px"
      padding={'10px'}
      justifyContent={'flex-start'}
      minWidth={'100%'}
      width={'auto'}
      minHeight={"50px"}
      maxHeight={"210px"}
      overflowX={'auto'}
    >
      <Box mr={5} boxSize={200}  flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor1.png")}
          alt={'doctor1'}
        />
      </Box>
      <Box mr={5} boxSize={200}  flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor2.jpg")}
          alt={'doctor1'}
        />
      </Box>
      <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor1.png")}
          alt={'doctor1'}
        />
      </Box>
      <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor2.jpg")}
          alt={'doctor1'}
        />
      </Box>
      <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor1.png")}
          alt={'doctor1'}
        />
      </Box>
      <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton(true)}>
        <NextImage
          width="200"
          height="200"
          src={require("../../../public/img/sample/doctor2.jpg")}
          alt={'doctor1'}
        />
      </Box>

    </Flex>
  )
    
};
  
export default SelectDoctor;