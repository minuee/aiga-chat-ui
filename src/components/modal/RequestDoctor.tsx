'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Textarea,useColorModeValue,useToast } from '@chakra-ui/react';
import { format } from 'date-fns';
import functions from '@/utils/functions';
import mConstants from '@/utils/constants';
import Alert from '@/components/alert/CustomAlert';
import NextImage from 'next/legacy/image';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import * as DoctorService from "@/services/doctor/index";

import { iconAlertModify } from "@/components/icons/IconImage"
import ProcessingBar from "@/assets/icons/processing2x.gif";
export interface DoctorRequestModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleDoctorRequestRegist : (data:any) => void;
  selected_doctor : any;
}

function DoctorRequestModal(props: DoctorRequestModalProps) {
  
  const { isOpen, setClose, onHandleDoctorRequestRegist, selected_doctor } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [isReceiving, setReceiving] = React.useState(false);
  const [isOpenAlert, setOpenAlert] = React.useState(false);  
  const toast = useToast();

  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue("#7F879B",'white')
  const [inputs, setInputs] = React.useState<any>({
    doctor_id: '',
    relation: null,
    req_name : null,
    req_phone : null,
    content : null,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 60);

    if( !functions.isEmpty(selected_doctor?.doctor_id) ){
      setInputs({
        ...inputs,
        doctor_id: selected_doctor?.doctor_id
      });
    }
  }, [isOpen]);


  const onHandleAlertConfirm = () => {
    onHandleDoctorRequestRegist(inputs)
  }

  const onSendDoctorRequestRegist = async(data:any) => {
    try{
      setReceiving(true)
      const title = `${selected_doctor?.name} 의사의 정보수정요청_${format(Date.now(), 'yyyy-MM-dd')}`
      const res:any = await DoctorService.registModifyDoctorInfo(inputs.doctor_id,title,inputs?.content);
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setTimeout(() => {
          setOpenAlert(true)
          setReceiving(false);
        }, 60);
      }else{
        toast({
          title: 'AIGA',
          position: 'top-right',
          description: '등록중 에러가 발생하였습니다 잠시후 다시이용해주십시요',
          status: 'error',
          containerStyle: {
            color: '#ffffff',
          },
          duration: 1500,
          isClosable: true,
        });
      }
    }catch(e:any){
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
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'} fontSize={'14px'}>
            <CustomText fontSize={'13px'} color="#7F879B">의사 프로필에 수정이 필요한 내용을 알려주세요</CustomText>
          </Box>
        </Flex>
       
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}>
          {
            isReceiving && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
                <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                  <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} />
                </Box>
              </Flex>
            )
          }
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
                value={inputs.content || ''} 
                onChange={(e) => setInputs({...inputs, content: e.target.value})} 
                resize={'none'}  
                minH={'200px'}
                fontSize={'15px'} 
                padding={"10px"}
                isInvalid={!functions.isEmpty(inputs.content)}
                placeholder='수정요청 및 기타 문의사항을 입력해주세요 (필수, 최소 10자이상)'
                id={"textarea_content"}
                borderRadius={"8px"}
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => onSendDoctorRequestRegist(inputs)}
              isDisabled={(functions.isEmpty(inputs.content) || (inputs.content && inputs.content.length < 10)) ? true : false}
              id="button_regist"
            >
              제출하기
            </Button>
          </Box>
          <Flex display={'flex'} flexDirection={'column'} justifyContent={'center'}  minHeight={'20px'} mt={10}>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <CustomTextBold700 fontSize={'13px'} color={textColor} >안내 사항</CustomTextBold700>
            </Box>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <CustomTextBold400 fontSize={'13px'} color="#7F879B" >• 산업안전보건법에 따라 고객 응대 근로자 보호조치를 시행하고 있으며 모든 문의는 기록으로 남습니다.</CustomTextBold400>
            </Box>
            <Box flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'}>
              <CustomTextBold400 fontSize={'13px'} color="#7F879B" >• 본 요청은 비회원도 개인정보 제공 없이 제출하실 수 있으므로 이름, 연락처, 주민등록 번호 등 개인을 식별 할 수 있는 정보는 입력하지 마십시오.</CustomTextBold400>
            </Box>
          </Flex>
        </Flex>
        <Box height={'50px'} />
        {
          isOpenAlert && (
            <Alert 
              isShowAppname={false}
              AppName='AIGA'
              bodyContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px">
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                    <NextImage
                      width="106"
                      height="90"
                      src={iconAlertModify}
                      alt={'doctor1'}
                    />
                  </Box>
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"50px"}>
                    <CustomTextBold700 fontSize={'18px'} color="#212127">소중한 의견 감사합니다!</CustomTextBold700>
                  </Box>
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"60px"}>
                    <CustomText fontSize={'17px'} color="#212127">의사 정보 수정 요청이 성공적으로 제출되었습니다. 검토 후 반영될 예정입니다.</CustomText>
                  </Box>
                </Flex>
              }
              isOpen={isOpenAlert}
              onClose={() => setOpenAlert(false)}
              onConfirm={() => onHandleAlertConfirm()}
              closeText='취소'
              confirmText='확인'
              footerContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px" width={"100%"}>
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#2B8FFF" borderRadius={'6px'} onClick={() => onHandleAlertConfirm()} cursor={'pointer'}>
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

export default DoctorRequestModal;
