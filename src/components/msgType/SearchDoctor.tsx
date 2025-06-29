import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import Image from 'next/image';
import { Box,Flex,Stack,useColorModeValue,Text,Icon,Modal,ModalOverlay,ModalContent,ModalHeader,SimpleGrid,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import { BiChevronRight } from "react-icons/bi";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import DoctorAvatar from "@/assets/images/doctor_default_white.png";
import { IconChatAiga} from '@/components/icons/svgIcons';
import { ModalDoctorListStore } from '@/store/modalStore';
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
import DoctorList from "@/components/modal/DoctorList";
import { MdOutlineArrowForward } from 'react-icons/md';

type SearchDoctorProps = {
    data : any;
    isHistory : boolean;
    onSendButton: (data: any,id:number) => void; 
};

const SearchDoctor = ({  onSendButton , data,isHistory }: SearchDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [doctorList, setDoctorList] = useState<any>([]);
  const isDark = useColorModeValue(false, true);
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const profileBgColor = useColorModeValue("#F4F6FA",'navy.600');
  const nameTextColor = useColorModeValue('#17191D','white');
  const partTextColor = useColorModeValue('#7F879B','white');
  const arrowColor = useColorModeValue("#000000",'white')
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.700');
  const navbarBgColor = useColorModeValue('white', 'navy.800');
  const navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const navbarIcon = useColorModeValue('#7F879B', 'white');
  const iconColor = useColorModeValue('#0AA464','#0AA464');
  
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const { isOpenDocListModal } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if ( ( scrollLeft + clientWidth + 100 ) >= scrollWidth ) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      const el = flexRef.current;
      if (!el) return;
      el.addEventListener('scroll', handleScroll);
     
      // 정리
      return () => {
        if (el) {
          el.removeEventListener('scroll', handleScroll);
        }
      };
    }, 500); // 0.5초 후에 강제 시도
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ( !functions.isEmpty( data?.answer?.doctors )) {
      setDoctorList(data?.answer?.doctors)
    }
  }, [data]);

  const onSendDoctorListButton = async( ) => {
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

  
  if ( doctorList?.length == 0 ) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
        <Box my="5px">
          <IconChatAiga width={'46px'} height={"12px"} />
        </Box>
        <Flex 
          padding="12px 20px" 
          border={`1px solid ${bgSystemColor}`} 
          bgColor={bgSystemColor} 
          borderTopLeftRadius="2px" 
          borderTopRightRadius="20px" 
          borderBottomLeftRadius="20px"
          borderBottomRightRadius="20px" 
          w="auto" 
          zIndex={2}
          justifyContent={'center'}
          flexDirection={'column'}
        > 
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>추천할 의사를 찾을 수 없습니다.</CustomText> 
        </Flex>
      </Flex>
    )
  }else if ( doctorList?.length  <  3 ) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
        <Box my="5px">
          <IconChatAiga width={'46px'} height={"12px"} />
        </Box>
        <Flex  
          alignItems={"center"} 
          justifyContent={'flex-start'} 
          minWidth={'100%'} 
          width={'auto'} 
          minHeight={"50px"} 
          //maxHeight={"0px"}  
          ref={flexRef} 
          mt={'10px'}
        >
          {
            doctorList.map((element: any, index: number) => (
              <Flex 
                key={index} 
                bg={profileBgColor} 
                width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                padding="20px"
                borderRadius="20px"
                onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
              >
                <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} maxWidth={"70px"}>
                  <NextImage 
                    src={DoctorAvatar}
                    alt="프로필이미지"
                    style={{ borderRadius: '50%', objectFit: 'cover' }} 
                    width={60} 
                    height={60}
                  />
                </Box>
                <Flex flex={4} flexDirection={'column'} justifyContent={'center'} px="20px">
                  <Box display={'flex'} alignItems={'center'} height={'26px'}>
                    <CustomTextBold700 fontSize={'17px'} color={nameTextColor} lineHeight={"150%"} noOfLines={1}>
                      {element?.name}
                    </CustomTextBold700>
                  </Box>
                  <Box display={'flex'}  alignItems={'center'} height={'26px'}>
                    <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                      {element?.hospital}
                    </CustomTextBold700>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} height={'26px'}>
                    <CustomTextBold700 fontSize={'12px'} color={partTextColor} lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                      {element?.deptname}
                    </CustomTextBold700>
                  </Box>
                </Flex>
                <Box
                  flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}
                  onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
                >
                  <Icon as={BiChevronRight} width="20px" height="20px" color={arrowColor} />
                </Box>
              </Flex>
            ))
          }
        </Flex>
        <Box justifyContent={'flex-end'} display={doctorList?.length == 0 ? 'none' : 'flex'} mt="10px">
          <Box 
            display="flex" justifyContent={'center'} alignItems={'center'} bg={"#DFF5ED"} borderRadius={"4px"} gap={"4px"} height={"32px"} px="20px" cursor={'pointer'}
            onClick={() => onSendDoctorListButton()} 
          >
            <CustomTextBold700 fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>
            {doctorList[0]?.deptname} 전체보기
            </CustomTextBold700>
            <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
          </Box>
        </Box>

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
                      <Text color={'white'} noOfLines={1}>{doctorList[0]?.deptname ?? "의사 소개"}</Text>
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
                    originDoctorData={doctorList}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
      </Flex>
    )
  }else{
    return (
      <Stack
        minWidth={'100%'} width={'auto'} minHeight={"60px"} position={'relative'}
        sx={{
          '&::after': {
            content: ( showGradient && doctorList?.length > 4 ) ? '""' : 'none', position: 'absolute', top: 0,right: 0,width: '200px',height: '100%',maxHeight : "280px",
            background:  isDark ? 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0  , 1) 100%)' : 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
            pointerEvents: 'none', // 클릭 이벤트 방지
          },
        }}
      >
        <Box mt="5px">
          <IconChatAiga width={'46px'} height={"12px"} />
        </Box>
        <Flex 
          padding="12px 20px" 
          border={`1px solid ${bgSystemColor}`} 
          bgColor={bgSystemColor} 
          borderTopLeftRadius="2px" 
          borderTopRightRadius="20px" 
          borderBottomLeftRadius="20px"
          borderBottomRightRadius="20px" 
          w="auto" 
          zIndex={2}
          justifyContent={'center'}
          flexDirection={'column'}
        > 
          <Box>
            <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>{`위 증상에 맞는  ${doctorList[0]?.deptname} 의사를 추천해 드립니다.`}</CustomText>
          </Box>  
        </Flex>
        <Flex  alignItems={"center"} justifyContent={'flex-start'} minWidth={'100%'} width={'auto'} minHeight={"60px"} maxHeight={"250px"} ref={flexRef} overflowX={'auto'}>
          {
            doctorList.map((element: any, index: number) => (
              <Flex 
                key={index} 
                flexDirection="column" 
                bg={profileBgColor} 
                minWidth={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                maxWidth='300px' 
                px="10px"
                borderRadius="20px"
                mr='5px'
                onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
              >
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt="20px" pb="16px">
                  <NextImage 
                    src={DoctorAvatar}
                    alt="프로필이미지"
                    style={{ borderRadius: '50%', objectFit: 'cover' }} 
                    width={60} 
                    height={60}
                  />
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'26px'} pb="16px">
                  <CustomTextBold700 fontSize={'17px'} color={nameTextColor} lineHeight={"150%"} noOfLines={1}>
                    {element?.name}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'26px'} pb="16px">
                  <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                    {element?.hospital}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pb="32px" height={'26px'}>
                  <CustomTextBold700 fontSize={'12px'} color={partTextColor} lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                    {element?.deptname}
                  </CustomTextBold700>
                </Box>
              </Flex>
            ))
          }
          {
            doctorList?.length > 4 && (
              <Flex 
                flexDirection="column" 
                bg={navbarBgColor} 
                minWidth="100px" 
                height={"100%"}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Box
                  display={'flex'}  width="40px" height={"40px"} cursor={'pointer'} justifyContent='center' alignItems={'center'} 
                  borderRadius={'20px'} 
                  flexDirection={'column'}
                  backgroundColor={navbarBgColor}
                  onClick={()=> onSendDoctorListButton()}
                  border={'1px solid #efefef'}
                  mb="5px"
                >
                <Icon as={MdOutlineArrowForward} width="25px" height="25px" color={navbarIcon} />
              </Box>
              <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color={navbarIcon} lineHeight={"150%"}>전체 보기</CustomTextBold400>
            </Flex>
            )
          }
        </Flex>
        <Box pr={1} justifyContent={'flex-end'} display={doctorList?.length == 0 ? 'none' : 'flex'}>
          <Box 
            display="flex" justifyContent={'center'} alignItems={'center'} bg={"#DFF5ED"} borderRadius={"4px"} height={"32px"} px="20px" cursor={'pointer'}
            onClick={() => onSendDoctorListButton()} 
          >
            <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"} >
            {doctorList[0]?.deptname} 전체보기
            </CustomTextBold400>
            <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
          </Box>
        </Box>
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
                      <Text color={'white'} noOfLines={1}>{doctorList[0]?.deptname}</Text>
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
                    originDoctorData={doctorList}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
      </Stack>
    )
  }
};
  
export default SearchDoctor;