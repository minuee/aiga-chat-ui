'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import { MdDiversity1 } from 'react-icons/md';
import Slider from '@/components/text/Slider';
import functions from '@/utils/functions';


export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleRegistReview : (data:any) => void;
  reviewData : any;
}
const limintView = 3
function ReviewModal(props: ReviewModalProps) {
  const { isOpen, setClose, onHandleRegistReview, reviewData } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const skeletonColor = useColorModeValue('white', 'gray.700');

  const [expandedCount, setExpandedCount] = React.useState<any>(limintView);
  const [inputs, setInputs] = React.useState<any>({
    doctorId: '',
    comment: null,
    ratingKind : 0,
    ratingTreatment : 0,
    ratingDialog : 0,
    ratingRecommend : 0,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if( !functions.isEmpty(reviewData?.doctorId) ){
      setInputs({
        doctorId: reviewData?.doctorId,
        comment: reviewData?.comment,
        ratingKind: reviewData?.ratingKind,
        ratingTreatment: reviewData?.ratingTreatment,
        ratingDialog: reviewData?.ratingDialog,
        ratingRecommend: reviewData?.ratingRecommend,
      });
    }
  }, [isOpen]);

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
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'} fontSize={'14px'}>
            <Text fontSize={'1.5em'}>솔직한 리뷰를 남겨주세요</Text>
          </Box>
        </Flex>
     
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} minHeight={'80px'} mb={5}>
            <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Icon as={MdDiversity1} color={'green.600'} fontSize={'30px'} />
            </Box>
            <Box flex={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
              <Text fontSize={'14px'} fontWeight={'bold'}>친절•배려</Text>
              <Text fontSize={'13px'} >진료시 친절하게 해 주셨나요?</Text>
              <Slider
                data={inputs.ratingKind} 
                setInputs={(value) => setInputs({...inputs, ratingKind: value})} 
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} minHeight={'80px'} mb={5}>
            <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Icon as={MdDiversity1} color={'green.600'} fontSize={'30px'} />
            </Box>
            <Box flex={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
              <Text fontSize={'14px'} fontWeight={'bold'}>치료 결과 만족도</Text>
              <Text fontSize={'13px'} >진료 후 결과가 좋거나 개선되었나요?</Text>
              <Slider
                data={inputs.ratingTreatment} 
                setInputs={(value) => setInputs({...inputs, ratingTreatment: value})} 
              />
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} minHeight={'80px'} mb={5}>
            <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Icon as={MdDiversity1} color={'green.600'} fontSize={'30px'} />
            </Box>
            <Box flex={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
              <Text fontSize={'14px'} fontWeight={'bold'}>쉽고 명쾌한 설명</Text>
              <Text fontSize={'13px'} >증상과 치료에 대해 상세히 설명하였나요?</Text>
              <Slider
                data={inputs.ratingDialog} 
                setInputs={(value) => setInputs({...inputs, ratingDialog: value})} 
              />
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} minHeight={'80px'} mb={5}>
            <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Icon as={MdDiversity1} color={'green.600'} fontSize={'30px'} />
            </Box>
            <Box flex={4} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
              <Text fontSize={'14px'} fontWeight={'bold'}>추천 여부</Text>
              <Text fontSize={'13px'} >지인에게 추천하시겠습니까?</Text>
              <Slider
                data={inputs.ratingRecommend} 
                setInputs={(value) => setInputs({...inputs, ratingRecommend: value})} 
              />
            </Box>
          </Box>
          
          <Divider orientation='horizontal' my={2}/>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'14px'} fontWeight={'bold'}>진료는 어떠셨나요?</Text>
            <Text fontSize={'12px'} color={'gray.500'}>
                허위 또는 과장된 내용은 법적으로 문제가 될 수 있습니다. 정확하고 사실에 근거한 리뷰를 작성해 주시기 바랍니다.
            </Text>
            <Box mt={2}>
              <Textarea 
                variant={'outline'} 
                value={inputs.doctorReview} 
                onChange={(e) => setInputs({...inputs, comment: e.target.value})} 
                resize={'none'}  
                isRequired
                minH={'150px'}
                size={'sm'} 
                isInvalid={!functions.isEmpty(inputs.comment)}
                placeholder='리뷰는 최소 50자 이상이어야 합니다. 욕설, 비방, 무의미한 반복적인 글귀는 삭제될 수 있습니다.'
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            {
              functions.isEmpty(inputs.doctorId) ?
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'99%'} 
                borderRadius={'10px'}
                onClick={() => onHandleRegistReview(inputs)}
                isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ? true : false}
              >
                등록
              </Button>
              :
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'99%'} 
                borderRadius={'10px'}
                onClick={() => onHandleRegistReview(inputs)}
                isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ? true : false}
              >
                수정
              </Button>
            }
          </Box>
        </Flex>
        <Box height={'100px'} />
      </>
    )
  }
}


export default ReviewModal;
