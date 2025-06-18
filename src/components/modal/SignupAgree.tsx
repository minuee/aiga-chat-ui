'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Checkbox,useColorModeValue} from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import Image from 'next/image';
import ImageJoinComplete from "@/assets/images/img-joinComplete.png";
import functions from "@/utils/functions";
import * as MemberService from "@/services/member/index";
import { ModalSignupFinishStoreStore } from '@/store/modalStore';
import UserStateStore from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import ConfigInfoStore from '@/store/configStore';

import NextImage from 'next/legacy/image';
import { loadingImage } from "@/components/icons/IconImage"

export interface SignupAgreeeModalProps extends PropsWithChildren {
  userInfo : any;
  isOpen : boolean;
  setClose : () => void;
  onHandleNextFinish : () => void;
}

function SignupAgreeeModal(props: SignupAgreeeModalProps) {

  const { userInfo, isOpen, setClose,onHandleNextFinish } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const { isOpenSignupFinishModal } = ModalSignupFinishStoreStore(state => state);
  const setIsOpenSignupFinishModal = ModalSignupFinishStoreStore((state) => state.setIsOpenSignupFinishModal);
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { nickName, ...userBasicInfo } = UserStateStore(state => state);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  const [inputs, setInputs] = React.useState<any>({
    isAgree : false,
    isAgree2 : false,
    isAgree3 : false,
    isAgree4 : false
  });
  const bgColor = useColorModeValue('blue', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('#0AA464', '#0AA464');
  const textColor2 = useColorModeValue('black', 'white');
  const textColor3 = useColorModeValue('#5C5E69', 'white');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [isOpen]);


  const onHandleAgreeSave = async() => {
    try{
      setReceiving(true)
      const res:any = await MemberService.setSignupAgree();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsOpenSignupFinishModal(true);
        setReceiving(false);
        setLoginUserInfo({
          ...userBasicInfo,
          isState : true, //isState
          isGuest : false,
          agreement : res.data?.user.agreement,
          updatedDate : res.data?.user.updateAt,
        });
      }          
    }catch(e:any){
      setReceiving(false)
      console.log("error of onHandleAgreeSave",e)
    }
  }

  const onHandleComplete = async() => {
    setIsOpenSignupFinishModal(false);
    onHandleNextFinish();
    setLoginUserInfo({
      ...userBasicInfo,
      isState : true, //isState
      isGuest : false,
      userMaxToken : userMaxToken,//userMaxToken
      userRetryLimitSec :userRetryLimitSec//userRetryLimitSec
    });
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 100);
  }

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{
    if ( isOpenSignupFinishModal ) { // 피니쉬
      return (
        <>
        {
            isReceiving && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%' display={'flex'} justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex={100}>
                <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                  <NextImage
                    width="100"
                    height="100"
                    src={loadingImage}
                    alt={'doctor1'}
                  />
                  <Text color="#ffffff">등록중...</Text>
                </Box>
              </Flex>
            )
          }
          <Flex flexDirection={'column'} minHeight={'calc( 100vh - 120px )'}  justifyContent={'space-between'} width={'100%'} > 
            <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'100%'} width={'100%'} mt={'50px'}>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}> 
                <Text fontSize={'32px'} color={textColor} fontWeight={'bold'}>
                  회원가입이
                </Text>
                <Text fontSize={'32px'} color={textColor} fontWeight={'bold'}>
                  완료되었습니다.
                </Text>
              </Box>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} mt={'50px'}> 
                <Text fontSize={'19px'} color={textColor2} fontWeight={'bold'} lineHeight={"200%"}>
                  {nickName}님
                </Text>
                <Text fontSize={'17px'} color={textColor3} >
                 이제 맞춤형 의사 추천 AI서비스를 만나보세요
                </Text>
              </Box>
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'}> 
                <Image 
                  src={ImageJoinComplete}
                  alt="ImageJoinComplete"
                  style={{width:'280px',objectFit: 'contain',maxWidth:"280px"}}
                />
              </Box>
            </Flex>
            
            <Box position={'fixed'} bottom={0} left={0} padding={'10px'} width={'100%'} height={'100px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'95%'} 
                maxWidth={`${mConstants.modalMaxWidth-50}px`} 
                borderRadius={'10px'}
                onClick={() => onHandleComplete()}
                id="button_entire"
              >
                AIGA 시작하기
              </Button>
            </Box>
          </Flex>
        </>
      )
    }else{
      return (
        <>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'calc( 100vh - 120px )'} padding={'0 10px'} mt={5} justifyContent={'space-between'}> 
            <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'98%'}>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'}  width={'100%'}>
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree}
                    onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
                  >
                    서비스 이용약관
                  </Checkbox>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}  width={'100%'} mt={5}>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} width={'100%'}>
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree2}
                    onChange={(e) => setInputs({...inputs, isAgree2: e.target.checked})}
                  >
                    개인정보 수집 및 이용 동의
                  </Checkbox>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} width={'100%'}>
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree3}
                    onChange={(e) => setInputs({...inputs, isAgree3: e.target.checked})}
                  >
                    민감 정보 수집 및 이용 동의
                  </Checkbox>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} width={'100%'}>
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree4}
                    onChange={(e) => setInputs({...inputs, isAgree4: e.target.checked})}
                  >
                    만 14세 이상입니다.
                  </Checkbox>
                </Box>
              </Box>
            </Box>
            
            <Box position={'fixed'} bottom={0} left={0} padding={'10px'} width={'100%'} height={'100px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'95%'} 
                maxWidth={`${mConstants.modalMaxWidth-50}px`} 
                borderRadius={'5px'}
                onClick={() => onHandleAgreeSave()}
                isDisabled={(inputs.isAgree && inputs.isAgree2 && inputs.isAgree3 && inputs.isAgree4 ) ? false : true}
                id="button_entire"
              >
                동의하고 계속하기
              </Button>
            </Box>
          </Flex>
        </>
      )
    }
  }
}

export default SignupAgreeeModal;