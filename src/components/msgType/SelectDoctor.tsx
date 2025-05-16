import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import { Box,Flex,Stack,useColorModeValue ,Button, Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants"
import DoctorList from "@/components/modal/DoctorList";
import { sampleDoctor1, sampleDoctor2,sampleDoctor3 } from "@/components/icons/IconImage";

type SelectDoctorProps = {
    onSendButton: (data: any,id:number) => void; 
};

const SelectDoctor = ({ 
    onSendButton 
  }: SelectDoctorProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isDark = useColorModeValue(false, true);
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.700');
  const starColor = useColorModeValue('#0000ff', '#ffffff');
  const skeletonColor = useColorModeValue('white', 'navy.700');

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if (( scrollLeft + clientWidth +100 ) >= scrollWidth) {
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
      maxHeight={"300px"}
      position={'relative'}
      sx={{
        '&::after': {
          content: showGradient ? '""' : 'none', 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '100%',
          background:  isDark ? 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0  , 1) 100%)' : 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
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
        <Box mr={5} boxSize={200}  flexShrink="0" onClick={() => onSendButton("data",1)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor1}
            alt={'doctor1'}
          />
        </Box>
        <Box mr={5} boxSize={200}  flexShrink="0" onClick={() => onSendButton("data",2)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor2}
            alt={'doctor1'}
          />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton("data",1)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor2}
            alt={'doctor1'}
          />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton('data',2)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor2}
            alt={'doctor1'}
          />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton('data', 1)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor2}
            alt={'doctor1'}
          />
        </Box>
        <Box  boxSize={200} flexShrink="0" onClick={() => onSendButton('data', 2)} cursor={'pointer'}>
          <NextImage
            width="200"
            height="200"
            src={sampleDoctor3}
            alt={'doctor1'}
          />
        </Box>
      </Flex>
      <Flex pl={2}>
        <Button size={'sm'} colorScheme="blue" onClick={() => setIsOpenModal(true)}>
          전체보기
        </Button>
      </Flex>
      {
          isOpenModal && (
            <Modal
              onClose={() => setIsOpenModal(false)}
              finalFocusRef={modalBtnRef}
              isOpen={isOpenModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader>{"신경쇠약[질환명]"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto" maxH="100vh">
                  <DoctorList
                    isOpen={isOpenModal}
                    setClose={() => setIsOpenModal(false)}
                    doctorData={[]}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
    </Stack>
  )
    
};
  
export default SelectDoctor;