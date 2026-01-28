'use client';
import React, { useState, useEffect, PropsWithChildren } from 'react';
import { isMobileOnly } from "react-device-detect";
// chakra imports
import { Box,Flex,Button,useColorModeValue,useToast,SkeletonCircle,SkeletonText,Divider,Icon,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,Portal} from '@chakra-ui/react';

import NextImage from 'next/legacy/image';
import Alert from '@/components/alert/CustomAlert';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import * as history from '@/utils/history';
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

import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import { ModalDoctorReviewStore,ModalDoctorRequestStore,DoctorFromListStore,ModalSignupStoreStore,ReviewAlertStore } from '@/store/modalStore';

export interface DoctorModalProps extends PropsWithChildren {
  selected_doctor : any;
}

const limintView = 3;
function DoctorModal(props: DoctorModalProps) {
  const topOfModalRef = React.useRef<HTMLDivElement>(null);

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
  const [educationList, setEducationList] = React.useState<any[]>([]);
  const [careerList, setCareerList] = React.useState<any[]>([]);
  const [paperList, setPaperList] = React.useState<any[]>([]);

  const { isOpenAlert } = ReviewAlertStore(state => state);
  const setOpenAlert = ReviewAlertStore((state) => state.setIsOpenReviewLoginAlert);

  const [reviewData, setReviewData] = React.useState<any>(null);
  const formBtnRef = React.useRef<HTMLButtonElement>(null);
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);

  const { isOpenReview } = ModalDoctorReviewStore(state => state);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const { isOpenRequestModal } = ModalDoctorRequestStore(state => state);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const { isOpenLoginModal } = ModalSignupStoreStore(state => state);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal);
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const contentBgColor = useColorModeValue('#FAFBFD', 'navy.700');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const nameText = useColorModeValue('#000000','white');
  const btnColor = useColorModeValue('#E9EDF3','rgba(0,59,149,1)');
  const btnTextColor = useColorModeValue('#7F879B','white')

  const useVerbose = process.env.NEXT_PUBLIC_DOCTOR_IMAGE_VERBOSE === 'true';
  const useCache = useVerbose && process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_SERVER_VERBOSE === 'true';
  const photoUrl = (doctorBasicData?.photo && !functions.isEmpty(doctorBasicData.photo)) ? doctorBasicData.photo.trim() : null;

  const imageCacheServer = process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_SERVER || 'http://localhost:7001';
  const imageCacheWidth = parseInt(process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_WIDTH || '300', 10);
  const imageCacheHeight = parseInt(process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_HEIGHT || '300', 10);

  const photoSrc = useVerbose ? (photoUrl ? ( useCache  ? `${imageCacheServer}?url=${encodeURIComponent(photoUrl)}&w=${imageCacheWidth}&h=${imageCacheHeight}` : photoUrl) : DoctorAvatar.src) : DoctorAvatar.src;

  const [hasError, setHasError] = useState(false);

  // Reset error state when the photo source changes
  useEffect(() => {
    setHasError(false);
  }, [photoSrc]);

  const handleImageError = () => {
    setHasError(true);
  };

  React.useEffect(() => {
    topOfModalRef.current?.scrollIntoView({ behavior: 'auto' });
    setDoctorBasicData({
      ...doctorBasicData,
      ...selected_doctor
    });
    
    if ( process.env.NODE_ENV == 'development') {
      //getDoctorBasicData()
    }
    setSelectedDoctorId(selected_doctor?.doctor_id);
    
    // Safely parse education
    if ( !functions.isEmpty(selected_doctor?.education)) {
      const eduData = selected_doctor.education;
      if (typeof eduData === 'string' && eduData.trim().startsWith('[')) {
        try {
          const cleaned = functions.cleanJSON(eduData);
          setEducationList(JSON.parse(cleaned));
        } catch (e) {
          console.error("Doctor.tsx: Failed to parse education JSON:", e);
          setEducationList([]); // Default to empty list on error
        }
      } else if (Array.isArray(eduData)) {
        setEducationList(eduData);
      } else {
        setEducationList([]);
      }
    } else {
      setEducationList([]);
    }

    // Safely parse career
    if ( !functions.isEmpty(selected_doctor?.career)) {
      const careerData = selected_doctor.career;
      if (typeof careerData === 'string' && careerData.trim().startsWith('[')) {
        try {
          const cleaned = functions.cleanJSON(careerData);
          setCareerList(JSON.parse(cleaned));
        } catch (e) {
          console.error("Doctor.tsx: Failed to parse career JSON:", e);
          setCareerList([]); // Default to empty list on error
        }
      } else if (Array.isArray(careerData)) {
        setCareerList(careerData);
      } else {
        setCareerList([]);
      }
    } else {
      setCareerList([]);
    }

    if ( !functions.isEmpty(selected_doctor?.paper)) {
      setPaperList(selected_doctor?.paper)
    } else {
      setPaperList([]);
    }
    setIsLoading(false);
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

  const fn_close_modal_doctor_review = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenReview(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
    }, 200);
  }

  const openModifyReview = async(data:any) => {
    setReviewData(data) 
    if ( !functions.isEmpty(data)) {
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
  }

  const onSendDoctorReviewButton = async( gubun = "") => {

    if ( functions.isEmpty(userBaseInfo?.email) ) {
      setOpenAlert(true);
      return;
    }
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
  /*   if ( userBaseInfo.isGuest &&  functions.isEmpty(userBaseInfo?.userId) ) {
      setOpenAlert(false)
      onSendDoctorReviewButton()
      return;
    } */
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    history.push(`${locale}#${mConstants.pathname_modal_21_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21_2}`)
    setIsOpenSignupModal(true);
  }

  const handleCopy = async (textToCopy : string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "복사 완료!",
        position: 'top-right',
        description: `"${textToCopy}"가 클립보드에 복사되었습니다.`,
        status: 'info',
        containerStyle: {
          color: '#ffffff',
        },
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "복사 실패",
        position: 'top-right',
        description: "클립보드 복사 중 문제가 발생했어요.",
        status: "error",
        containerStyle: {
          color: '#ffffff',
        },
        duration: 2000,
        isClosable: true,
      });
    }
  };


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
        <Flex ref={topOfModalRef} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} fontSize={'15px'} pr='15px'>
            <CustomTextBold700 fontSize={'15px'} color="#0AA464" >{doctorBasicData?.hospital}</CustomTextBold700>
            <CustomTextBold700 fontSize={'24px'} color={nameText} lineHeight={"200%"}>
              {!functions.isEmpty(doctorBasicData?.name) ? doctorBasicData?.name : ""} 교수
            </CustomTextBold700>
            <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
              <Box display={'flex'} padding="2px 4px" bg="#DFF5ED" borderRadius={"4px"} mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">{doctorBasicData?.deptname || ""}</CustomText>
              </Box>
              {
                !functions.isEmpty(doctorBasicData.specialties) && (
                  doctorBasicData.specialties.split(",").map((subItem:any, subIndex:number) => (
                    <Box display={subItem?.length > 20 ? 'none' : 'flex'} padding="2px 4px" bg="#EFF2F7" borderRadius={"4px"} mr="1" mt="1" key={subIndex}>
                      <CustomText fontSize={'13px'} color="#5C5E69">{functions.cleanEscapeAsterrisk(subItem.toString())}</CustomText>
                    </Box>
                  )
                ))
              }
            </Flex>
            {
              ( (userBaseInfo?.email == 'minuee47@gmail.com'|| userBaseInfo?.email == 'lena47@naver.com' )  && !userBaseInfo?.isGuest ) && (
                <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
                  { !functions.isEmpty(doctorBasicData.specialties) && (
                    doctorBasicData.specialties.split(",").map((subItem:any, subIndex:number) => (
                      <Box display={'flex'} padding="2px 4px" bg="#EFF2F7" borderRadius={"4px"} mr="1" mt="1" key={subIndex}>
                        <CustomText fontSize={'13px'} color="#5C5E69">{subItem.toString()}</CustomText>
                      </Box>
                    )
                    ))
                  }
                </Flex>
              )
            }
          </Box>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'90px'}
            height={'90px'} // height 추가
            borderRadius={'50%'}
            overflow={'hidden'}
          >
            {useCache && photoUrl ? (
              <img
                key={selected_doctor?.doctor_id}
                src={photoSrc}
                alt="doctor"
                width={90}
                height={90}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DoctorAvatar.src;
                }}
              />
            ) : (
              <Image key={selected_doctor?.doctor_id} src={hasError ? DoctorAvatar.src : photoSrc} alt="doctor" width={90} height={90} onError={handleImageError}  style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            )}
          </Box>
        </Flex>
        <Flex flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} minHeight={'100px'}>
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} mr={1} bg='#DFF2FF' borderRadius={'8px'} height={"50px"} cursor={'pointer'}
            onClick={() => { !functions.isEmpty(doctorBasicData?.url) ? window.open(doctorBasicData?.url) : console.log("")}}
          >
            <Icon as={MdComputer} color={'#2B8FFF'} size="4em" />
            <CustomTextBold700 fontSize={'15px'}  color="#2B8FFF" ml="2">온라인 예약</CustomTextBold700>
          </Box>
          {
            isMobileOnly 
            ?
            functions.isEmpty(doctorBasicData?.telephone)
            ?
            null
            :
            <Box 
              display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} ml={1}  bg='#DFF2FF' borderRadius={'8px'} height={"50px"}
              onClick={() => window.open(`tel:${doctorBasicData?.telephone}`)} cursor={'pointer'}
            >
              <Icon as={BiPhone} color={'#2B8FFF'} />
              <CustomTextBold700 fontSize={'15px'}  color="#2B8FFF" ml="2"> 전화 예약</CustomTextBold700>
            </Box>
            :
            functions.isEmpty(doctorBasicData?.telephone)
            ?
            null
            :
            <Box 
              display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} ml={1}  bg='#E9EDF3' borderRadius={'8px'} height={"50px"}
              onClick={() => handleCopy(doctorBasicData?.telephone)} cursor={'pointer'}
            >
              <Icon as={BiPhone} color={'#7F879B'} />
              <CustomTextBold700 fontSize={'15px'}  color="#7F879B" ml="2">{doctorBasicData?.telephone}</CustomTextBold700>
            </Box>
          }

          {/* { (( isMobileOnly || process.env.NODE_ENV === 'development' ) && !functions.isEmpty(doctorBasicData?.telephone) ) && (
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} ml={1}  bg='#DFF2FF' borderRadius={'8px'} height={"50px"}
            onClick={() => !functions.isEmpty(doctorBasicData?.telephone) ? window.open(`tel:${doctorBasicData?.telephone}`) : null} cursor={'pointer'}
          >
            <Icon as={BiPhone} color={'#2B8FFF'} />
            <CustomTextBold700 fontSize={'15px'}  color="#2B8FFF" ml="2"> 전화 예약</CustomTextBold700>
          </Box>
          )} */}
        </Flex>
        <Flex display={'flex'} flexDirection={'column'}  mt={4} bg={contentBgColor} alignContent={'center'} padding="20px">
          <Box display={'flex'} flex={1}  alignItems={'center'}>
            <Image 
              src={IconInfo}
              alt="IconNotice"
              style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
            />
             <CustomTextBold700 fontSize={'15px'} color="#0AA464" ml="2">info</CustomTextBold700>
          </Box>
          <Divider orientation='horizontal' my={5} width="100%" color={"#E9EDF3"} />
          <ListItem
            title={`경력`}
            content={careerList}
            limintView={limintView}
            marginTop={0}
            isType="career"
          />
          <Divider orientation='horizontal' my={5} width="100%" color={"#E9EDF3"} />
          <ListItem
            title={`학력`}
            content={educationList}
            limintView={limintView}
            marginTop={2}
            isType="education"
          />
          <Divider orientation='horizontal' my={5} width="100%" color={"#E9EDF3"} />
          <ListItem
            title={`논문`}
            content={paperList}
            limintView={limintView}
            marginTop={2}
            isType="paper"
          />
          <Divider orientation='horizontal' my={5} width="100%" color={"#E9EDF3"} />
          <Flex display={'flex'} justifyContent={'flex-end'}  width="100%">
            <Box 
              display={'flex'} alignItems={'center'} justifyContent={'center'}  bg={btnColor} width='150px' height={'30px'} borderRadius={"4px"}
              onClick={() => onSendDoctorRequestButton()} cursor={'pointer'} 
            >
              <CustomText color={btnTextColor} fontSize={"13px"}>의사 정보 수정 요청</CustomText> 
            </Box>
          </Flex>
        </Flex>
        
        <DoctorReviews 
          doctorBasicData={doctorBasicData}
          doctorID={selectedDoctorId}
          openParentReviewData={(data:any) => openModifyReview(data)}
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
                      <CustomText color={'white'} noOfLines={1}>
                        {!functions.isEmpty(reviewData?.review_id) ? '리뷰 수정' : '리뷰 작성'}
                      </CustomText>
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