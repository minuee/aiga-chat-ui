'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { 
  Box,Flex,Button,useColorModeValue,Text,SkeletonCircle,SkeletonText,Divider,Card,CardHeader,CardBody,Heading,Icon,Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverArrow,
  PopoverBody,SimpleGrid,Textarea,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,Portal
 } from '@chakra-ui/react';

import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import Image from 'next/image';
import { MdInfoOutline,MdOutlineClose,MdArrowBack,MdComputer } from 'react-icons/md';
import { BiPhone } from "react-icons/bi";
import ProgressBar from '@/components/fields/ProgressBar';
import ListItem from '@/components/text/ListItem';
import UsePreventRefresh from "@/hooks/usePreventRefresh";
import { Rating } from 'react-simple-star-rating';
import NewRating from "@/components/icons/newStar"
import functions from '@/utils/functions';

import DoctorAvatar from "@/assets/images/thumb_dr_basic.png";
import IconInfo from "@/assets/icons/ico-document.png";
import IconVote1 from "@/assets/icons/vote_1.png";
import IconVote2 from "@/assets/icons/vote_2.png";
import IconVote3 from "@/assets/icons/vote_3.png";
import IconVote4 from "@/assets/icons/vote_4.png";

import mConstants from '@/utils/constants';
import ReviewDetail from '@/components/modal/ReviewDetail';
import RequestDoctor from '@/components/modal/RequestDoctor';

import ReviewItem from "@/components/text/ReviewItem";
import CustomText, { CustomBoldText } from "@/components/text/CustomText";
import { ModalDoctorReviewStore,ModalDoctorRequestStore,DoctorFromListStore } from '@/store/modalStore';

export interface DoctorModalProps extends PropsWithChildren {
  data : any;
}

