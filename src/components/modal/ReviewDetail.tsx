'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Icon,SkeletonCircle,SkeletonText,useToast,Textarea, useColorModeValue } from '@chakra-ui/react';
import NextImage from 'next/legacy/image';
import Slider from '@/components/text/Slider';
import functions from '@/utils/functions';
import Image from 'next/image';
import mConstants from '@/utils/constants';
import * as DoctorService from "@/services/doctor/index";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconVote1,IconVote2,IconVote3,IconVote4 } from '@/components/icons/svgIcons';
import ImageEntire from "@/assets/images/img-entire.png";
import { BiDetail,BiInfoCircle,BiGroup,BiEdit,BiChevronRight } from "react-icons/bi";
import CustomAlert from '@/components/alert/CustomAlert';
import Alert from '@/components/alert/Alert';
import * as mCookie from "@/utils/cookies";
import BadWords from "@/utils/badword"
import  {TempReivewStore } from '@/store/historyStore';
import { iconAlertModify,iconAlertReview } from "@/components/icons/IconImage"
import ProcessingBar from "@/assets/icons/processing2x.gif";
export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleRegistReview : (num:any) => void;
  reviewData : any;
  selected_doctor : any;
}

function ReviewModal(props: ReviewModalProps) {
  const { isOpen, setClose, onHandleRegistReview, reviewData,selected_doctor } = props;
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const [isOpenAlert, setOpenAlert] = React.useState(false); 
  const [isOpenAlert2, setOpenAlert2] = React.useState(false);  

  const { tempReviewData } = TempReivewStore(state => state);
  const setTempReviewData = TempReivewStore((state) => state.setTempReviewData);
  const removeTempReviewData = TempReivewStore((state) => state.removeTempReviewData);

  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor2 = useColorModeValue('black', 'white');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
  const contentBgColor = useColorModeValue('#fafbfd','navy.800')
  const contentBgColor2 = useColorModeValue('white','navy.800');
  const titleColor = useColorModeValue('#17191D','white');
  const subTitleColor = useColorModeValue('#7F879B','white')
  const iconColor = useColorModeValue('#AFB5C3','white');
  const textColor = useColorModeValue('#212127', "white")

  const [inputs, setInputs] = React.useState<any>({
    doctor_id: null,
    content: null,
    kindness_score : 0,
    satisfaction_score : 0,
    explaination_score : 0,
    recommand_score : 0,
  });

  React.useEffect(() => {
    if( !functions.isEmpty(reviewData?.doctor_id) ){ // 기존거 불러오는거 
      //getReviewData(reviewData?.doctor_id)
      setInputs({
        ...reviewData,
        doctor_id: reviewData?.doctor_id,
        content: reviewData?.content,
        kindness_score: reviewData?.kindness_score,
        satisfaction_score: reviewData?.satisfaction_score,
        explaination_score: reviewData?.explaination_score,
        recommand_score: reviewData?.recommand_score,
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 60);
    }else{ ////없으면 신규 
      setNewReviewForm()
    }
  }, [isOpen,reviewData]);

  const setNewReviewForm = async() => {
    const reviewForDoctor = tempReviewData.find(item => item.doctor_id === selected_doctor?.doctor_id);
    if( !functions.isEmpty(reviewForDoctor) ){
      setOpenAlert2(true)
    }else{
      setInputs({
        ...inputs,
        doctor_id : selected_doctor?.doctor_id
      })
      
      setTimeout(() => {
        setIsLoading(false);
      }, 60);
    } 
  }

  const onRemoveTempData = async() => {
    removeTempReviewData(selected_doctor?.doctor_id)
    setOpenAlert2(false)
    setIsLoading(false);
  }

  const onCallTempData = async() => {
    const reviewForDoctor = await tempReviewData.find(item => item.doctor_id === selected_doctor?.doctor_id);
    setInputs({
      ...inputs,
      doctor_id : reviewForDoctor?.doctor_id,
      content: reviewForDoctor?.content,
      kindness_score: reviewForDoctor?.kindness_score,
      satisfaction_score: reviewForDoctor?.satisfaction_score,
      explaination_score: reviewForDoctor?.explaination_score,
      recommand_score: reviewForDoctor?.recommand_score,
    })
    setTimeout(() => {
      setOpenAlert2(false)
      setIsLoading(false);
    }, 60);
  }

  React.useEffect(() => {
    if( 
      !functions.isEmpty(inputs?.doctor_id) && functions.isEmpty(reviewData?.review_id)  
      && 
      (
        !functions.isEmpty(inputs?.content) || inputs?.kindness_score > 0 || inputs?.satisfaction_score > 0 || inputs?.explaination_score > 0 || inputs?.recommand_score > 0
      )
    ){
      setTempReviewData(inputs)
    }
  }, [inputs]);

  const getReviewData = async(did:any) => {
    const res:any = await DoctorService.getReviewData(did);
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
        status: 'error',
        containerStyle: {
          color: '#ffffff',
        },
        isClosable: true,
      });
      setTimeout(() => {
        onHandleRegistReview(did);
        setIsLoading(false);
      }, 60);
    }
  }

  /* isRegist if true 등록 else 수정 */
  const onHandleReviewRegist = async(data:any, isRegist:boolean = true) => {
    const swear_words_arr = BadWords;
    const swearRegex = new RegExp(swear_words_arr.join("|"), "gi");
    try{
      const filteredContent = data.content.replace(
        swearRegex,
        (match:any) => "*".repeat(match.length)
      ); 
      const reInputData = {
        ...inputs,
        content : filteredContent
      }
      if ( !functions.isEmpty(data?.doctor_id) ) {
        setReceiving(true)
       
        const res:any = await DoctorService.setReviewData(reInputData,isRegist);
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          removeTempReviewData(reInputData?.doctor_id)
          setOpenAlert(true)
          setReceiving(false);
        }else{
          toast({
            title: isRegist ? "등록중 오류가 발생하였습니다." : "수정중 오류가 발생하였습니다.",
            position: 'top-right',
            status: 'error',
            containerStyle: {
              color: '#ffffff',
            },
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

  const onHandleAlertConfirm = (doctorId:any) => {
    onHandleRegistReview(doctorId)
  }

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        {
          isOpenAlert2 && (
            <Alert 
              AppName='AIGA'
              bodyContent='기존에 작성중인 리뷰데이터가 있습니다. 불러오시겠습니까?'
              isOpen={isOpenAlert2}
              onClose={() => onRemoveTempData()}
              onConfirm={() => onCallTempData()}
              closeText='취소(삭제)'
              confirmText='불러오기'
            />
          )
        }
      </Box>
    )
  }else{

    return (
      <>
        {
          isReceiving && (
            <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
              <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} />
              </Box>
            </Flex>
          )
        }
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          <Flex  justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5}>
            <Box flex={3} pr={'20px'}> 
              <CustomTextBold700 fontSize={'24px'} color={textColor2}>
                솔직한 리뷰를
              </CustomTextBold700>
              <CustomTextBold700 fontSize={'24px'} color={textColor2}>
                남겨주세요
              </CustomTextBold700>
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
        
        <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5} padding="20px" bg={contentBgColor} borderRadius={'10px'}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}  width={'100%'} minHeight={'80px'} mb={5}>
            <Flex width={'100%'}>
              <Box display='flex' width={'48px'} height={'48px'} borderRadius={'8px'} bg='#e9edf3' justifyContent={'center'} alignItems={'center'}>
                <IconVote1 boxSize={'32px'} />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <CustomTextBold700 fontSize={'17px'} color='#0AA464' lineHeight={"150%"}>친절 • 배려</CustomTextBold700>
                <CustomText fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>진료시 친절하게 해 주셨나요?</CustomText>
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
                <IconVote2 boxSize={'32px'} />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <CustomTextBold700 fontSize={'17px'}  color='#0AA464' lineHeight={"150%"}>치료 결과 만족도</CustomTextBold700>
                <CustomText fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>진료 후 결과가 좋거나 개선되었나요?</CustomText>
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
                <IconVote3 boxSize={'32px'} />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <CustomTextBold700 fontSize={'17px'} color='#0AA464' lineHeight={"150%"}>쉬운 설명</CustomTextBold700>
                <CustomText fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>증상과 치료에 대해 상세히 설명하였나요?</CustomText>
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
                <IconVote4 boxSize={'32px'} />
              </Box>
              <Box flex={5} display={'flex'} flexDirection={'column'} justifyContent={'center'} pl="20px">
                <CustomTextBold700 fontSize={'17px'}  color='#0AA464' lineHeight={"150%"}>추천 여부</CustomTextBold700>
                <CustomText fontSize={'15px'} color='#7f879b' lineHeight={"150%"}>지인에게 추천하시겠어요?</CustomText>
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
        <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5} padding="20px" bg={contentBgColor} borderRadius={'10px'}>
          <Box>
            <CustomTextBold700 fontSize={'17px'} color={titleColor}>진료 후기를 작성해 주세요</CustomTextBold700>
          </Box>
          <Box display={'flex'} flexDirection={'row'} my={3}>
            <Box mr={1} display={'flex'} justifyContent={'center'} pt={'2px'}>
              <Icon as={BiInfoCircle} width="16px" height="16px" color={iconColor} />
            </Box>
            <Box mr={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <CustomTextBold400 fontSize={'13px'} color={subTitleColor}>
                허위 또는 과장된 내용은 법적으로 문제가 될 수 있습니다. 정확하고 사실에 근거한 리뷰를 작성해 주시기 바랍니다.
            </CustomTextBold400>
            </Box>
          </Box>
          <Box>
            <Textarea 
              variant={'outline'} 
              value={inputs.content ?? ''} 
              onChange={(e) => setInputs({...inputs, content: e.target.value})} 
              resize={'none'}  
              minH={'150px'}
              //size={'sm'} 
              fontSize={"17px"}
              bg={contentBgColor2}
              borderRadius={"10px"}
              //isInvalid={!functions.isEmpty(inputs.content)}
              placeholder='리뷰는 최소 50자 이상이어야 합니다. 욕설, 비방, 무의미한 반복적인 글귀는 삭제될 수 있습니다.'
              id={"textarea_content"}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={5}>
          {
            functions.isEmpty(inputs.review_id) ?
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
        </Flex>
        <Box height={'50px'} />
        
        {
          isOpenAlert && (
            <CustomAlert 
              isShowAppname={false}
              AppName='AIGA'
              bodyContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px" width="100%" maxW="480px" mx="auto" >
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                    <NextImage
                      width="106"
                      height="90"
                      src={functions.isEmpty(inputs.review_id) ? iconAlertReview :  iconAlertModify}
                      alt={'doctor1'}
                    />
                  </Box>
                  <Box width={"100%"}  display={functions.isEmpty(inputs.review_id) ? 'flex' : 'none'} justifyContent={'center'} alignItems={'center'} minHeight={"50px"}>
                    <CustomTextBold700 fontSize={'18px'} color={textColor}>소중한 리뷰 감사합니다!</CustomTextBold700>
                  </Box>
                  <Box width={"100%"}  display={functions.isEmpty(inputs.review_id) ? 'flex' : 'none'} justifyContent={'center'} alignItems={'center'} minHeight={"60px"}>
                    <CustomText fontSize={'17px'} color={textColor}>작성해주신 리뷰는 다른 분들에게 큰 도움이 되며 더 나은 서비스를 제공하는 데 활용됩니다.</CustomText>
                  </Box>
                  <Box width={"100%"}  display={!functions.isEmpty(inputs.review_id) ? 'flex' : 'none'} justifyContent={'center'} alignItems={'center'} minHeight={"60px"}>
                    <CustomText fontSize={'17px'} color={textColor}>리뷰 수정이 완료되었습니다.</CustomText>
                  </Box>
                </Flex>
              }
              isOpen={isOpenAlert}
              onClose={() => setOpenAlert(false)}
              onConfirm={() => onHandleAlertConfirm(reviewData?.doctor_i)}
              closeText='취소'
              confirmText='확인'
              footerContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px" width={"100%"}>
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#2B8FFF" borderRadius={'6px'} onClick={() => onHandleAlertConfirm(reviewData?.doctor_i)} cursor={'pointer'}>
                    <CustomTextBold700 fontSize={'16px'} color="#ffffff">확인</CustomTextBold700>
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

export default ReviewModal;