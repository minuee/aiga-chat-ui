'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Flex,useColorModeValue ,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,Box,Icon,Text} from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import * as history from '@/utils/history';
import LoginScreen from '@/components/signup/LoginScreen';
import JoinScreen from '@/components/signup/JoinScreen';
import SignupAgree from "@/components/modal/SignupAgree";
import functions from '@/utils/functions';
import mConstants from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';
import * as AuthService from "@/services/member/index";
import { encryptToken } from "@/utils/secureToken";
import UserStateStore from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import ConfigInfoStore from '@/store/configStore';
import { ModalSignupAgreeStoreStore,ModalSignupFinishStoreStore,DoctorFromListStore } from '@/store/modalStore';
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
  const toast = useToast();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState('');
  //const [userInfo, setUserInfo] = React.useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const signupAgreeBtnRef = React.useRef<HTMLButtonElement>(null);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { nickName, ...userInfo } = UserStateStore(state => state);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);

  const { isOpenSignupAgreeModal } = ModalSignupAgreeStoreStore(state => state);
  const setIsOpenSignupAgreeModal = ModalSignupAgreeStoreStore((state) => state.setIsOpenSignupAgreeModal);
  const { isOpenSignupFinishModal } = ModalSignupFinishStoreStore(state => state);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);


  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
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

  const onClickJoin = (str:string) => {
    /* onSendSignupAgreeButton();
    return;
    toast({
      title: 'AIGA',
      position: 'top-right',
      description: '현재 작업중입니다. ',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    return;
 */
    console.log("apidata str",str)
    setLoginForm({
      socialType : str
    });
  
    const screenWidth = isMobileOnly ? window.screen.availWidth : 450;
    const screenHeight = isMobileOnly ? window.screen.availHeight : 600;
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';
    const popup = window.open(
      `${baseURL}/auth/${str}`, // Next.js에서 프록시된 백엔드 URL
      'SocialLogin',
      `width=${screenWidth},height=${screenHeight}`
      //`width=${screenWidth},height=${screenHeight},left=0,top=0`
    );

    const interval = setInterval(async () => {
      if (popup?.closed) {
        clearInterval(interval);
        console.log('apidata 팝업 닫힘 감지됨');
      }
    }, 500);

    const receiveMessage = async(event: MessageEvent) => {
      if ( !mConstants.apiAllowOriginCode.includes(event.origin) ) {
        console.warn('apidata 허용되지 않은 출처:', event.origin);
        popup?.close();
        window.removeEventListener('message', receiveMessage);
        return;
      }

      const expireDate = new Date();  
      expireDate.setDate(expireDate.getDate() + 7); // 7일 후 만료

      console.log('apidata event.data.type',event.data.type);
      if (event.data.type === 'kakao-auth') {
        console.log('apidata ✅ 카카오 로그인 성공:', event.data.code?.data?.user);
        const loginUserInfo = event?.data?.code?.data?.user;
        const accessToken = event?.data?.code?.data?.access_token;
        console.log('apidata accessToken',accessToken);
        if ( loginUserInfo?.agreement ) { // 회원인상태
          mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
          setLoginUserInfo({
            isState : loginUserInfo?.agreement, //isState
            sns_id : loginUserInfo?.sns_id, //sns_id
            email : loginUserInfo?.email, //email
            profileImage : loginUserInfo?.profile_img, //profileImage
            agreement : loginUserInfo?.agreement, //agreement
            registDate : loginUserInfo?.regist_date, //registDate
            updatedDate : loginUserInfo?.updatedAt,//updatedDate
            unregistDate : loginUserInfo?.unregist_date,//unregistDate
            userId : loginUserInfo?.user_id,//userId
            isGuest : false, //isGuest
            joinType : loginUserInfo?.sns_type,//joinType
            nickName : loginUserInfo?.nickname,//nickName
            userMaxToken : userMaxToken,//userMaxToken
            userRetryLimitSec :userRetryLimitSec//userRetryLimitSec
          });
          setNewChatOpen(false);
          setTimeout(() => {
            setNewChatOpen(true);
          }, 100);
          setClose();
        }else{ // 동의안한상태
          mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
          setLoginUserInfo({
            isState : loginUserInfo?.agreement, //isState
            sns_id : loginUserInfo?.sns_id, //sns_id
            email : loginUserInfo?.email, //email
            profileImage : loginUserInfo?.profile_img, //profileImage
            agreement : loginUserInfo?.agreement, //agreement
            registDate : loginUserInfo?.regist_date, //registDate
            updatedDate : loginUserInfo?.updatedAt,//updatedDate
            unregistDate : loginUserInfo?.unregist_date,//unregistDate
            userId : loginUserInfo?.user_id,//userId
            isGuest : true, //isGuest
            joinType : loginUserInfo?.sns_type,//joinType
            nickName : loginUserInfo?.nickname,//nickName
            userMaxToken : guestMaxToken,//userMaxToken
            userRetryLimitSec : guestRetryLimitSec //userRetryLimitSec
          });
          onSendSignupAgreeButton();
        }
        popup?.close();
        window.removeEventListener('message', receiveMessage);
      }else if (event.data.type === 'naver-auth') {
          console.log('apidata ✅ 네이버 로그인 if 성공:', event.data.payload);
          popup?.close();
          setNewChatOpen(false);
          setTimeout(() => {
            setNewChatOpen(true);
          }, 100);
          window.removeEventListener('message', receiveMessage);
      }else{
        console.log(`apidata ✅ 회원가입 실패 :`, event);
        window.removeEventListener('message', receiveMessage);
        toast({
          title: 'AIGA',
          position: 'top-right',
          description: '회원가입/로그인중 오류가 발생하였습니다. 잠시뒤에 이용해주세요. ',
          status: 'info',
          containerStyle: {
            color: '#ffffff',
          },
          duration: 2000,
          isClosable: true,
        });
      }
    };
    window.addEventListener('message', receiveMessage);
  };



  const setClcikClose = async(str:string) => {
    const currentPathname = await mCookie.getCookie('currentPathname');
    console.log("setClcikClose",currentPathname,mConstants.pathname_modal_21_2)
    if ( currentPathname == mConstants.pathname_modal_21_2 ) { //의사 상세위에서 로그인화면 
      const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
      if ( isFromDoctorDepth2 ) {//true이면 list > detail
        router.replace(`/${locale}/chat#${mConstants.pathname_modal_2_2}`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)  
        }, 200);
      }else{
        router.replace(`/${locale}/chat#${mConstants.pathname_modal_2}`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2}`)  
        }, 200);
      }
    }
    if(str === 'kakao' || str === 'naver' || str === 'aiga') {
      setLoginForm({socialType : ""});
    }else{
      setClose();
    }
  }

  return (
  
    <Flex w="100%" maxW={`${mConstants.modalMaxWidth}px`} padding='10px' height='100%' alignItems={'center'} >
      <LoginScreen
        onClickJoin={onClickJoin}
        onClcikClose={setClcikClose}
        isProduction={true}
      />
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
                  <Box 
                    position={'absolute'}
                    left={0}
                    top={0}
                    width="50px"
                    height={'100%'}
                    display={{base :'flex', md:'none'}} 
                    alignItems={'center'}  
                    onClick={() => fn_close_modal_signup_agree()} cursor={'pointer'}
                  >
                    <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                  </Box>
                  <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                    <Text color={'white'} noOfLines={1}>이용동의</Text>
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
                    onClick={() => fn_close_modal_signup_agree()}  cursor={'pointer'}
                    >
                    <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
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
    </Flex>
  );
}

export default LoginModal;
