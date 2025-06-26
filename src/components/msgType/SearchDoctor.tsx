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
  const navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const { isOpenDocListModal } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);

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


  return (
    <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
      <Box my="5px">
        <IconChatAiga width={'46px'} height={"12px"} />
      </Box>
      {/* <Flex 
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
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>증상에 맞는 의사를 추천해 드립니다.</CustomText>
        </Box>  
      </Flex> */}
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
          <Text fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>
          {doctorList[0]?.deptname} 전체보기 {">"}
          </Text>
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
};
  
export default SearchDoctor;