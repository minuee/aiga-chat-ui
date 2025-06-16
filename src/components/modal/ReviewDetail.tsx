'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,useToast,Textarea, useColorModeValue } from '@chakra-ui/react';
import NextImage from 'next/legacy/image';
import Slider from '@/components/text/Slider';
import functions from '@/utils/functions';
import Image from 'next/image';
import mConstants from '@/utils/constants';
import * as DoctorService from "@/services/doctor/index";

import ImageEntire from "@/assets/images/img-entire.png";
import IconVote1 from "@/assets/icons/vote_1.png";
import IconVote2 from "@/assets/icons/vote_2.png";
import IconVote3 from "@/assets/icons/vote_3.png";
import IconVote4 from "@/assets/icons/vote_4.png";
import { loadingImage } from "@/components/icons/IconImage"

export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleRegistReview : () => void;
  reviewData : any;
}

function ReviewModal(props: ReviewModalProps) {
  const { isOpen, setClose, onHandleRegistReview, reviewData } = props;
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor2 = useColorModeValue('black', 'white');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
  const [inputs, setInputs] = React.useState<any>({
    doctor_id: 1,
    content: null,
    kindness_score : 0,
    satisfaction_score : 0,
    explaination_score : 0,
    recommand_score : 0,
  });

  React.useEffect(() => {
   

    if( !functions.isEmpty(reviewData?.doctor_id) ){
      getReviewData(reviewData?.doctor_id)
      /* setInputs({
        doctor_id: reviewData?.doctor_id,
        content: reviewData?.content,
        kindness_score: reviewData?.kindness_score,
        satisfaction_score: reviewData?.satisfaction_score,
        explaination_score: reviewData?.explaination_score,
        recommand_score: reviewData?.recommand_score,
      }); */
    }else{
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const getReviewData = async(did:any) => {
    const res:any = await DoctorService.getReviewData(did);
    console.log("onHandleRegistReview res",res)
    if ( !functions.isEmpty(res.data?.review?.review_id)) {
      const rData = res?.data?.review;
      setInputs({
        doctor_id: rData?.doctor_id,
        content: rData?.content,
        kindness_score: rData?.kindness_score,
        satisfaction_score: rData?.satisfaction_score,
        explaination_score: rData?.explaination_score,
        recommand_score: rData?.recommand_score,
        review_id : rData?.review_id
      });
      setIsLoading(false);
    }else{
      toast({
        title: "조회중 오류가 발생하였습니다.",
        position: 'top-right',
        status: 'info',
        isClosable: true,
      });
      setTimeout(() => {
        onHandleRegistReview();
        setIsLoading(false);
      }, 1000);
    }
  }

  /* isRegist if true 등록 else 수정 */
  const onHandleReviewRegist = async(data:any, isRegist:boolean = true) => {
    try{
      console.log("onHandleRegistReview",data)
      if ( !functions.isEmpty(data?.doctor_id) ) {
        setReceiving(true)
        const res:any = await DoctorService.setReviewData(data,isRegist);
        console.log("onHandleRegistReview res",res)
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          toast({
            title: isRegist ? "정상적으로 등록되었습니다." : "정상적으로 수정되었습니다.",
            position: 'top-right',
            status: 'info',
            isClosable: true,
          });
          setTimeout(() => {
            onHandleRegistReview();
            setReceiving(false);
          }, 1000);
        }else{
          toast({
            title: isRegist ? "등록중 오류가 발생하였습니다." : "수정중 오류가 발생하였습니다.",
            position: 'top-right',
            status: 'info',
            isClosable: true,
          });
          setReceiving(false);
        }       
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
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
      {
          isReceiving && (
            <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
              <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                <NextImage
                    width="100"
                    height="100"
                    src={loadingImage}
                    alt={'doctor1'}
                />
                <Text color="#ffffff">Data Processing!!!</Text>
              </Box>
            </Flex>
          )
        }
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
                data={inputs.kindness_score} 
                setInputs={(value) => setInputs({...inputs, kindness_score: value})} 
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
                data={inputs.satisfaction_score} 
                setInputs={(value) => setInputs({...inputs, satisfaction_score: value})} 
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
                data={inputs.explaination_score} 
                setInputs={(value) => setInputs({...inputs, explaination_score: value})} 
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
                data={inputs.recommand_score} 
                setInputs={(value) => setInputs({...inputs, recommand_score: value})} 
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
              value={inputs.content} 
              onChange={(e) => setInputs({...inputs, content: e.target.value})} 
              resize={'none'}  
              isRequired
              minH={'150px'}
              size={'sm'} 
              bg='white'
              borderRadius={"10px"}
              isInvalid={!functions.isEmpty(inputs.content)}
              placeholder='리뷰는 최소 50자 이상이어야 합니다. 욕설, 비방, 무의미한 반복적인 글귀는 삭제될 수 있습니다.'
              id={"textarea_content"}
            />
          </Box>
        </Flex>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={5}>
          {
            functions.isEmpty(inputs.doctor_id) ?
            <Button 
              colorScheme='blue' 
              bgColor={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 50)) ?  "#ccc" : buttonBgColor}
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleReviewRegist(inputs,true)}
              isDisabled={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 50)) ? true : false}
              id="button_regist"
            >
              저장하기
            </Button>
            :
            <Button 
              colorScheme='blue' 
              bgColor={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 50)) ?  "#ccc" : buttonBgColor}
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleReviewRegist(inputs,false)}
              isDisabled={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 50)) ? true : false}
              id="button_modify"
            >
              수정하기
            </Button>
          }
        </Box>

        <Box height={'100px'} />
      </>
    )
  }
}

export default ReviewModal;