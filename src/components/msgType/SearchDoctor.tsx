import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import Image from 'next/image';
import { Box,Flex,Stack,useColorModeValue,Text,useColorMode,Icon,Modal,ModalOverlay,ModalContent,ModalHeader,SimpleGrid,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import { BiChevronRight } from "react-icons/bi";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import DoctorAvatar from "@/assets/images/doctor_default_white.png";
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
import { ModalDoctorListStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorDetailStore } from '@/store/modalStore';
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
import DoctorList from "@/components/modal/DoctorList";
import { MdOutlineArrowForward } from 'react-icons/md';
import TypeAnimation  from'@/components/text/TypeAnimation2';
type SearchDoctorProps = {
    data : any;
    summary : any;
    isHistory : boolean;
    onSendButton: (data: any,id:number) => void; 
    isLiveChat? : boolean,
    setIsTypingDone: () => void;
};

const SearchDoctor = ({  onSendButton , data,isHistory,summary,isLiveChat,setIsTypingDone }: SearchDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const { colorMode, toggleColorMode } = useColorMode();
  const flexRef = useRef<HTMLDivElement>(null);
  const [selectChatId, setSelectselectChatId] = useState(0);
  const [showGradient, setShowGradient] = useState(true);
  const [doctorList, setDoctorList] = useState<any>([]);
  const isDark = useColorModeValue(false, true);
  const [isLocalTypeDone, setLocalTypeDone] = useState(true)
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
  const { isOpenDocListModal,chatId,doctorAllList } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);

  const previousOutputRef = useRef<string | null>(null);

  useEffect(() => {
    //console.log("dddddd SearchDoctor",data, isHistory ,summary,isLiveChat)
    if ( !functions.isEmpty(summary)) previousOutputRef.current =  summary; 
    else previousOutputRef.current = null
  }, [summary]);

  const isOutputSame = previousOutputRef.current === summary && previousOutputRef.current !== null;
  /* useEffect(() => {
    console.log("dddddd SearchDoctor isOutputSame",isLiveChat , isOutputSame)
  }, [isOutputSame]); */
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
    setSelectselectChatId(!functions.isEmpty(data?.chat_id) ? data?.chat_id : !functions.isEmpty(data?.id) ? data?.id : 0)
    if ( !functions.isEmpty( data?.answer?.doctors )) {
      setDoctorList(data?.answer?.doctors)
      //setDoctorList(data?.answer?.doctors.slice(0, 2))
    }
  }, [data]);

  useEffect(() => {
    if ( ( isLiveChat && !functions.isEmpty(summary)  )  ) {
      setLocalTypeDone(false)
    }else{
      setLocalTypeDone(true)
    }
  }, [summary]);

  const setTypingCompleteDone = () => {
    setTimeout(() => {
      setLocalTypeDone(true)
      setIsTypingDone()
    }, 100);
  }

  const onSendDoctorListButton = async( id:any) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_1}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`)   
    setIsOpenReview(false);
    setIsOpenRequestModal(false);
    setIsOpenDoctorDetailModal(false);
    setOpenDoctorListModal(true,id,doctorList);
  }

  const fn_close_modal_doctor_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenDoctorListModal(false,0,[]);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','') 
    }, 200);
  }


  
  if ( doctorList?.length == 0 && functions.isEmpty(summary)) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px">
        <Box>
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
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
  }else if ( doctorList?.length == 0  && !functions.isEmpty(summary) && summary?.length > 10) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
        <Box my="5px">
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
        </Box>
        <Box 
          display={summary?.length > 10 ? 'flex' : 'none'}
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
          <div
            style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
          />
        </Box>
      </Flex>
    )
  }else {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px">
        <Box my="5px">
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
        </Box>
        <Box 
          display={summary?.length > 10 ? 'flex' : 'none'}
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
          mb="8px"
        > 
          <Box>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone )
            ?
            <TypeAnimation
              msg={ summary.replace(/^"(.*)"$/, '$1')}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            ( !isLiveChat && !functions.isEmpty(summary) && summary?.length > 10 )
            ?
            <div
              style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
            />
            :
            ( !functions.isEmpty(summary) )
            ?
            <div
              style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
            />
            :
            <div
              style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
            />
          }
          </Box>
        </Box>
        <Stack
          minWidth={'100%'} width={'auto'} minHeight={"60px"} position={'relative'}
          sx={{
            '&::after': {
              content: ( showGradient && doctorList?.length > 4 ) ? '""' : 'none', position: 'absolute', top:0,right: 0,width: '200px',height: '100%',maxHeight : "250px",
              background:  isDark ? 'linear-gradient(to right, rgba(26, 54, 93, 0) 0%, rgba(26, 54, 93, 1) 100%)' : 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
              pointerEvents: 'none', // 클릭 이벤트 방지
            },
          }}
        >
          <Box  
            display={isLocalTypeDone ? 'flex' : 'none'}
            alignItems={"center"} justifyContent={'flex-start'} minWidth={'100%'} width={'auto'} minHeight={"60px"} maxHeight={"250px"} ref={flexRef} 
            overflowX={{ base : 'auto', sm : doctorList.length > 2 ? 'auto' : 'hidden'}}
          >
            {
              doctorList.slice(0, 9).map((element: any, index: number) => (
                <Flex 
                  key={index} 
                  bg={profileBgColor} 
                  //width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                  //minWidth={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                  width={ doctorList?.length === 1 ? "100%" : doctorList?.length === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }
                  minWidth={{ base : "150px" , sm2 : doctorList?.length === 1 ? "100%" : doctorList?.length === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }}
                  padding="20px"
                  borderRadius="8px"
                  alignItems={'center'}
                  onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
                  flexDirection={{base : doctorList?.length === 1 ? 'row' : "column" , 'sm2' : doctorList?.length > 2 ? 'column' : 'row'}}
                  mr={index !== doctorList.length - 1 ? "8px" : "0px"}
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
                  <Flex flex={4} flexDirection={'column'} justifyContent={'center'} px="20px" mt={doctorList?.length > 1 ? "10px" : 0}>
                    <Box display={'flex'}  justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'} height={'26px'}>
                      <CustomTextBold700 fontSize={'17px'} color={nameTextColor} lineHeight={"150%"} noOfLines={1}>
                        {element?.name}
                      </CustomTextBold700>
                    </Box>
                    <Box display={'flex'}  justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'} height={'26px'}>
                      <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                        {element?.hospital}
                      </CustomTextBold700>
                    </Box>
                    <Box display={'flex'} justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'}  height={'26px'}>
                      <CustomTextBold700 fontSize={'12px'} color={partTextColor} lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                        {element?.deptname}
                      </CustomTextBold700>
                    </Box>
                  </Flex>
                  <Box
                    flex={1} display={doctorList?.length > 1 ? 'none' : 'flex'} alignItems={'center'} justifyContent={'flex-end'}
                    onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
                  >
                    <Icon as={BiChevronRight} width="20px" height="20px" color={arrowColor} />
                  </Box>
                </Flex>
              ))
            }
            {
              doctorList?.length > 3 && (
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
                    onClick={()=> onSendDoctorListButton(selectChatId)}
                    border={'1px solid #efefef'}
                    mb="5px"
                  >
                  <Icon as={MdOutlineArrowForward} width="25px" height="25px" color={navbarIcon} />
                </Box>
                <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color={navbarIcon} lineHeight={"150%"}>전체 보기</CustomTextBold400>
              </Flex>
              )
            }
          </Box>
        </Stack>
        <Box justifyContent={'flex-end'} display={doctorList?.length < 4 ? 'none' :  isLocalTypeDone ? 'flex' : 'none'} mt={'10px'}>
          <Box 
            display="flex" justifyContent={'center'} alignItems={'center'} bg={"#DFF5ED"} borderRadius={"4px"} height={"32px"}  padding="0 8px 0 20px" cursor={'pointer'}
            onClick={() => onSendDoctorListButton(selectChatId)} 
          >
            <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"} >
            {doctorList[0]?.deptname} 전체 보기
            </CustomTextBold400>
            <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
          </Box>
        </Box>
        {
          (isOpenDocListModal && chatId ==  selectChatId) && (
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
                      <CustomText color={'white'} noOfLines={1}>{doctorList[0]?.deptname ?? "의사 소개"}</CustomText>
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
  }
};
  
export default SearchDoctor;