'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Icon,Flex,Box,Drawer,DrawerBody,useColorModeValue,DrawerOverlay,DrawerContent,DrawerCloseButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody } from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import CustomText from "@/components/text/CustomText";
import * as history from '@/utils/history';
import HeadTitle from './Title';
import LoginScreen from '@/components/signup/LoginScreen';
import JoinScreen from '@/components/signup/JoinScreen';
import SignupAgree from "@/components/modal/SignupAgree";
import mConstants from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';
import { ModalSignupAgreeStoreStore } from '@/store/modalStore';
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
export interface LoginModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

 interface loginFormProps {
  socialType : string;
}

function LoginModal(props: LoginModalProps) {
  const { isOpen, setClose } = props;
  const [ isLoading, setLoading] = React.useState(false);
  const [ loginForm, setLoginForm] = React.useState<loginFormProps>({
    socialType : ''
  });

  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const signupAgreeBtnRef = React.useRef<HTMLButtonElement>(null);
  const { isOpenSignupAgreeModal } = ModalSignupAgreeStoreStore(state => state);
  const setIsOpenSignupAgreeModal = ModalSignupAgreeStoreStore((state) => state.setIsOpenSignupAgreeModal);

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 60);
  }, [isOpen]);

  const fn_close_modal_signup_agree = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupAgreeModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_21}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_21}`)
    }, 200);
  }

  const onSendSignupAgreeButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_11}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_11}`);
    setIsOpenSignupAgreeModal(true);
  }

  const fn_close_modal_signup_finish = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenSignupAgreeModal(false);
    setClose();
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',``)
    }, 200);
  }

  const onClickJoin = (str:string) => {
    onSendSignupAgreeButton();
    return;
    const accessToken = mCookie.getCookie('refresh_token');
    setLoginForm({
      socialType : str
    });
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';
    const popup = window.open(
      `${baseURL}/auth/${str}`, // Next.js에서 프록시된 백엔드 URL
      'SocialLogin',
      `width=400,height=600`
      //`width=${screenWidth},height=${screenHeight},left=0,top=0`
    );

    const interval = setInterval(async () => {
      if (popup?.closed) {
        clearInterval(interval);
        console.log('팝업 닫힘 감지됨');
      }
    }, 500);

    const receiveMessage = (event: MessageEvent) => {
      if ( event.origin !== 'https://aigadev.kormedi.com' && event.origin !== 'http://localhost:3000') {
        console.warn('허용되지 않은 출처:', event.origin);
        return;
      }

      const { target } = event.data;
      //console.log('카카오 로그인 완료, code:', target);

      if (event.data.type === 'kakao-login-success') {
        //console.log('✅ 카카오 로그인 if 성공:', event.data.payload);
        popup?.close();
        window.removeEventListener('message', receiveMessage);
      }else{
        //console.log(`✅ 카카오 로그인 else 성공:`, event);
        //popup?.close();
        window.removeEventListener('message', receiveMessage);
      }
    };
    window.addEventListener('message', receiveMessage);
  };

  const setClcikClose = (str:string) => {
    if(str === 'kakao' || str === 'naver' || str === 'aiga') {
      setLoginForm({socialType : ""});
    }else{
      setClose();
    }
  }

  return (
    <Box display={{ base: 'block', xl: 'block' }} position="fixed" minH="100%">
      <Drawer
        isOpen={isOpen}
        onClose={ () => setClcikClose(loginForm.socialType)}
        placement={'left'}
      >
        <DrawerOverlay />
        <DrawerContent
          w="100%"
          maxW={`${mConstants.modalMaxWidth}px`}
         /*  ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }} */
          //borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <HeadTitle title={(loginForm.socialType === 'kakao' || loginForm.socialType === 'naver' || loginForm.socialType === 'aiga') ? "회원가입" : "로그인"} />
          <DrawerCloseButton
            zIndex="3"
            onClick={ () => setClcikClose(loginForm.socialType)}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW={`${mConstants.modalMaxWidth}px`} px="0rem" pb="10" height="100%" backgroundColor="white">
            <Box width='calc( 100% - 20px)' padding='10px' height='100%'>
              {
                (  ['aiga'].includes(loginForm.socialType) ) 
                ?
                (
                  <JoinScreen
                    socialType={loginForm.socialType}
                    onClickJoin={onClickJoin}
                  />
                )
                : 
                (
                  <LoginScreen
                    onClickJoin={onClickJoin}
                    onClcikClose={setClcikClose}
                    isProduction={false}
                  />
                )
              }
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {
        isOpenSignupAgreeModal && (   
          <Modal
            onClose={() => fn_close_modal_signup_agree()}
            finalFocusRef={signupAgreeBtnRef}
            isOpen={isOpenSignupAgreeModal}
            scrollBehavior={'inside'}
            blockScrollOnMount={false}
            preserveScrollBarGap={true}
            trapFocus={false}
            size={'full'} 
          >
            <ModalOverlay />
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000} margin={0} padding={0}>
              <ModalHeader bg={navbarBg} padding="basePadding">
                <Flex flexDirection={'row'} position={'relative'}>
                  <Box position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'} onClick={() => fn_close_modal_signup_agree()} cursor={'pointer'}>
                    <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                  </Box>
                  <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                    <CustomText color={'white'} noOfLines={1}>이용동의</CustomText>
                  </Box>
                  <Box position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'} onClick={() => fn_close_modal_signup_agree()}  cursor={'pointer'}>
                    <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh">
                <SignupAgree
                  userInfo={null}
                  isOpen={isOpenSignupAgreeModal}
                  setClose={() => fn_close_modal_signup_agree()}
                  onHandleNextFinish={() => fn_close_modal_signup_finish()}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      }
    </Box>
  );
}

export default LoginModal;