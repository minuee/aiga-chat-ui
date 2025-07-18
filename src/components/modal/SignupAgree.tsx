'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Icon,SkeletonCircle,SkeletonText,Checkbox,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,useColorModeValue} from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import Image from 'next/image';
import ImageJoinComplete from "@/assets/images/img-joinComplete.png";
import * as MemberService from "@/services/member/index";
import YakwanContent from '@/components/modal/YakwanContent';
import PolicyContent from '@/components/modal/PolicyContent'
import MingamContent from '@/components/modal/MingamContent'

import { ModalSignupFinishStoreStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageMingamStore } from '@/store/modalStore';
import { encryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import ConfigInfoStore from '@/store/configStore';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import NextImage from 'next/legacy/image';
import ProcessingBar from "@/assets/icons/processing2x.gif";
import { MdOutlineClose,MdArrowBack } from 'react-icons/md';

export interface SignupAgreeeModalProps extends PropsWithChildren {
  userInfo : any;
  isOpen : boolean;
  setClose : () => void;
  onHandleNextFinish : () => void;
}

function SignupAgreeeModal(props: SignupAgreeeModalProps) {

  const { userInfo, isOpen, setClose,onHandleNextFinish } = props;
  const policyBtnRef = React.useRef<any>();
  const yakwanBtnRef = React.useRef<any>();
  const mingamBtnRef = React.useRef<any>();
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const { isOpenSignupFinishModal } = ModalSignupFinishStoreStore(state => state);
  const setIsOpenSignupFinishModal = ModalSignupFinishStoreStore((state) => state.setIsOpenSignupFinishModal);

  const { isOpenPolicyModal } = ModalMypagePolicyStore(state => state);
  const setIsOpenPolicyModal = ModalMypagePolicyStore((state) => state.setIsOpenPolicyModal);
  const { isOpenYakwanModal } = ModalMypageYakwanStore(state => state);
  const setIsOpenYakwanModal = ModalMypageYakwanStore((state) => state.setIsOpenYakwanModal);
  const { isOpenMingamModal } = ModalMypageMingamStore(state => state);
  const setIsOpenMingamModal = ModalMypageMingamStore((state) => state.setIsOpenMingamModal);

  const setLoginUserInfo = UserBasicInfoStore((state) => state.setUserBasicInfo);
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = userStoreInfo ?? defaultUserInfo;
  const nickName = userBaseInfo?.nickName;
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  
  const [inputs, setInputs] = React.useState<any>({
    isAgree : false,
    isAgree2 : false,
    isAgree3 : false,
    isAgree4 : false
  });
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const titleColor = useColorModeValue('#212127', 'white');
  const linkColor = useColorModeValue('#7F879B', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('#0AA464', '#0AA464');
  const textColor2 = useColorModeValue('black', 'white');
  const textColor3 = useColorModeValue('#5C5E69', 'white');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 60)
  }, [isOpen]);


  const onHandleAgreeSave = async() => {
    try{
      setReceiving(true)
      const res:any = await MemberService.setSignupAgree();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setIsOpenSignupFinishModal(true);
        setReceiving(false);
        const userSaveData = {
          ...userBaseInfo,
          isState : true, //isState
          isGuest : false,
          agreement : res.data?.user.agreement,
          updatedDate : res.data?.user.updateAt,
        }
        const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
        setLoginUserInfo(userSaveDataEncrypt);
      }          
    }catch(e:any){
      setReceiving(false)
      console.log("error of onHandleAgreeSave",e)
    }
  }

  const onHandleComplete = async() => {
    setIsOpenSignupFinishModal(false);
    onHandleNextFinish();
    const userSaveData = {
      ...userBaseInfo,
      isState : true, //isState
      isGuest : false,
      userMaxToken : userMaxToken,//userMaxToken
      userRetryLimitSec :userRetryLimitSec//userRetryLimitSec
    }
    const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
    setLoginUserInfo(userSaveDataEncrypt);
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 60);
  }

  const onSendMypagePolicyButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_9_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_9_2}`)
    setIsOpenPolicyModal(true);
  }

  const fn_close_modal_mypage_policy = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`)
    }, 200);
  }

  const onSendMypageYakwanButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_8_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_8_2}`)
    setIsOpenYakwanModal(true);
  }

  const fn_close_modal_mypage_yakwan = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`)
    }, 200);
  }

  const onSendMypageMingamButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_12_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_12_2}`)
    setIsOpenMingamModal(true);
  }

  const fn_close_modal_mypage_mingam = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenMingamModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_11}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`)
    }, 200);
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
                  <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} />
                </Box>
              </Flex>
            )
          }
          <Flex flexDirection={'column'} minHeight={'calc( 100vh - 120px )'}  justifyContent={'space-between'} width={'100%'} > 
            <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'100%'} width={'100%'} mt={'50px'}>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}> 
                <CustomTextBold700 fontSize={'32px'} color={textColor}>
                  회원가입이
                </CustomTextBold700>
                <CustomTextBold700 fontSize={'32px'} color={textColor}>
                  완료되었습니다.
                </CustomTextBold700>
              </Box>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} mt={'50px'}> 
                <CustomTextBold700 fontSize={'19px'} color={textColor2} lineHeight={"200%"}>
                  {nickName}님
                </CustomTextBold700>
                <CustomText fontSize={'17px'} color={textColor3} >
                 이제 맞춤형 의사 추천 AI서비스를 만나보세요
                </CustomText>
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
          <Flex display={'flex'} flexDirection={'column'} minHeight={'calc( 100vh - 120px )'} mt={5} justifyContent={'space-between'}> 
            <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'100%'}>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'}  flex={5} alignItems={'center'} >
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree}
                    onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
                  />
                  <Box pl="10px">
                    <CustomTextBold400 fontSize={'17px'} color={titleColor}>서비스 이용약관</CustomTextBold400>
                  </Box>
                </Box>
                <Box display='flex' flex={1} justifyContent={'flex-end'} alignItems='center' onClick={() => onSendMypageYakwanButton()} cursor={'pointer'} >
                  <CustomTextBold400 fontSize={'13px'} color={linkColor} textDecoration="underline">보기</CustomTextBold400>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'}  flex={5} alignItems={'center'} >
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree2}
                    onChange={(e) => setInputs({...inputs, isAgree2: e.target.checked})}
                  />
                  <Box pl="10px">
                    <CustomTextBold400 fontSize={'17px'} color={titleColor}>개인정보 수집 및 이용 동의</CustomTextBold400>
                  </Box>
                </Box>
                <Box display='flex' flex={1} justifyContent={'flex-end'} alignItems='center' onClick={() => onSendMypagePolicyButton()} cursor={'pointer'} >
                  <CustomTextBold400 fontSize={'13px'} color={linkColor} textDecoration="underline">보기</CustomTextBold400>
                </Box>
              </Box>

              <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'}  flex={5} alignItems={'center'} >
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree3}
                    onChange={(e) => setInputs({...inputs, isAgree3: e.target.checked})}
                  />
                  <Box pl="10px">
                    <CustomTextBold400 fontSize={'17px'} color={titleColor}>민감 정보 수집 및 이용 동의</CustomTextBold400>
                  </Box>
                </Box>
                <Box display='flex' flex={1} justifyContent={'flex-end'} alignItems='center' onClick={() => onSendMypageMingamButton()} cursor={'pointer'} >
                  <CustomTextBold400 fontSize={'13px'} color={linkColor} textDecoration="underline">보기</CustomTextBold400>
                </Box>
              </Box>
              
  
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'100%'} mt={5}>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} width={'100%'}>
                  <Checkbox
                    colorScheme='blue'
                    isChecked={inputs.isAgree4}
                    onChange={(e) => setInputs({...inputs, isAgree4: e.target.checked})}
                  />
                  <Box pl="10px">
                    <CustomTextBold400 fontSize={'17px'} color={titleColor}>만 14세 이상입니다.</CustomTextBold400>
                  </Box>
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
          {
          isOpenPolicyModal && (
            <Modal
              onClose={() => fn_close_modal_mypage_policy()}
              finalFocusRef={policyBtnRef}
              isOpen={isOpenPolicyModal}
              scrollBehavior={'inside'}
              blockScrollOnMount={false}
              preserveScrollBarGap={true}
              trapFocus={false}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'}
                      left={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_policy()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>개인정보 처리방침</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'}
                      right={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_policy()}  cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                  <PolicyContent />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
        {
          isOpenYakwanModal && (
            <Modal
              onClose={() => fn_close_modal_mypage_yakwan()}
              finalFocusRef={yakwanBtnRef}
              isOpen={isOpenYakwanModal}
              scrollBehavior={'inside'}
              blockScrollOnMount={false}
              preserveScrollBarGap={true}
              trapFocus={false}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'}
                      left={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_yakwan()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>이용약관</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'}
                      right={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_yakwan()}  cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh">
                  <YakwanContent />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
        {
          isOpenMingamModal && (
            <Modal
              onClose={() => fn_close_modal_mypage_mingam()}
              finalFocusRef={mingamBtnRef}
              isOpen={isOpenMingamModal}
              scrollBehavior={'inside'}
              blockScrollOnMount={false}
              preserveScrollBarGap={true}
              trapFocus={false}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'}
                      left={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_mingam()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>민감 정보 수집 및 이용 동의</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'}
                      right={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_mingam()}  cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh">
                  <MingamContent />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
        </>
      )
    }
  }
}

export default SignupAgreeeModal;