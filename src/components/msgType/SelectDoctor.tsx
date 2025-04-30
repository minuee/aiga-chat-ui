import { useRef, useEffect, useState } from "react";
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
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if (scrollLeft + clientWidth >= scrollWidth) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };

  useEffect(() => {
    const flexElement = flexRef.current;
    if (flexElement) {
      flexElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (flexElement) {
        flexElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Stack
      minWidth={'100%'}
      width={'auto'}
      minHeight={"50px"}
      maxHeight={"250px"}
      position={'relative'}
      sx={{
        '&::after': {
          content: showGradient ? '""' : 'none', 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '100%',
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
          pointerEvents: 'none', // 클릭 이벤트 방지
        },
      }}
    >
      <Flex
        alignItems={"center"}
        mt="20px"
        padding={'10px'}
        justifyContent={'flex-start'}
        minWidth={'100%'}
        width={'auto'}
        minHeight={"50px"}
        maxHeight={"250px"}
        overflowX={'auto'}
        ref={flexRef} 
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
        <Box  boxSize={200} flexShrink="0" onClick={() => onSendButton(true)}>
          <NextImage
            width="200"
            height="200"
            src={require("../../../public/img/sample/doctor2.jpg")}
            alt={'doctor1'}
          />
        </Box>
      </Flex>
    </Stack>
  )
    
};
  
export default SelectDoctor;