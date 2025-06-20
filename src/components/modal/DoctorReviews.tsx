'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { 
  Box,Flex,Button,useColorModeValue,Text,SkeletonCircle,SkeletonText,Divider,Icon,Popover,PopoverTrigger,PopoverContent,useToast,PopoverArrow,
  PopoverBody,SimpleGrid,Stack
 } from '@chakra-ui/react';

 import * as DoctorService from "@/services/doctor/index";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import Image from 'next/image';
import { MdInfoOutline } from 'react-icons/md';
import ProgressBar from '@/components/fields/ProgressBar';
import NewRating from "@/components/icons/newStar"
import functions from '@/utils/functions';
import { IconVote1,IconVote2,IconVote3,IconVote4 } from '@/components/icons/svgIcons';
//import IconVote1 from "@/assets/icons/vote_1.png";
//import IconVote2 from "@/assets/icons/vote_2.png";
//import IconVote3 from "@/assets/icons/vote_3.png";
//import IconVote4 from "@/assets/icons/vote_4.png";

import mConstants from '@/utils/constants';
import ReviewItem from "@/components/text/ReviewItem";
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import { ModalDoctorReviewStore,ModalDoctorRequestStore,DoctorFromListStore } from '@/store/modalStore';

export interface DoctorModalProps extends PropsWithChildren {
  doctorID : any;
}

function DoctorReview( props: DoctorModalProps ) {

  const { doctorID } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviewListData, setReviewListData] = React.useState<any>(null);
  const [reviewData, setReviewData] = React.useState<any>(null);

  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const skeletonColor = useColorModeValue('white', 'navy.700');


  React.useEffect(() => {
    getDoctorReviewListData(doctorID);
  }, [doctorID]);
 
  const getDoctorReviewListData = async(doctorID:any) => {
    const res:any = await DoctorService.getReviewListData(doctorID);
    console.log("onHandleRegistReview res",res)
    if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
      const rData = res?.data?.review;
      setReviewListData(rData);
      setIsLoading(false);
    }else{
      toast({
        title: "조회중 오류가 발생하였습니다.",
        position: 'top-right',
        status: 'error',
        containerStyle: {
          color: '#ffffff',
        },
        isClosable: true,
      });
      setTimeout(() => {
        setReviewListData([]);
        setIsLoading(false);
      }, 1000);
    }
  }

  const onHandleRemoveReivew = async(data:any) => {
    const res:any = await DoctorService.removeReviewData(data?.review_id);
    console.log("onHandleRegistReview res",res)
    if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
      toast({
        title: 'AIGA',
        position: 'top-right',
        description: '정상적으로 삭제되었습니다.',
        status: 'success',
        containerStyle: {
          color: '#ffffff',
        },
        duration: 1500,
        isClosable: true,
      });
      setTimeout(() => {
        getDoctorReviewListData(doctorID)
      }, 500);
    }else{
      toast({
        title: 'AIGA',
        position: 'top-right',
        description: '삭제중 에러가 발생하였습니다 잠시후 다시이용해주십시요',
        status: 'error',
        containerStyle: {
          color: '#ffffff',
        },
        duration: 1500,
        isClosable: true,
      });
    }
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
        <Flex display={'flex'} flexDirection={'column'} bg="#FAFBFD" minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <CustomTextBold700 fontSize={"17px"} color={'#0AA464'}>AI 소셜리뷰</CustomTextBold700>
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
                <IconVote1 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>친절 • 배려</CustomText>
                <CustomTextBold700 fontSize={'15px'} color='#212127' lineHeight={"150%"} >4.5</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote2 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>치료 만족</CustomText>
                <CustomTextBold700 fontSize={'15px'} color='#212127' lineHeight={"150%"}>4.5</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote3 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>쉬운 설명</CustomText>
                <CustomTextBold700 fontSize={'15px'} color='#212127' lineHeight={"150%"}>4.5</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote4 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color='#5C5E69' lineHeight={"150%"}>추천 의향</CustomText>
                <CustomTextBold700 fontSize={'15px'} color='#212127' lineHeight={"150%"}>4.5</CustomTextBold700>
              </Box>
            </Box>
          </SimpleGrid>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'} bg={{base : "#FAFBFD", sm:'#FAFBFD'}}  minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <CustomText fontWeight={'bold'} color={'green.600'}>AIGA 리뷰</CustomText>
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
          <Flex flexDirection={{base : 'column', sm2 : "row"}} justifyContent={{base : 'space-evenly', sm2:'center'}} alignItems={{base : 'center', sm2:'center'}} minHeight={'100px'} width={'100%'}>
            <Box flex={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} height={'100%'} width={{base : '100%', sm2:'auto'}} mb={{base : 4, sm2 : 0}}>
              <Flex flex={1}>
                <CustomTextBold700 fontSize={'40px'} color={'#000000'} >4.5</CustomTextBold700>
              </Flex>
              <Flex flex={1} >
                <NewRating 
                  rating={4.5}
                />
              </Flex>
            </Box>
            <Box flex={2} display={'flex'} flexDirection={'column'}  alignItems={'center'} justifyContent={'flex-end'} width={{base : '100%', sm2:'auto'}}>
              <Box display={'flex'} flexDirection={'row'}  alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={'#5C5E69'}>친절•배려</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color='#1D73DC'>4.0</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={'#5C5E69'}>치료 만족</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color='#1D73DC'>4.0</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={'#5C5E69'}>쉬운 설명</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color='#1D73DC'>4.0</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={'#5C5E69'}>추천 의향</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color='#1D73DC'>1.0</CustomText>
                </Box>
              </Box>
            </Box>
          </Flex>
          <Stack spacing='2'>
            {reviewListData.map((item:any, index:number) => (
              <ReviewItem
                key={item?.review_id}
                data={item}
                onHandleDetail={(data:any) => onSendDoctorReviewButton(data)}
                onHandleDoctorRequestRegist={(data:any) => onHandleRemoveReivew(data)}
              />
            ))}
          </Stack>
        </Flex>
      </>
    )
  }
}

export default DoctorReview;