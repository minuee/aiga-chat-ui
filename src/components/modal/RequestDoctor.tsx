'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue } from '@chakra-ui/react';
import functions from '@/utils/functions';

export interface DoctorRequestModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleDoctorRequestRegist : (data:any) => void;
  doctorId : any;
}

function DoctorRequestModal(props: DoctorRequestModalProps) {
  const { isOpen, setClose, onHandleDoctorRequestRegist, doctorId } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const skeletonColor = useColorModeValue('white', 'gray.700');
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
            <Text fontSize={'13px'} color="#7F879B">의사 프로필에 수정이 필요한 내용을 알려주세요</Text>
          </Box>
        </Flex>
       
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={3}>
         {/*  <Box>
            <FormControl variant="floatingLabel">
              <FormLabel>이름<span style={{color: 'red'}}>*</span></FormLabel>
              <Input 
                type="text" 
                placeholder='수정요청자 이름을 입력해주세요 (필수)' 
                onChange={(e) => setInputs({...inputs, req_name: e.target.value})}
                id="input_reqName"
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
                id="input_contact_email"
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
          <Divider orientation='horizontal' my={2}/> */}
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'}>
            <Box mt={1}>
              <Textarea 
                variant={'outline'} 
                value={inputs.req_comment || ''} 
                onChange={(e) => setInputs({...inputs, req_comment: e.target.value})} 
                resize={'none'}  
                minH={'200px'}
                size={'sm'} 
                isInvalid={!functions.isEmpty(inputs.req_comment)}
                placeholder='수정요청 및 기타 문의사항을 입력해주세요 (필수, 최소 10자이상)'
                id={"textarea_content"}
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onHandleDoctorRequestRegist(inputs)}
              isDisabled={(functions.isEmpty(inputs.req_comment) || (inputs.req_comment && inputs.req_comment.length < 10)) ? true : false}
              id="button_regist"
            >
              제출하기
            </Button>
          </Box>
          <Flex display={'flex'} flexDirection={'column'} justifyContent={'center'}  minHeight={'20px'} mt={10}>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <Text fontSize={'15px'} color="#7F879B" fontWeight={'bold'}>안내 사항</Text>
            </Box>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <Text fontSize={'15px'} color="#7F879B" >• 산업안전보건법에 따라 고객 응대 근로자 보호조치를 시행하고 있으며 모든 문의는 기록으로 남습니다.</Text>
            </Box>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <Text fontSize={'15px'} color="#7F879B" >• 본 요청은 비회원도 개인정보 제공 없이 제출하실 수 있으므로 이름, 연락처, 주민등록 번호 등 개인을 식별 할 수 있는 정보는 입력하지 마십시오.</Text>
            </Box>
          </Flex>
        </Flex>
        <Box height={'50px'} />
      </>
    )
  }
}

export default DoctorRequestModal;
