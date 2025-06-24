'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { 
  Box,Flex,Button,useColorModeValue,Text,SkeletonCircle,SkeletonText,Divider,Icon,useToast,
  Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,Portal
} from '@chakra-ui/react';
import * as DoctorService from "@/services/doctor/index";
import NextImage from 'next/legacy/image';
import Alert from '@/components/alert/CustomAlert';
import UserStateStore from '@/store/userStore';import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import Image from 'next/image';
import { MdOutlineClose,MdArrowBack,MdComputer } from 'react-icons/md';
import { BiPhone } from "react-icons/bi";
import ListItem from '@/components/text/ListItem';
import DoctorReviews from '@/components/modal/DoctorReviews';
import UsePreventRefresh from "@/hooks/usePreventRefresh";
import functions from '@/utils/functions';

import DoctorAvatar from "@/assets/images/thumb_dr_basic.png";
import IconInfo from "@/assets/icons/ico-document.png";
import { iconAlertWarning } from "@/components/icons/IconImage"
import mConstants from '@/utils/constants';
import ReviewDetail from '@/components/modal/ReviewDetail';
import RequestDoctor from '@/components/modal/RequestDoctor';

import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { ModalDoctorReviewStore,ModalDoctorRequestStore,DoctorFromListStore,ModalSignupStoreStore } from '@/store/modalStore';

export interface DoctorModalProps extends PropsWithChildren {
  selected_doctor : any;
}

