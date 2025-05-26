'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Textarea,Checkbox,Card,useColorModeValue,CardBody,Stack,StackDivider,Heading} from '@chakra-ui/react';
import functions from '@/utils/functions';
import Link from '@/components/link/Link';

export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleEntire : (data:any) => void;
}

function ReviewModal(props: ReviewModalProps) {

  const { isOpen, setClose, onHandleEntire } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputs, setInputs] = React.useState<any>({
    comment: null,
    isAgree : false,
  });
  const bgColor = useColorModeValue('blue', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('blue', 'yellow');
  const textColor2 = useColorModeValue('gray.500', 'white');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
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
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={5}> 
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'12px'} color={textColor2}>
                서비스 이용 중 궁금하신  점이나 개선 의견을 보내주세요
            </Text>
            <Box my={2}>
              <Textarea 
                variant={'outline'} 
                value={inputs.doctorReview} 
                onChange={(e) => setInputs({...inputs, comment: e.target.value})} 
                resize={'none'}  
                isRequired
                minH={'150px'}
                size={'sm'} 
                isInvalid={!functions.isEmpty(inputs.comment)}
                placeholder='문의 내용을 자세하게 남겨주시면 빠른 답변에 도움이 됩니다.'
                id={"textarea_content"}
              />
            </Box>
            <Text fontSize={'14px'} fontWeight={'bold'}>
                안내 사항
            </Text>
            <Text fontSize={'12px'} color={textColor2}>
                산업안전보건법에 따라 고객 응대 근로자 보호조치를 하고 있으며, 모든 문의는 기록으로 남습니다.
            </Text>
          </Box>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'} mt={5}>
            <Text fontSize={'14px'} fontWeight={'bold'}>
                개인정보 수집•이용에 대한 안내
            </Text>
            <Box display={'flex'} flexDirection={'row'} alignContent={'center'} minHeight={'50px'} width={'98%'}>
              <Checkbox
                colorScheme='blue'
                isChecked={inputs.isAgree}
                onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
              >
                (필수) 개인정보 수집•이용에 동의합니다.
              </Checkbox>
            </Box>
            <Box display={'flex'} flexDirection={'column'} alignContent={'center'} minHeight={'50px'} width={'98%'}>
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        수집항목
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        답변 받을 이메일주소
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        수집목적
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        문의요청불편사항 확인 및 처리 결과 회신
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        보유기간
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                       3년간 보관 후 지체없이 파기
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </Box>
            <Box display={'flex'} flexDirection={'column'} alignContent={'center'} minHeight={'50px'} width={'98%'} mt={2}>
              <Text fontSize={'12px'} color={textColor2}>
                위 동의를 거부할 권리가 있으며, 동의를 거부하실 경우 문의처리 및 결과 회신이 제한됩니다. 요구하지 않은 개인정보는 입력하지 않도록 주의해 주세요
              </Text>
              <Text fontSize={'12px'} color={textColor2} >
                더 자세한 내용에 대해서는 <Link fontWeight="500" fontSize={'12px'} color={textColor} href="https://kormedi.com/%ea%b0%9c%ec%9d%b8%ec%a0%95%eb%b3%b4%ec%b2%98%eb%a6%ac%eb%b0%a9%ec%b9%a8-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/" target='_blank' ><Text as={'span'} color={textColor}>AIGA 개인정보처리방침</Text></Link>을 참고하시기 바랍니다.
              </Text>
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleEntire(inputs)}
              isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 50)) ? true : false}
              id="buttin_send"
            >
              제출하기
            </Button>
          </Box>
        </Flex>
        <Box height={'100px'} />
      </>
    )
  }
}


export default ReviewModal;
