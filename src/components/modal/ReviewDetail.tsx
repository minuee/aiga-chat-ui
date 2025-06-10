'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Icon,Textarea, useColorModeValue } from '@chakra-ui/react';
import { MdDiversity1,MdOutlineStarPurple500 } from 'react-icons/md';
import Slider from '@/components/text/Slider';
import functions from '@/utils/functions';
import Image from 'next/image';
import ImageEntire from "@/assets/images/img-entire.png";
import IconVote1 from "@/assets/icons/vote_1.png";
import IconVote2 from "@/assets/icons/vote_2.png";
import IconVote3 from "@/assets/icons/vote_3.png";
import IconVote4 from "@/assets/icons/vote_4.png";

export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleRegistReview : (data:any) => void;
  reviewData : any;
}

function ReviewModal(props: ReviewModalProps) {
  const { isOpen, setClose, onHandleRegistReview, reviewData } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor2 = useColorModeValue('black', 'white');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
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
          <Flex  justifyContent={'center'} minHeight={'50px'} width={'98%'} mt={5}>
            <Box flex={3} pr={'20px'}> 
              <Text fontSize={'24px'} color={textColor2} fontWeight={'bold'}>
                솔직한 리뷰를 남겨주세요
              </Text>
            </Box>
            <Box flex={1} minWidth={"104px"}> 
              <Image 
                src={ImageEntire}
                alt="ImageEntire"
                style={{width:'104px',objectFit: 'contain',maxWidth:"104px"}}
              />
            </Box>
          </Flex>
        </Flex>
        
        <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5} padding="20px" bg='#fafbfd' borderRadius={'10px'}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}  width={'100%'} minHeight={'80px'} mb={5}>
            <Flex width={'100%'}>
              <Box display='flex' width={'48px'} height={'48px'} borderRadius={'8px'} bg='#e9edf3' justifyContent={'center'} alignItems={'center'}>
                <Image 
                  src={IconVote1}
                  alt="IconVote1"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <Text fontSize={'17px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>친절 • 배려</Text>
                <Text fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>진료시 친절하게 해 주셨나요?</Text>
              </Box>
            </Flex>
            <Box width={'100%'} my="5px" padding="10px">
              <Slider
                data={inputs.ratingKind} 
                setInputs={(value) => setInputs({...inputs, ratingKind: value})} 
              />
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}  width={'100%'} minHeight={'80px'} mb={5}>
            <Flex width={'100%'}>
              <Box display='flex' width={'48px'} height={'48px'} borderRadius={'8px'} bg='#e9edf3' justifyContent={'center'} alignItems={'center'}>
                <Image 
                  src={IconVote2}
                  alt="IconVote2"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <Text fontSize={'17px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>치료 결과 만족도</Text>
                <Text fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>진료 후 결과가 좋거나 개선되었나요?</Text>
              </Box>
            </Flex>
            <Box width={'100%'} my="5px" padding="10px">
              <Slider
                data={inputs.ratingTreatment} 
                setInputs={(value) => setInputs({...inputs, ratingTreatment: value})} 
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}  width={'100%'} minHeight={'80px'} mb={5}>
            <Flex width={'100%'}>
              <Box display='flex' width={'48px'} height={'48px'} borderRadius={'8px'} bg='#e9edf3' justifyContent={'center'} alignItems={'center'}>
                <Image 
                  src={IconVote3}
                  alt="IconVote3"
                  style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
                />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <Text fontSize={'17px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>쉬운 설명</Text>
                <Text fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>증상과 치료에 대해 상세히 설명하였나요?</Text>
              </Box>
            </Flex>
            <Box width={'100%'} my="5px" padding="10px">
              <Slider
                data={inputs.ratingDialog} 
                setInputs={(value) => setInputs({...inputs, ratingDialog: value})} 
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}  width={'100%'} minHeight={'80px'} mb={5}>
            <Flex width={'100%'}>
              <Box display='flex' width={'48px'} height={'48px'} borderRadius={'8px'} bg='#e9edf3' justifyContent={'center'} alignItems={'center'}>
                <Image 
                  src={IconVote4}
                  alt="IconVote4"
                  style={{width:'30px',objectFit: 'contain',maxWidth:"30px"}}
                />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <Text fontSize={'17px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"}>추천 여부</Text>
                <Text fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>지인에게 추천하시겠어요?</Text>
              </Box>
            </Flex>
            <Box width={'100%'} my="5px" padding="10px">
              <Slider
                data={inputs.ratingRecommend} 
                setInputs={(value) => setInputs({...inputs, ratingRecommend: value})} 
              />
            </Box>
          </Box>
        </Flex>
        <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5} padding="20px" bg='#fafbfd' borderRadius={'10px'}>
          <Box>
            <Text fontSize={'17px'} fontWeight={'bold'} >진료 후기를 작성해 주세요</Text>
          </Box>
          <Box my={3}>
            <Text fontSize={'13px'} color={'gray.500'}>
                허위 또는 과장된 내용은 법적으로 문제가 될 수 있습니다. 정확하고 사실에 근거한 리뷰를 작성해 주시기 바랍니다.
            </Text>
          </Box>
          
          <Box mt={2}>
            <Textarea 
              variant={'outline'} 
              value={inputs.doctorReview} 
              onChange={(e) => setInputs({...inputs, comment: e.target.value})} 
              resize={'none'}  
              isRequired
              minH={'150px'}
              size={'sm'} 
              bg='white'
              borderRadius={"10px"}
              isInvalid={!functions.isEmpty(inputs.comment)}
              placeholder='리뷰는 최소 50자 이상이어야 합니다. 욕설, 비방, 무의미한 반복적인 글귀는 삭제될 수 있습니다.'
              id={"textarea_content"}
            />
          </Box>
        </Flex>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={5}>
          {
            functions.isEmpty(inputs.doctorId) ?
            <Button 
              colorScheme='blue' 
              bgColor={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ?  "#ccc" : buttonBgColor}
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleRegistReview(inputs)}
              isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ? true : false}
              id="button_regist"
            >
              저장하기
            </Button>
            :
            <Button 
              colorScheme='blue' 
              bgColor={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ?  "#ccc" : buttonBgColor}
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleRegistReview(inputs)}
              isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ? true : false}
              id="button_modify"
            >
              수정
            </Button>
          }
        </Box>

        <Box height={'100px'} />
      </>
    )
  }
}

export default ReviewModal;