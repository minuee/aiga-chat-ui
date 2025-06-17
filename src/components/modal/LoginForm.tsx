'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Icon,Flex,Text,Box,Drawer,DrawerBody,useColorModeValue,DrawerOverlay,DrawerContent,DrawerCloseButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import axios from 'axios';
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import * as history from '@/utils/history';
import HeadTitle from './Title';
import LoginScreen from '@/components/signup/LoginScreen';
import JoinScreen from '@/components/signup/JoinScreen';
import SignupAgree from "@/components/modal/SignupAgree";
import functions from '@/utils/functions';
import mConstants from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';
import * as AuthService from "@/services/member/index";
import { ModalSignupAgreeStoreStore } from '@/store/modalStore';
import { MdOutlineSettings,MdArrowBack,MdOutlineClose } from 'react-icons/md';
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

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState('');
  const [userInfo, setUserInfo] = React.useState(null);
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
    }, 2000);
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

  const onClickJoin666 = async () => {
    try {
      const response = await axios.get('/auth/kakao', {
        withCredentials: true,
      });

      if (response.data?.user) {
        // ✅ 이미 가입된 유저
        setUserInfo(response.data.user);
        console.log('사용자 정보:', response.data.user);
      } else if (response.data?.url) {
        // ✅ 미가입자 → 카카오 로그인 창 띄우기
        setLoginUrl(response.data.url);
        setModalOpen(true);
      } else {
        console.warn('예상하지 못한 응답:', response.data);
      }
    } catch (error) {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=95ad93cc72ddbfd346b51eb9464c9313&redirect_uri=https://aigadev.kormedi.com/api/auth/kakao/callback&response_type=code`;
      setLoginUrl(kakaoAuthUrl);
      setModalOpen(true);
      console.error('카카오 로그인 오류:', error);
    }
  };
  
  const onClickJoin = (str:string) => {
    onSendSignupAgreeButton();
    return;
    const accessToken = mCookie.getCookie('refresh_token');
    console.log("refresh_token",accessToken)
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
      console.log('카카오 로그인 완료, code:', target);

      if (event.data.type === 'kakao-login-success') {
        console.log('✅ 카카오 로그인 if 성공:', event.data.payload);
        popup?.close();
        window.removeEventListener('message', receiveMessage);
      }else{
        console.log(`✅ 카카오 로그인 else 성공:`, event);
        //popup?.close();
        window.removeEventListener('message', receiveMessage);
      }
    };
    window.addEventListener('message', receiveMessage);
  };


  const onClickJoin3333 = async(str:string) => {
    setLoginForm({
      socialType : str
    });

    try{
      if ( !functions.isEmpty(str) ) {
        const res:any = await AuthService.handleKakaoLogin({ joinType : str});
        //console.log("res of onClickJoin",res)         
      }
    }catch(e:any){
      //console.log("error of getNewSessionID",e)
    }

  }

  const onClickJoin333 = async(str:string) => {
    console.log("onClickJoin",str)
    try {
      const response = await axios.get('/auth/kakao', {
        withCredentials: false,
      });
      console.log("response",response)
      //const kakaoUrl = response.data.url;
      router.push(response?.data?.url);
    } catch (err) {
      console.error('카카오 로그인 에러:', err);
    }
  };

  const onClickJoin555 = async () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=95ad93cc72ddbfd346b51eb9464c9313&redirect_uri=https://aigadev.kormedi.com/api/auth/kakao/callback&response_type=code`;
    //window.location.href = kakaoAuthUrl;       //웹개발할때 숨쉬듯이 작성할 코드
    //window.location.replace(kakaoAuthUrl);     // 이전 페이지로 못돌아감
    window.open(kakaoAuthUrl); 

    //const result = await router.push(kakaoAuthUrl);
    //console.log('페이지 이동 완료:', result);
    //window.location.href = kakaoAuthUrl;
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
            
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
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
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>카카오 로그인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loginUrl && (
              <iframe
                src={loginUrl}
                width="100%"
                height="500px"
                title="Kakao Login"
                style={{ border: 'none' }}
              ></iframe>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

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
              <ModalHeader bg={navbarBg}>
                <Flex flexDirection={'row'}>
                  <Box 
                    flex={1} 
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'} 
                    onClick={() => fn_close_modal_signup_agree()} 
                    cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                  </Box>
                  <Box 
                    flex={3} 
                    display={{base :'none', md:'flex'}} 
                    alignItems={'center'} 
                    >
                    <Text color={'white'} noOfLines={1}>이용동의</Text>
                  </Box>
                  <Box 
                    flex={3} 
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'} 
                    justifyContent={'flex-end'}
                  >
                    <Text color={'white'} noOfLines={1}>이용동의</Text>
                  </Box>
                  <Box 
                    flex={1} 
                    display={{base :'none', md:'flex'}} 
                    justifyContent={'flex-end'}
                    alignItems={'center'} 
                    onClick={() => fn_close_modal_signup_agree()} 
                    cursor={'pointer'}
                    >
                    <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
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
