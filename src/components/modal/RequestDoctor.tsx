'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack} from '@chakra-ui/react';
import functions from '@/utils/functions';


export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleRegistReview : (data:any) => void;
  doctorId : string;
}

function ReviewModal(props: ReviewModalProps) {
  const { isOpen, setClose, onHandleRegistReview, doctorId } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    doctorId: '',
    relation: null,
    req_name : null,
    req_phone : null,
    req_comment : null,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log('isMobile', isMobile);
    }, 1000);

    if( !functions.isEmpty(doctorId) ){
      setInputs({
        ...inputs,
        doctorId: doctorId
      });
    }
  }, [isOpen]);

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{

    return (
      <>
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'} fontSize={'14px'}>
            <Text fontSize={'1em'}>의사 프로필에 수정이 필요한 내용을 알려주세요</Text>
          </Box>
        </Flex>
       
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box>
            <FormControl variant="floatingLabel">
              <FormLabel>이름<span style={{color: 'red'}}>*</span></FormLabel>
              <Input 
                type="text" 
                placeholder='수정요청자 이름을 입력해주세요 (필수)' 
                onChange={(e) => setInputs({...inputs, req_name: e.target.value})}
              />
            </FormControl>
          </Box>              
          <Box mt={5}>
            <FormControl variant="floatingLabel">
              <FormLabel>연락처</FormLabel>
              <Input 
                type="text" 
                placeholder='연락받으실 연락처 또는 이메일을 입력해주세요 (선택)' 
                onChange={(e) => setInputs({...inputs, req_phone: e.target.value})}
              />
            </FormControl>
          </Box> 
          <Box mt={5}>
            <FormControl variant="floatingLabel">
              <FormLabel>관계<span style={{color: 'red'}}>*</span></FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row'>
                  <Radio colorScheme='red' value='1' onClick={() => setInputs({...inputs, relation: '1'})}>
                    본인
                  </Radio>
                  <Radio colorScheme='green' value='2' onClick={() => setInputs({...inputs, relation: '2'})}>
                    관계자
                  </Radio>
                  <Radio colorScheme='blue' value='3' onClick={() => setInputs({...inputs, relation: '3'})}>
                    기타
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>   
          <Divider orientation='horizontal' my={2}/>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'14px'} fontWeight={'bold'}>수정요청사항</Text>
            <Box mt={1}>
              <Textarea 
                variant={'outline'} 
                value={inputs.req_comment || ''} 
                onChange={(e) => setInputs({...inputs, req_comment: e.target.value})} 
                resize={'none'}  
                minH={'150px'}
                size={'sm'} 
                isInvalid={!functions.isEmpty(inputs.req_comment)}
                placeholder='수정요청 및 기타 문의사항을 입력해주세요 (필수, 최소 10자이상)'
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleRegistReview(inputs)}
              isDisabled={(functions.isEmpty(inputs.comment) || (inputs.comment && inputs.comment.length < 10)) ? true : false}
            >
              등록
            </Button>
          </Box>
        </Flex>
        <Box height={'100px'} />
      </>
    )
  }
}


export default ReviewModal;
