'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,SkeletonCircle,SkeletonText,Textarea,useColorModeValue } from '@chakra-ui/react';
import functions from '@/utils/functions';
import Alert from '@/components/alert/Alert';
import NextImage from 'next/legacy/image';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import ProcessingBar from "@/assets/icons/processing2x.gif";

export interface RequestModalProps extends PropsWithChildren {
  isReceiving : boolean;
  isOpen : boolean;
  setClose : () => void;
  onHandleRequest : (data:any) => void;
}

function RequestModal(props: RequestModalProps) {

  const { isOpen, setClose, onHandleRequest ,isReceiving} = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);
  const [inputs, setInputs] = React.useState<any>({
    title:null,
    content: null,
    isAgree : false,
  });
  const bgColor = useColorModeValue('blue', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('blue', 'yellow');
  const textColor2 = useColorModeValue('gray.500', 'white');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 60)
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
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}> 
          {
            isReceiving && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%' display={'flex'} justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex={100}>
                <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                 <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} />
                </Box>
              </Flex>
            )
          }
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'}>
            <CustomText fontSize={'17px'} color={textColor2}>
                서비스 이용 중 궁금하신  점이나 개선 의견을 보내주세요
            </CustomText>
            {/* <Box my={2}>
              <FormControl variant="floatingLabel">
                <Input 
                  type="text" 
                  placeholder='제목을 입력해주세요(필수)' 
                  onChange={(e) => setInputs({...inputs, title: e.target.value})}
                  id="input_title"
                  sx={{borderRadius:5}}
                />
              </FormControl>
            </Box> */}
            <Box my={2}>
              <Textarea 
                variant={'outline'} 
                value={inputs.doctorReview} 
                onChange={(e) => setInputs({...inputs, content: e.target.value})} 
                resize={'none'}  
                isRequired
                minH={'150px'}
                size={'17px'} 
                padding={"10px"}
                isInvalid={!functions.isEmpty(inputs.content)}
                placeholder='문의 내용을 자세하게 남겨주시면 빠른 답변에 도움이 됩니다.(최소 10자이상)'
                id={"textarea_content"}
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={2} mb={5}>
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'100%'} 
                borderRadius={'10px'}
                onClick={() => setIsOpenLogoutModal(true)}
                isDisabled={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 10)) ? true : false}
                id="buttin_send"
              >
                제출하기
              </Button>
            </Box>
            <CustomTextBold700 fontSize={'14px'}>안내 사항</CustomTextBold700>
            <CustomText fontSize={'12px'} color={textColor2}>
            • 산업안전보건법에 따라 고객 응대 근로자 보호조치를 하고 있으며, 모든 문의는 기록으로 남습니다.
            </CustomText>
          </Box>
          {/* <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5}>
            <CustomTextBold700 fontSize={'14px'}>개인정보 수집•이용에 대한 안내</CustomTextBold700>
            <Box display={'flex'} flexDirection={'row'} alignContent={'center'} minHeight={'50px'} width={'100%'}>
              <Checkbox
                colorScheme='blue'
                isChecked={inputs.isAgree}
                onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
              >
                (필수) 개인정보 수집•이용에 동의합니다.
              </Checkbox>
            </Box>
            <Box display={'flex'} flexDirection={'column'} alignContent={'center'} minHeight={'50px'} width={'100%'}>
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        수집항목
                      </Heading>
                      <CustomText pt='2' fontSize='sm'>
                        답변 받을 이메일주소
                      </CustomText>
                    </Box>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        수집목적
                      </Heading>
                      <CustomText pt='2' fontSize='sm'>
                        문의요청불편사항 확인 및 처리 결과 회신
                      </CustomText>
                    </Box>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        보유기간
                      </Heading>
                      <CustomText pt='2' fontSize='sm'>
                       3년간 보관 후 지체없이 파기
                      </CustomText>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </Box>
            <Box display={'flex'} flexDirection={'column'} alignContent={'center'} minHeight={'50px'} width={'100%'} mt={2}>
              <CustomText fontSize={'12px'} color={textColor2}>
                위 동의를 거부할 권리가 있으며, 동의를 거부하실 경우 문의처리 및 결과 회신이 제한됩니다. 요구하지 않은 개인정보는 입력하지 않도록 주의해 주세요
              </CustomText>
              <CustomText fontSize={'12px'} color={textColor2} >
                더 자세한 내용에 대해서는 <Link fontWeight="500" fontSize={'12px'} color={textColor} href="/ko/policy" target='_blank' ><CustomText as={'span'} color={textColor} fontSize={'12px'}>AIGA 개인정보처리방침</CustomText></Link>을 참고하시기 바랍니다.
              </CustomText>
            </Box>
          </Box> */}
          
        </Flex>
        <Box height={'50px'} />
        {
          isOpenLogoutModal && (
            <Alert 
              AppName='AIGA'
              bodyContent='제출 하시겠습니까?'
              isOpen={isOpenLogoutModal}
              onClose={(bool) => setIsOpenLogoutModal(false)}
              onConfirm={() => {onHandleRequest(inputs);setIsOpenLogoutModal(false)}}
              closeText='취소'
              confirmText='확인'
            />
          )
        }
      </>
    )
  }
}


export default RequestModal;
