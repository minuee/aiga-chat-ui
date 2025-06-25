'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,useColorModeValue,Text,SkeletonCircle,SkeletonText,Divider,Icon,Popover,PopoverTrigger,PopoverContent,useToast,PopoverArrow,PopoverBody,SimpleGrid,Stack } from '@chakra-ui/react';

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
import { IconNotice } from '@/components/icons/svgIcons';
import mConstants from '@/utils/constants';
import ReviewItem from "@/components/text/ReviewItem";
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import { ModalDoctorReviewStore,ModalDoctorRequestStore,DoctorFromListStore } from '@/store/modalStore';

export interface DoctorModalProps extends PropsWithChildren {
  doctorID : any;
  doctorBasicData : any;
}

function DoctorReview( props: DoctorModalProps ) {

  const { doctorID,doctorBasicData } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviewListData, setReviewListData] = React.useState<any>(null);
  const [reviewData, setReviewData] = React.useState<any>(null);
  const [aigaReviewAverage, setAigaReviewAverage] = React.useState<any>({
    kindness_avg: 0,
    explaination_avg:  0,
    satisfaction_avg:  0,
    recommand_avg:  0,
    total_avg : 0
  });
  const [totalAigaReviewAverage, setTotalAigaReviewAverage] = React.useState<any>({
    kindness_avg: 0,
    explaination_avg:  0,
    satisfaction_avg:  0,
    recommand_avg:  0,
  });
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor2 = useColorModeValue('#7F879B', 'white');
  const bgColor = useColorModeValue("#FAFBFD",'navy.700');
  const iconColor = useColorModeValue('#7F879B','white');
  const tooltipColor = useColorModeValue('#212127','white');
  const tooltipCTextolor = useColorModeValue('#0AA464','navy.800');
  const voteTextColor = useColorModeValue('#5C5E69','white');
  const voteTextColor2 = useColorModeValue('#1D73DC','white');
  const votePointColor = useColorModeValue('#212127','white')

  React.useEffect(() => {
    if ( !functions.isEmpty(doctorID)) {
      getDoctorReviewListData(doctorID);
    }
  }, [doctorID]);

  const calSNSAverage = ( reviewAvg:any) => {

    if ( !functions.isEmpty(reviewAvg) && !functions.isEmpty(doctorBasicData?.ai_score)) {
      const kindness_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.kindness) ?  (reviewAvg?.kindness_avg + doctorBasicData?.ai_score?.kindness)/2 :  reviewAvg?.kindness_avg;
      const explaination_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.explaination) ?  (reviewAvg?.explaination_avg + doctorBasicData?.ai_score?.kindness)/2 :  reviewAvg?.explaination_avg;
      const satisfaction_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.satisfaction) ?  (reviewAvg?.satisfaction_avg + doctorBasicData?.ai_score?.satisfaction)/2 :  reviewAvg?.satisfaction_avg;
      const recommand_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.recommand) ?  (reviewAvg?.recommand_avg + doctorBasicData?.ai_score?.recommand)/2 :  reviewAvg?.recommand_avg;
      setTotalAigaReviewAverage({
        kindness_avg: kindness_avg_tmp,
        explaination_avg:  explaination_avg_tmp,
        satisfaction_avg:  satisfaction_avg_tmp,
        recommand_avg: recommand_avg_tmp
      })
    }else if ( !functions.isEmpty(reviewAvg) && functions.isEmpty(doctorBasicData?.ai_score)) {
      setTotalAigaReviewAverage({
        kindness_avg: reviewAvg?.kindness_avg,
        explaination_avg:  reviewAvg?.explaination_avg,
        satisfaction_avg:  reviewAvg?.satisfaction_avg,
        recommand_avg: reviewAvg?.recommand_avg
      })
    }else if ( functions.isEmpty(reviewAvg) && !functions.isEmpty(doctorBasicData?.ai_score)) {
      const kindness_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.kindness) ?  doctorBasicData?.ai_score?.kindness : 0;
      const explaination_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.explaination) ?  doctorBasicData?.ai_score?.kindness :  0;
      const satisfaction_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.satisfaction) ?  doctorBasicData?.ai_score?.satisfaction : 0;
      const recommand_avg_tmp = !functions.isEmpty(doctorBasicData?.ai_score?.recommand) ? doctorBasicData?.ai_score?.recommand : 0;
      
      setTotalAigaReviewAverage({
        kindness_avg: kindness_avg_tmp,
        explaination_avg:  explaination_avg_tmp,
        satisfaction_avg:  satisfaction_avg_tmp,
        recommand_avg: recommand_avg_tmp
      })
    }else{
      setTotalAigaReviewAverage({
        kindness_avg: 0,
        explaination_avg:  0,
        satisfaction_avg:  0,
        recommand_avg: 0
      })
    }
  }
 
  const getDoctorReviewListData = async(doctorID:any) => {
    const res:any = await DoctorService.getReviewListData(doctorID);
    if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
      const rData = res?.data?.review;
      setReviewListData(rData);
      const resultAvg = calculateAverageScores(rData);
      setAigaReviewAverage(resultAvg);
      calSNSAverage(resultAvg)
      setIsLoading(false);
    }else{
      setAigaReviewAverage(null);
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
      }, 60);
    }
  }

  const calculateAverageScores = (review: any) => {

    let totalKindness = 0;
    let totalExplaination = 0;
    let totalSatisfaction = 0;
    let totalRecommand = 0;
    let count = 0;
    try{
  
      for (const item of review) {
        // null인 경우는 제외하고 평균 계산
        if (
          item.kindness_score != null &&
          item.explaination_score != null &&
          item.satisfaction_score != null &&
          item.recommand_score != null
        ) {
          totalKindness += item.kindness_score;
          totalExplaination += item.explaination_score;
          totalSatisfaction += item.satisfaction_score;
          totalRecommand += item.recommand_score;
          count++;
        }
      }
    
      if (count === 0) {
        return null; // 데이터 없음
      }

      const totalAvg = (totalKindness / count + totalExplaination / count + totalSatisfaction / count + totalRecommand / count) / 4;
      return {
        kindness_avg: totalKindness / count,
        explaination_avg: totalExplaination / count,
        satisfaction_avg: totalSatisfaction / count,
        recommand_avg: totalRecommand / count,
        total_avg : totalAvg > 0 ? totalAvg.toFixed(1) : 0
      };
    }catch(e){
      return {
        kindness_avg: 0,
        explaination_avg: 0,
        satisfaction_avg: 0,
        recommand_avg: 0,
        total_avg : 0
      };
    }
    
  }

  const onHandleRemoveReivew = async(data:any) => {
    const res:any = await DoctorService.removeReviewData(data?.review_id);
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
      }, 60);
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
        <Flex display={'flex'} flexDirection={'column'} bg={bgColor} minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <CustomTextBold700 fontSize={"17px"} color={'#0AA464'}>AI 소셜리뷰</CustomTextBold700>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={iconColor} size={"20px"} />
                </PopoverTrigger>
                <PopoverContent color='white' bg={tooltipColor} borderColor={tooltipColor}>
                  <PopoverArrow bg={tooltipColor} />
                  <PopoverBody>
                  <CustomText fontSize={"15px"} color={tooltipCTextolor}>소셜 리뷰와 진료 리뷰를 AI감성 분석한 종합점수</CustomText>
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
                <CustomText fontSize={'13px'} color={voteTextColor} lineHeight={"150%"}>친절 • 배려</CustomText>
                <CustomTextBold700 fontSize={'15px'} color={votePointColor} lineHeight={"150%"} >{totalAigaReviewAverage?.kindness_avg?.toFixed(1)}</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote2 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color={voteTextColor} lineHeight={"150%"}>치료 만족</CustomText>
                <CustomTextBold700 fontSize={'15px'} color={votePointColor} lineHeight={"150%"}>{totalAigaReviewAverage?.explaination_avg?.toFixed(1)}</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote3 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color={voteTextColor} lineHeight={"150%"}>쉬운 설명</CustomText>
                <CustomTextBold700 fontSize={'15px'} color={votePointColor} lineHeight={"150%"}>{totalAigaReviewAverage?.satisfaction_avg?.toFixed(1)}</CustomTextBold700>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
              <Box display='flex' justifyContent={'center'} alignItems={'center'} py="10px" minH={"50px"}>
                <IconVote4 boxSize={'32px'} />
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} pb="10px">
                <CustomText fontSize={'13px'} color={voteTextColor} lineHeight={"150%"}>추천 의향</CustomText>
                <CustomTextBold700 fontSize={'15px'} color={votePointColor} lineHeight={"150%"}>{totalAigaReviewAverage?.recommand_avg?.toFixed(1)}</CustomTextBold700>
              </Box>
            </Box>
          </SimpleGrid>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'}  bg={bgColor}  minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} pt="10px">
            <CustomText fontWeight={'bold'} color={'green.600'}>AIGA 리뷰</CustomText>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={iconColor} size={"20px"} />
                </PopoverTrigger>
                <PopoverContent color='white' bg={tooltipColor} borderColor={tooltipColor}>
                  <PopoverArrow bg={tooltipColor} />
                  <PopoverBody>
                  <CustomText fontSize={"15px"} color={tooltipCTextolor}>유저가 직접 작성한 리뷰로 AI 종합평점에 반영됨</CustomText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <Box
          display={reviewListData?.length == 0  ? 'none' : 'flex'}
          flexDirection={{base : 'column', sm2 : "row"}} justifyContent={{base : 'space-evenly', sm2:'center'}} alignItems={{base : 'center', sm2:'center'}} minHeight={'100px'} width={'100%'}>
            <Box flex={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} height={'100%'} width={{base : '100%', sm2:'auto'}} mb={{base : 4, sm2 : 0}}>
              <Flex flex={1}>
                <CustomTextBold700 fontSize={'40px'} color={votePointColor}>
                  {aigaReviewAverage?.total_avg}
                </CustomTextBold700>
              </Flex>
              <Flex flex={1} >
                <NewRating 
                  rating= {aigaReviewAverage?.total_avg}
                />
              </Flex>
            </Box>
            <Box flex={2} display={'flex'} flexDirection={'column'}  alignItems={'center'} justifyContent={'flex-end'} width={{base : '100%', sm2:'auto'}}>
              <Box display={'flex'} flexDirection={'row'}  alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor}>친절•배려</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={(aigaReviewAverage?.kindness_avg*20)} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor2}>{aigaReviewAverage?.kindness_avg?.toFixed(1)}</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor}>치료 만족</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={(aigaReviewAverage?.explaination_avg*20)} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor2}>{aigaReviewAverage?.explaination_avg?.toFixed(1)}</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor}>쉬운 설명</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={(aigaReviewAverage?.satisfaction_avg*20)} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor2}>{aigaReviewAverage?.satisfaction_avg?.toFixed(1)}</CustomText>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor}>추천 의향</CustomText>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='8px' width={'100%'} value={(aigaReviewAverage?.recommand_avg*20)} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <CustomText fontSize={'13px'} color={voteTextColor2}>{aigaReviewAverage?.recommand_avg?.toFixed(1)}</CustomText>
                </Box>
              </Box>
            </Box>
          </Box>
          <Stack spacing='2'>
            {
            reviewListData?.length == 0 
            ?
            <Flex flexDirection={'column'} justifyContent={'center'} height={'200px'} width={'100%'} mt={5}>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'}> 
                  <IconNotice boxSize={'40px'}/>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'} mt="20px"> 
                  <CustomText fontSize={'17px'} color={textColor2}>
                    여러분의 소중한 리뷰를 기다리고 있습니다.
                  </CustomText>
                </Box>
              </Flex>
            :
            reviewListData.map((item:any, index:number) => (
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