const limintView = 3;
function DoctorModal(props: DoctorModalProps) {

  const { data } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [isLoading, setIsLoading] = React.useState(true);
  //const [isOpenReview, setIsOpenReview] = React.useState(false);
  const [reviewData, setReviewData] = React.useState<any>(null);
  const formBtnRef = React.useRef<HTMLButtonElement>(null);
  const { isOpenReview } = ModalDoctorReviewStore(state => state);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const { isOpenRequestModal } = ModalDoctorRequestStore(state => state);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const starColor = useColorModeValue('gold', '#ffffff');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');

  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, [data]);

  const onHandleRegistReview = () => {
    console.log("onHandleRegistReview")
    fn_close_modal_doctor_review();
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
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
      }, 200);
    }else{
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
      }, 200);
    }
  }

  const onSendDoctorRequestButton = async( gubun = "") => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_4}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_4}`)   
    setIsOpenRequestModal(true);
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
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'} mt="20px">
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} fontSize={'15px'} pr='15px'>
            <CustomBoldText fontSize={'15px'} color="#0AA464" >병원명</CustomBoldText>
            <CustomBoldText fontSize={'24px'} color="#000000" lineHeight={"200%"}>
              의사명 교수
            </CustomBoldText>
            <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
              <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">진료분야 1</CustomText>
              </Box>
              <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">진료분야 2</CustomText>
              </Box>
              <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">진료분야 3</CustomText>
              </Box>
              <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                <CustomText fontSize={'13px'} color="#5C5E69">진료분야 4</CustomText>
              </Box>
            </Flex>
          </Box>
          <Box display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} pl='15px' minWidth={'90px'}>
            <Image src={DoctorAvatar} alt="doctor" width={90} height={90} />
          </Box>
        </Flex>
        <Flex flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} minHeight={'100px'}>
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} mr={1}
            bg='#DFF2FF' borderRadius={'8px'}
            height={"50px"}
            onClick={() => window.open('https://www.snubh.org/member/login.do?prevURI=/reserve/onlineReserve.do')}
            cursor={'pointer'}
          >
            <Icon as={MdComputer} color={'#2B8FFF'} size="4em" />
            <Text fontSize={'15px'} fontWeight={'bold'} color="#2B8FFF" ml="2">온라인 예약</Text>
          </Box>
          { ( isMobileOnly || process.env.NODE_ENV === 'development' ) && (
          <Box 
            display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} ml={1} 
            bg='#DFF2FF' borderRadius={'8px'} height={"50px"}
            onClick={() => window.open('tel:01062880183')}
            cursor={'pointer'}
          >
            <Icon as={BiPhone} color={'#2B8FFF'} />
            <Text fontSize={'15px'} fontWeight={'bold'} color="#2B8FFF" ml="2"> 전화 예약</Text>
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
             <Text fontSize={'15px'} fontWeight={'bold'} color="#0AA464" ml="2">info</Text>
          </Box>
          <Divider orientation='horizontal' my={5} width="100%" />
          <ListItem
            title="경력(4)"
            content={["경력경력경력경력경력____1", "경력경력경력경력경력____2", "경력경력경력경력경력____3", "경력경력경력경력경력____4"]}
            limintView={limintView}
            marginTop={0}
          />
          <Divider orientation='horizontal' my={2} width="100%" />
          <ListItem
            title="학력(2)"
            content={["학력학력학력학력학력학력____1", "학력학력학력학력학력학력____2"]}
            limintView={limintView}
            marginTop={2}
          />
          <Divider orientation='horizontal' my={2} width="100%" />
          <ListItem
            title="논문(8)"
            content={["논문논문논문논문논문논문____1", "논문논문논문논문논문논문____2", "논문논문논문논문논문논문____3", "논문논문논문논문논문____4", "논문____5", "논문____6", "논문____7", "논문____8"]}
            limintView={limintView}
            marginTop={2}
          />
          <Divider orientation='horizontal' my={4} width="100%" />
          <Flex display={'flex'} justifyContent={'flex-end'}  width="100%">
            <Box 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'}
              cursor={'pointer'} 
              bg="#E9EDF3"
              width='150px'
              height={'30px'}
              borderRadius={"4px"}
              onClick={() => onSendDoctorRequestButton()}
            >
              <Text color={'#7F879B'} fontSize={"13px"}>의사 정보 수정 요청</Text> 
            </Box>
          </Flex>
        </Flex>
        
        <Flex display={'flex'} flexDirection={'column'} bg="#FAFBFD" minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <Text fontSize={"17px"} fontWeight={'bold'} color={'#0AA464'}>AI 소셜리뷰</Text>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={'#7F879B'} size={"20px"} />
                </PopoverTrigger>
                <PopoverContent color='white' bg='#212127' borderColor='#212127'>
                  <PopoverArrow bg='#212127' />
                  <PopoverBody>
                  소셜 리뷰와 진료 리뷰를 AI감성 분석한 종합점수
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <SimpleGrid spacing={3} templateColumns={{base : 'repeat(2, 1fr)' , sm : 'repeat(4, 1fr)'}}>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <Image 
                  src={IconVote1}
                  alt="IconVote1"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <Text fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>친절 • 배려</Text>
                <Text fontSize={'15px'} color='#212127' lineHeight={"150%"} fontWeight={'bold'}>4.5</Text>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <Image 
                  src={IconVote2}
                  alt="IconVote2"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <Text fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>치료 만족</Text>
                <Text fontSize={'15px'} color='#212127' lineHeight={"150%"} fontWeight={'bold'}>4.5</Text>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <Image 
                  src={IconVote3}
                  alt="IconVote3"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <Text fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>쉬운 설명</Text>
                <Text fontSize={'15px'} color='#212127' lineHeight={"150%"} fontWeight={'bold'}>4.5</Text>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <Image 
                  src={IconVote4}
                  alt="IconVote4"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <Text fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>추천 의향</Text>
                <Text fontSize={'15px'} color='#212127' lineHeight={"150%"} fontWeight={'bold'}>4.5</Text>
              </Box>
            </Box>
          </SimpleGrid>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'} bg={{base : "#FAFBFD", sm:'#FAFBFD'}}  minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <Text fontWeight={'bold'} color={'green.600'}>AIGA 리뷰</Text>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={'#7F879B'} size={"20px"} />
                </PopoverTrigger>
                <PopoverContent color='white' bg='#212127' borderColor='#212127'>
                  <PopoverArrow bg='#212127' />
                  <PopoverBody>
                   유저가 직접 작성한 리뷰로 AI 종합평점에 반영됨
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <Flex 
            flexDirection={{base : 'column', sm2 : "row"}} 
            justifyContent={{base : 'space-evenly', sm2:'center'}} 
            alignItems={{base : 'center', sm2:'center'}} 
            minHeight={'100px'} 
            width={'100%'}
          >
            <Box 
              flex={1} 
              display={'flex'} 
              flexDirection={'column'} 
              alignItems={'center'} 
              justifyContent={'space-evenly'} 
              height={'100%'} 
              width={{base : '100%', sm2:'auto'}}
              mb={{base : 4, sm2 : 0}}
            >
              <Flex flex={1}>
                <Text fontSize={'40px'} color={'#000000'} fontWeight={'bold'}>4.5</Text>
              </Flex>
              <Flex flex={1} >
                {/* <Rating initialValue={4.5} readonly size={20} fillColor={starColor} SVGstyle={{ display: 'inline' }} /> */}
                <NewRating 
                  rating={4.5}
                />
              </Flex>
            </Box>
            <Box flex={2} display={'flex'} flexDirection={'column'}  alignItems={'center'} justifyContent={'flex-end'} width={{base : '100%', sm2:'auto'}}>
              <Box display={'flex'} flexDirection={'row'}  alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'} color={'#5C5E69'}>친절•배려</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'13px'} color='#1D73DC'>4.0</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'} color={'#5C5E69'}>치료 만족</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'13px'} color='#1D73DC'>4.0</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'} color={'#5C5E69'}>쉬운 설명</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'13px'} color='#1D73DC'>4.0</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'} color={'#5C5E69'}>추천 의향</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'13px'} color='#1D73DC'>1.0</Text>
                </Box>
              </Box>
            </Box>
          </Flex>
          
          <ReviewItem
            data={null}
            onHandleDetail={(data:any) => onSendDoctorReviewButton(data)}
          />
          <ReviewItem
            data={null}
            onHandleDetail={(data:any) => onSendDoctorReviewButton(data)}
          />
        </Flex>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={5}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            height={'56px'}
            width={'100%'} 
            borderRadius={'10px'}
            onClick={() => onSendDoctorReviewButton('')}
            id="button_review"
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
                {/* <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box flex={1} display={'flex'} alignItems={'center'} onClick={() => setIsOpenReview(false)} cursor={'pointer'}>
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                      <Text color={'white'}>리뷰 작성</Text>
                    </Box>
                    <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                    
                    </Box>
                  </Flex>
                </ModalHeader> */}
                <ModalHeader bg={navbarBg}>
                    <Flex flexDirection={'row'}>
                      <Box 
                        flex={1} 
                        display={{base :'flex', md:'none'}} 
                        alignItems={'center'} 
                        onClick={() => fn_close_modal_doctor_review()} 
                        cursor={'pointer'}
                      >
                        <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                      </Box>
                      <Box 
                        flex={3} 
                        display={{base :'none', md:'flex'}} 
                        alignItems={'center'} 
                      >
                        <Text color={'white'} noOfLines={1}>리뷰 작성</Text>
                      </Box>
                      <Box 
                        flex={3} 
                        display={{base :'flex', md:'none'}} 
                        alignItems={'center'} 
                        justifyContent={'flex-end'}
                      >
                        <Text color={'white'} noOfLines={1}>리뷰 작성</Text>
                      </Box>
                      <Box 
                        flex={1} 
                        display={{base :'none', md:'flex'}} 
                        justifyContent={'flex-end'}
                        alignItems={'center'} 
                        onClick={() => fn_close_modal_doctor_review()} 
                        cursor={'pointer'}
                      >
                        <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                      </Box>
                    </Flex>
                </ModalHeader>
               {/*  <ModalCloseButton /> */}
                <ModalBody overflowY="auto" maxH="100vh">
                  <ReviewDetail
                    isOpen={isOpenReview}
                    setClose={() => fn_close_modal_doctor_review()}
                    onHandleRegistReview={() => onHandleRegistReview()}
                    reviewData={reviewData}
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
                <ModalHeader>{"의사정보 수정 요청"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto" maxH="100vh">
                  <RequestDoctor
                    isOpen={isOpenRequestModal}
                    setClose={() => fn_close_modal_doctor_request()}
                    onHandleDoctorRequestRegist={(data:any) => onHandleRequestDoctor(data)}
                    doctor_id={1}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
            </Portal>
          )
        }
      </>
    )
  }
}


export default DoctorModal;
