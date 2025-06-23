import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import { Box,Flex,Stack,useColorModeValue,Text,Icon, Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";

import { ModalDoctorListStore } from '@/store/modalStore';
import DoctorList from "@/components/modal/DoctorList";
import { sampleDoctor1, sampleDoctor2,sampleDoctor3 } from "@/components/icons/IconImage";
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
type SelectDoctorProps = {
    onSendButton: (data: any,id:number) => void; 
};

const SelectDoctor = ({  onSendButton  }: SelectDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isDark = useColorModeValue(false, true);
  const { isOpenDocListModal } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.700');
  const starColor = useColorModeValue('#0000ff', '#ffffff');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if ( ( scrollLeft + clientWidth +100 ) >= scrollWidth ) {
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

  const onSendDoctorListButton = async( gubun = "") => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_1}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`)   
    setOpenDoctorListModal(true);
  }

  const fn_close_modal_doctor_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenDoctorListModal(false);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','') 
    }, 200);
  }

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
          maxHeight : "250px",
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
          <NextImage width="200" height="200" src={sampleDoctor1} alt={'doctor1'} />
        </Box>
        <Box mr={5} boxSize={200}  flexShrink="0" onClick={() => onSendButton("data",2)} cursor={'pointer'}>
          <NextImage width="200" height="200" src={sampleDoctor2} alt={'doctor1'} />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton("data",1)} cursor={'pointer'}>
          <NextImage width="200" height="200" src={sampleDoctor2} alt={'doctor1'} />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton('data',2)} cursor={'pointer'}>
          <NextImage width="200" height="200" src={sampleDoctor2} alt={'doctor1'} />
        </Box>
        <Box mr={5} boxSize={200} flexShrink="0" onClick={() => onSendButton('data', 1)} cursor={'pointer'}>
          <NextImage width="200" height="200" src={sampleDoctor2} alt={'doctor1'}/>
        </Box>
        <Box  boxSize={200} flexShrink="0" onClick={() => onSendButton('data', 2)} cursor={'pointer'}>
          <NextImage width="200" height="200" src={sampleDoctor3} alt={'doctor1'} />
        </Box>
      </Flex>
      <Flex pr={2} justifyContent={'flex-end'}>
        <Box 
          display="flex" 
          justifyContent={'center'} 
          alignItems={'center'} 
          bg={"#DFF5ED"} 
          borderRadius={"4px"} 
          onClick={() => onSendDoctorListButton()} 
          gap={"4px"} 
          height={"32px"}
          px="20px"
          cursor={'pointer'}
        >
          <Text fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>
          {"{과목명}"} 전체보기 {">"}
          </Text>
        </Box>
      </Flex>
      {
        isOpenDocListModal && (
          <Modal
            onClose={() => fn_close_modal_doctor_list()}
            finalFocusRef={modalBtnRef}
            isOpen={isOpenDocListModal}
            scrollBehavior={'inside'}
            size={'full'}
          >
            <ModalOverlay />
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
              <ModalHeader bg={navbarBg} padding="basePadding">
                <Flex flexDirection={'row'} position={'relative'}>
                  <Box 
                    position={'absolute'}
                    left={0}
                    top={0}
                    width="50px"
                    height={'100%'}
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'}  
                    onClick={() => fn_close_modal_doctor_list()} cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                  </Box>
                  <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                    <Text color={'white'} noOfLines={1}>{"신경쇠약[질환명]"}</Text>
                  </Box>
                  <Box 
                    position={'absolute'}
                    right={0}
                    top={0}
                    width="50px"
                    height={'100%'}
                    display={{base :'none', md:'flex'}} 
                    justifyContent={'flex-end'} 
                    alignItems={'center'}  
                    onClick={() => fn_close_modal_doctor_list()}  cursor={'pointer'}
                    >
                    <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0" >
                <DoctorList
                  isOpen={isOpenDocListModal}
                  setClose={() => fn_close_modal_doctor_list()}
                  originDoctorData={[]}
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