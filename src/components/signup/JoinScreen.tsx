'use client';
import React from 'react';
// chakra imports
import { Box,Flex,chakra,Button,Step,StepDescription,StepIcon,StepIndicator,StepNumber,StepSeparator,StepStatus,StepTitle,Stepper,useSteps,FormControl,Checkbox, useDisclosure,InputGroup,
  InputLeftElement,Input,LinkBox,LinkOverlay,Heading,Text,AlertDialog,AlertDialogBody,AlertDialogFooter,AlertDialogHeader,AlertDialogContent,AlertDialogOverlay,Spinner } from '@chakra-ui/react';
import { FaUserAlt, FaLock } from "react-icons/fa";
const CFaUserAlt = chakra(FaUserAlt);

export interface JoinScreenProps {
  socialType : string;
  onClickJoin  : (str:string) => void;
}

const steps = [
  { title: '회원정보', description: 'Contact Info' },
  { title: '이용동의', description: 'Date & Time' },
  { title: '14세이용동의', description: 'Date & Time' },
  { title: '등록', description: 'Select Rooms' },
]

function JoinScreen(props: JoinScreenProps) {

  const { onClickJoin,socialType } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [isLoading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  const [inputs, setInputs] = React.useState({
    use_agree : false,
    over_14_agree : false,
    social_type : socialType,
    nick_name : '닉네임'
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = (num:number) => {
    if ( num == 3 ) {
      setInputs({
        ...inputs,
        over_14_agree : false,
      })
    }else if ( num == 2 ) {
      setInputs({
        ...inputs,
        use_agree : false,
      })
    }else if ( num == 4 ) {
      setInputs({
        ...inputs,
        over_14_agree : false,
        use_agree : false,
      })
    }
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
      setActiveStep(0);
  };

  const HandleOnChange = (e:any,type:string) => {
      setInputs({
          ...inputs,
          [type] : e.target.value.trim()
      })
  }

  // 이용약관 동의 체크
  const handleAgree = (event:any) => {
      setChecked(event.target.checked)
  }

  // 14세 이상 동의 체크
  const handleAgree2 = (event:any) => {
      setChecked2(event.target.checked)
  }

  const handleRegist = () => {
    console.log(inputs);
    onClose();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInputs({
        use_agree : false,
        over_14_agree : false,
        social_type : '',
        nick_name : ''
      })
      onClickJoin('');
    }, 1000);
  }

  // SIDEBAR
  return (
      <Flex
        flexDirection="column"
        width="100%"
        height="100%"
        backgroundColor="white"
        justifyContent="flex-start"
        alignItems="flex-starts"
      >
        {
        isLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%' width='100%'>
            <Spinner />
          </Box>
        )
        :
        (
        <Stepper index={activeStep} orientation='vertical' minHeight='400px' gap='0' maxHeight={'100vh'}>
          {steps.map((step:any, index:number) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              {
                index == 0 ? (
                  <Box flexShrink='0'>
                    <StepTitle>{step.title} (가입경로 : {socialType})</StepTitle>
                    <Box mb={2} padding='10px 0'>
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<CFaUserAlt color="gray.300" />}
                          />
                          <Input type="email" value={'minuee@kormedi.com'} name="email" readOnly/>
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<CFaUserAlt color="gray.300" />}
                          />
                          <Input type="text" value={inputs.nick_name} name="nickname" onChange={(e:any) => HandleOnChange(e,'nick_name')} readOnly={activeStep == 1 ? false : true} />
                        </InputGroup>
                      </FormControl>
                      {
                        activeStep == 1 && (
                          <Box mt={2}>
                            <Button variant="solid" colorScheme='teal' size='sm' onClick={handleNext}>확인</Button>
                          </Box>
                        )
                      }
                      </Box>
                  </Box>
                )
                :
                index == 1 
                ? 
                (
                  <Box flexShrink='0'>
                    <StepTitle>
                      {step.title} 
                      {activeStep == 2 && (
                        <Checkbox size='sm' colorScheme='teal' onChange={(e:any) => handleAgree(e)} ml={2}>동의</Checkbox>
                      )}
                    </StepTitle>
                    {
                        activeStep == 2 ? (
                          <Box mb={2} padding='10px 0'>
                            <LinkBox as='article' p='3' borderWidth='1px' rounded='md' bg='white' mb={2} width='100%'>
                              <Box as='time' dateTime='2021-01-15 15:30:00 +0000 UTC'>
                                이용약관
                              </Box>
                              <Heading size='md' my='2'>
                                <LinkOverlay href='#'>
                                  제 1조 1항
                                </LinkOverlay>
                              </Heading>
                              <Text mb='3'>
                                동해물과 백두산이 마르고 닳도록...
                              </Text>
                              <Box as='a' color='teal.400' href='https://kormedi.com/%ec%9d%b4%ec%9a%a9%ec%95%bd%ea%b4%80-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/' fontWeight='bold' target='_blank'>
                                자세히 보기
                              </Box>
                            </LinkBox>
                            <Button variant="solid" colorScheme="blackAlpha" size='sm' onClick={() => handleBack(2)}>뒤로</Button> 
                            <Button variant="solid" colorScheme='teal' size='sm' onClick={handleNext}>다음</Button>  
                          </Box>
                        )
                        :
                        activeStep > 2
                        ?
                        (
                          <Box mb={2} padding='10px 0'>
                            <Checkbox size='sm' colorScheme='teal' defaultChecked  disabled={checked} readOnly={checked}>이용 동의</Checkbox>
                          </Box>
                        )
                        : 
                        <Box mb={2} padding='10px 0'></Box>
                      }
                  </Box>
                )
                :
                index == 2 
                ? 
                (
                  <Box flexShrink='0'>
                    <StepTitle>
                      {step.title} 
                      {activeStep == 3 && (
                        <Checkbox size='sm' colorScheme='teal' onChange={(e:any) => handleAgree2(e)} ml={2}>동의</Checkbox>
                      )}
                    </StepTitle>
                    {
                        activeStep == 3 ? (
                          <Box mb={2} padding='10px 0'>
                            <LinkBox as='article' p='3' borderWidth='1px' rounded='md' bg='white' mb={2} width='100%'>
                              <Box as='time' dateTime='2021-01-15 15:30:00 +0000 UTC'>
                                14세 이상 이용동의
                              </Box>
                              
                              <Text mb='3'>
                                동해물과 백두산이 마르고 닳도록...
                              </Text>
                              <Box as='a' color='teal.400' href='https://kormedi.com/%ec%9d%b4%ec%9a%a9%ec%95%bd%ea%b4%80-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/' fontWeight='bold' target='_blank'>
                                자세히 보기
                              </Box>
                            </LinkBox>
                            <Button variant="solid" colorScheme="blackAlpha" size='sm' onClick={() => handleBack(3)}>뒤로</Button> 
                            <Button variant="solid" colorScheme='teal' size='sm' onClick={handleNext}>다음</Button>  
                          </Box>
                        )
                        :
                        activeStep > 3
                        ?
                        (
                          <Box mb={2} padding='10px 0'>
                            <Checkbox size='sm' colorScheme='teal' defaultChecked  disabled={checked2} readOnly={checked2}>14세 이용 동의</Checkbox>
                          </Box>
                        )
                        : 
                        <Box mb={2} padding='10px 0'></Box>
                      }
                  </Box>
                )
                :
                index == 3
                ? 
                (
                  <Box flexShrink='0'>
                    <StepTitle>{step.title}</StepTitle>
                    {
                        activeStep == 4 && (
                          <Box mb={2} padding='10px 0'>
                            <Button variant="solid" colorScheme="blackAlpha" size='sm' onClick={() => handleBack(4)}>뒤로</Button> 
                            <Button variant="solid" colorScheme='teal' size='sm' onClick={onOpen}>등록</Button>  
                          </Box>
                        )
                      }
                  </Box>
                )
                :
                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
              }
              <StepSeparator />
            </Step>
          ))}
        </Stepper>   
        )}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef as any}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent backgroundColor='white'>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                회원등록
              </AlertDialogHeader>

              <AlertDialogBody>
                AIGA 서비스의 회원으로 등록하시겠습니까?
                회원가입 후 회원정보 수정 및 탈퇴가 가능합니다.
              </AlertDialogBody>
              <AlertDialogBody>
                등록완료후 로그인페이지로 이동합니다.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef as any} onClick={onClose}>
                  취소
                </Button>
                <Button colorScheme='red' onClick={handleRegist} ml={3}>
                  등록
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>       
  )
}


export default JoinScreen;