const limintView = 3;
function DoctorModal(props: DoctorModalProps) {

  const { selected_doctor } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [doctorBasicData, setDoctorBasicData] = React.useState<any>({
    doctor_id: 0,
    hospital: "",
    address: "",
    lat: 0,
    lon: 0,
    name: "",
    deptname: "",
    specialties: "",
    url: "",
    education: "",
    career: "",
    paper: [],
    photo: "",
    doctor_score: {
        paper_score: 0,
        patient_score: 0,
        public_score: 0,
        peer_score: 0
    },
    ai_score: "",
    review: []
  });
  const [selectedDoctorId, setSelectedDoctorId] = React.useState(selected_doctor);
  const [educationList, setEducationList] = React.useState([]);
  const [careerList, setCareerList] = React.useState([]);
  const [paperList, setPaperList] = React.useState([]);
  const [isOpenAlert, setOpenAlert] = React.useState(false);  
  
  const [reviewData, setReviewData] = React.useState<any>(null);
  const formBtnRef = React.useRef<HTMLButtonElement>(null);
  const { ...userBaseInfo } = UserStateStore(state => state);
  const { isOpenReview } = ModalDoctorReviewStore(state => state);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const { isOpenRequestModal } = ModalDoctorRequestStore(state => state);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const { isOpenLoginModal } = ModalSignupStoreStore(state => state);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal);
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const starColor = useColorModeValue('gold', '#ffffff');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');

  
  React.useEffect(() => {
    setDoctorBasicData({
      ...doctorBasicData,
      ...selected_doctor
    });
    if ( process.env.NODE_ENV == 'development') {
      //getDoctorBasicData()
    }
    setSelectedDoctorId(selected_doctor?.doctor_id);
    if ( !functions.isEmpty(selected_doctor?.education)) {
      setEducationList(JSON.parse(selected_doctor?.education))
    }
    if ( !functions.isEmpty(selected_doctor?.career)) {
      setCareerList(JSON.parse(selected_doctor?.career))
    }
    if ( !functions.isEmpty(selected_doctor?.paper)) {
      setPaperList(selected_doctor?.paper)
    }
  
    setTimeout(() => {
      setIsLoading(false);
    }, 60);
  }, [selected_doctor]);

  const onHandleRegistReview = (did:any) => {
    setSelectedDoctorId(null);
    setTimeout(() => {
      fn_close_modal_doctor_review();
      setSelectedDoctorId(props.selected_doctor?.doctor_id);
    }, 60);
   
  }

  const onHandleRequestDoctor = (data:any) => {
    fn_close_modal_doctor_request();
  }

  const getDoctorBasicData = async() => {
    const res:any = await DoctorService.getDoctorBasicData(1);
    if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
      const rData = res?.data?.doctor;
      setDoctorBasicData({...doctorBasicData,...rData});
      setIsLoading(false);
    }else{
      toast({
        title: "조회중 오류가 발생하였습니다.",
        position: 'top-right',
        isClosable: true,
        status: 'error',
        containerStyle: {
          color: '#ffffff',
        }
      });
      setTimeout(() => {
        setDoctorBasicData(null);
        setIsLoading(false);
      }, 1000);
    }
  }


  const fn_close_modal_doctor_review = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
    }, 200);
  }

  const onSendDoctorReviewButton = async( gubun = "") => {
    if ( !functions.isEmpty(gubun)) setReviewData({doctor_id : gubun})
    if ( isFromDoctorDepth2 ) {//true이면 list > detail
      history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_3_2}`);
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3_2}`)   
      setIsOpenReview(true);
    }else{ //fasle detail
      history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_3}`);
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_3}`)   
      setIsOpenReview(true);
    }
  }

  const fn_close_modal_doctor_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenRequestModal(false);
    if ( isFromDoctorDepth2 ) {//true이면 list > detail
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
      }, 200);
    }else{
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
      }, 200);
    }
  }

  const onSendDoctorRequestButton = async( gubun = "") => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    history.push(`${locale}#${mConstants.pathname_modal_4}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_4}`)   
    setIsOpenRequestModal(true);
  }

  const onHandleAlertConfirm = async( isBool : boolean) => {
    if ( userBaseInfo.isGuest &&  functions.isEmpty(userBaseInfo?.userId) ) {
      setOpenAlert(false)
      onSendDoctorReviewButton()
      return;
    }
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    history.push(`${locale}#${mConstants.pathname_modal_21_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21_2}`)
    setIsOpenSignupModal(true);
  }


  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{

    return (
      <>
        <UsePreventRefresh />
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} fontSize={'15px'} pr='15px'>
            <CustomTextBold700 fontSize={'15px'} color="#0AA464" >{doctorBasicData?.hospital}</CustomTextBold700>
            <CustomTextBold700 fontSize={'24px'} color="#000000" lineHeight={"200%"}>
              {!functions.isEmpty(doctorBasicData?.name) ? doctorBasicData?.name : ""} 교수
            </CustomTextBold700>
            <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
              <Box display={'flex'} padding="2px 4px" bg="#DFF5ED" borderRadius={"4px"} mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">{doctorBasicData?.deptname || ""}</CustomText>
              </Box>
              {
                !functions.isEmpty(doctorBasicData.specialties) && (
                  doctorBasicData.specialties.split(",").map((subItem:any, subIndex:number) => (
                    <Box display={'flex'} padding="2px 4px" bg="#EFF2F7" borderRadius={"4px"} mr="1" mt="1" key={subIndex}>
                      <CustomText fontSize={'13px'} color="#5C5E69">{subItem.toString()}</CustomText>
                    </Box>
                    )
                ))
              }
            </Flex>
          </Box>
          <Box display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} pl='15px' minWidth={'90px'}>
            <Image src={DoctorAvatar} alt="doctor" width={90} height={90} />
          </Box>
        </Flex>
        <Flex flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} minHeight={'100px'}>
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} mr={1}
            bg='#DFF2FF' 
            borderRadius={'8px'}
            height={"50px"}
            onClick={() => {
              !functions.isEmpty(doctorBasicData?.url) ? window.open(doctorBasicData?.url) : console.log("")
            }}
            cursor={'pointer'}
          >
            <Icon as={MdComputer} color={'#2B8FFF'} size="4em" />
            <CustomTextBold700 fontSize={'15px'}  color="#2B8FFF" ml="2">온라인 예약</CustomTextBold700>
          </Box>
          { ( isMobileOnly || process.env.NODE_ENV === 'development' ) && (
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} ml={1}  bg='#DFF2FF' borderRadius={'8px'} height={"50px"}
            onClick={() => !functions.isEmpty(doctorBasicData?.contact) ? window.open(`tel:${doctorBasicData?.telephone}`) : null} cursor={'pointer'}
          >
            <Icon as={BiPhone} color={'#2B8FFF'} />
            <CustomTextBold700 fontSize={'15px'}  color="#2B8FFF" ml="2"> 전화 예약</CustomTextBold700>
          </Box>
          )}
        </Flex>
        <Flex display={'flex'} flexDirection={'column'}  mt={4} bg="#FAFBFD" alignContent={'center'} padding="20px">
          <Box display={'flex'} flex={1}  alignItems={'center'}>
            <Image 
              src={IconInfo}
              alt="IconNotice"
              style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
            />
             <CustomTextBold700 fontSize={'15px'} color="#0AA464" ml="2">info</CustomTextBold700>
          </Box>
          <Divider orientation='horizontal' my={5} width="100%" />
          <ListItem
            title={`경력(${careerList?.length})`}
            content={careerList}
            limintView={limintView}
            marginTop={0}
            isType="career"
          />
          <Divider orientation='horizontal' my={2} width="100%" />
          <ListItem
            title={`학력(${educationList?.length})`}
            content={educationList}
            limintView={limintView}
            marginTop={2}
            isType="education"
          />
          <Divider orientation='horizontal' my={2} width="100%" />
          <ListItem
            title={`논문(${paperList?.length})`}
            content={paperList}
            limintView={limintView}
            marginTop={2}
            isType="paper"
          />
          <Divider orientation='horizontal' my={4} width="100%" />
          <Flex display={'flex'} justifyContent={'flex-end'}  width="100%">
            <Box 
              display={'flex'} alignItems={'center'} justifyContent={'center'}  bg="#E9EDF3" width='150px' height={'30px'} borderRadius={"4px"}
              onClick={() => onSendDoctorRequestButton()} cursor={'pointer'} 
            >
              <CustomText color={'#7F879B'} fontSize={"13px"}>의사 정보 수정 요청</CustomText> 
            </Box>
          </Flex>
        </Flex>
        
        <DoctorReviews 
          doctorID={selectedDoctorId}
        />
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={5}>
          <Button 
            colorScheme='blue' variant='solid' height={'56px'} width={'100%'} borderRadius={'10px'}
            onClick={() => onSendDoctorReviewButton('')} id="button_review"
          >
            리뷰쓰기
          </Button>
        </Box>
        <Box height={'50px'} />
        {
          isOpenReview && (
            <Portal>
            <Modal
              onClose={() => fn_close_modal_doctor_review()}
              finalFocusRef={formBtnRef}
              isOpen={isOpenReview}
              scrollBehavior={'inside'}
              //blockScrollOnMount={false}
              //preserveScrollBarGap={true}
              //trapFocus={false} 
              //allowPinchZoom={true}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_review()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>리뷰 작성</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_review()}  cursor={'pointer'}
                    >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                  <ReviewDetail
                    isOpen={isOpenReview}
                    setClose={() => fn_close_modal_doctor_review()}
                    onHandleRegistReview={(did:any) => onHandleRegistReview(did)}
                    reviewData={reviewData}
                    selected_doctor={doctorBasicData}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
            </Portal>
          )
        }
        {
          isOpenRequestModal && (   
            <Portal> 
              <Modal
                onClose={() => fn_close_modal_doctor_request()}
                finalFocusRef={reviewBtnRef}
                isOpen={isOpenRequestModal}
                scrollBehavior={'inside'}
                blockScrollOnMount={false}
                preserveScrollBarGap={true}
                trapFocus={false}
              >
                <ModalOverlay />
                <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                  <ModalHeader  padding="basePadding">{"의사정보 수정 요청"}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                    <RequestDoctor
                      isOpen={isOpenRequestModal}
                      setClose={() => fn_close_modal_doctor_request()}
                      onHandleDoctorRequestRegist={(data:any) => onHandleRequestDoctor(data)}
                      selected_doctor={doctorBasicData}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Portal>
          )
        }
        {
          isOpenAlert && (
            <Alert 
              isShowAppname={false}
              AppName='AIGA'
              bodyContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px">
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                    <NextImage width="106" height="90" src={iconAlertWarning} alt={'doctor1'}/>
                  </Box>
                  <Box width={"100%"}  display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minHeight={"50px"}>
                    <CustomTextBold700 fontSize={'18px'} color="#212127">리뷰를 작성하시려면 로그인이 필요합니다. 로그인 하시겠습니까?</CustomTextBold700>
                  </Box>
                </Flex>
              }
              isOpen={isOpenAlert}
              onClose={() => setOpenAlert(false)}
              onConfirm={() => onHandleAlertConfirm(false)}
              closeText='취소'
              confirmText='확인'
              footerContent={
                <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'} py="20px" width={"100%"}>
                  <Box width={"98px"} mr="5px" display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#2B8FFF" borderRadius={'6px'} onClick={() => onHandleAlertConfirm(false)} cursor={'pointer'}>
                    <CustomTextBold700 fontSize={'16px'} color="#ffffff">확인</CustomTextBold700>
                  </Box>
                  <Box width={"78px"} ml="5px" display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#DFE3EA" borderRadius={'6px'} onClick={() => setOpenAlert(false)} cursor={'pointer'}>
                    <CustomTextBold700 fontSize={'16px'} color="#000000">취소</CustomTextBold700>
                  </Box>
                </Flex>
              }
            />
          )
        }
      </>
    )
  }
}

export default DoctorModal;