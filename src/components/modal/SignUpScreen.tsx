'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Flex,useColorModeValue ,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,Box,Icon } from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import { isMobileOnly } from "react-device-detect";
import * as history from '@/utils/history';
import LoginScreen from '@/components/signup/LoginScreen';
import SignupAgree from "@/components/modal/SignupAgree";
import mConstants from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';
import CustomText from "@/components/text/CustomText";
import { encryptToken } from "@/utils/secureToken";
import { UserBasicInfoStore } from '@/store/userStore';
import ConfigInfoStore from '@/store/configStore';
import NewChatStateStore,{ ChatSesseionIdStore,CallHistoryDataStore } from '@/store/newChatStore';
import historyStore from '@/store/historyStore';
import { 
  ModalDoctorDetailStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorListStore,DrawerHistoryStore,ModalMypageStore,ModalMypageNoticeStore,ModalMypageNoticeDetailStore,
  ModalMypageRequestStore,ModalMypageEntireStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageMingamStore,ModalSignupStoreStore,ModalSignupAgreeStoreStore,DoctorFromListStore,ReviewAlertStore
 } from '@/store/modalStore';
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
  const toast = useToast();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [loginUrl, setLoginUrl] = React.useState('');
  //const [userInfo, setUserInfo] = React.useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const signupAgreeBtnRef = React.useRef<HTMLButtonElement>(null);
  const setLoginUserInfo = UserBasicInfoStore((state) => state.setUserBasicInfo);
 

  const { isOpenSignupAgreeModal } = ModalSignupAgreeStoreStore(state => state);
  const setIsOpenSignupAgreeModal = ModalSignupAgreeStoreStore((state) => state.setIsOpenSignupAgreeModal);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
  const setChatSessionId = ChatSesseionIdStore((state) => state.setChatSessionId);
  const oldHistoryData = CallHistoryDataStore(state => state.historyData);
  const setOldHistoryData = CallHistoryDataStore((state) => state.setOldHistoryData);

  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const setCurrentPathname = historyStore((state) => state.setCurrentPathname);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const setIsOpenNoticeDetailModal = ModalMypageNoticeDetailStore((state) => state.setIsOpenNoticeDetailModal);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);
  const setIsOpenPolicyModal = ModalMypagePolicyStore((state) => state.setIsOpenPolicyModal);
  const setIsOpenYakwanModal = ModalMypageYakwanStore((state) => state.setIsOpenYakwanModal);
  const setIsOpenMingamModal = ModalMypageMingamStore((state) => state.setIsOpenMingamModal);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal)
  const { isOpenAlert } = ReviewAlertStore(state => state);
  const setOpenAlert = ReviewAlertStore((state) => state.setIsOpenReviewLoginAlert);

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

  const firstForceStep = () => {
    setChatSessionId('')
    setIsOpenReview(false)
    setIsOpenDoctorDetailModal(false);
    setOpenHistoryDrawer(false);
    setIsOpenRequestModal(false);
    setOpenDoctorListModal(false);
    setIsOpenSetupModal(false);
    setIsOpenNoticeListModal(false);
    setIsOpenDoctorDetailModal(false);
    setIsOpenMypageRequestModal(false);
    setIsOpenEntireModal(false);
    setIsOpenPolicyModal(false);
    setIsOpenYakwanModal(false);
    setIsOpenMingamModal(false);
    setIsOpenSignupModal(false);
    setIsOpenSignupAgreeModal(false);
    setOldHistoryData(null)
    setFromDoctorDepth2(false)
    setOpenAlert(false)
  }

  const onClickJoin = (str:string) => {
    setLoginForm({
      socialType : str
    });
    
    try {
      const screenWidth = isMobileOnly ? window.screen.availWidth : 450;
      const screenHeight = isMobileOnly ? window.screen.availHeight : 600;
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';
      const popup = window.open(
        `${baseURL}auth/${str}`, // Next.js에서 프록시된 백엔드 URL
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

        console.log('apidata event.data.type',event?.data?.type);
        if (event?.data?.type === 'kakao-auth') {
          console.log('apidata ✅ 카카오 로그인 성공:', event.data.code?.data?.user);
          const loginUserInfo = event?.data?.code?.data?.user;
          const accessToken = event?.data?.code?.data?.access_token;
          if ( loginUserInfo?.agreement ) { // 회원인상태
            mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
            const userSaveData = {
              isState : loginUserInfo?.agreement, 
              sns_id : loginUserInfo?.sns_id,
              email : loginUserInfo?.email,
              profileImage : loginUserInfo?.profile_img, 
              agreement : loginUserInfo?.agreement,
              registDate : loginUserInfo?.regist_date,
              updatedDate : loginUserInfo?.updatedAt,
              unregistDate : loginUserInfo?.unregist_date,
              userId : loginUserInfo?.user_id,
              isGuest : false, 
              joinType : loginUserInfo?.sns_type,
              nickName : loginUserInfo?.nickname,
              userMaxToken : userMaxToken,
              userRetryLimitSec :userRetryLimitSec
            }
            const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
            setLoginUserInfo(userSaveDataEncrypt);
           
            setNewChatOpen(false);
            setTimeout(() => {
              setNewChatOpen(true);
            }, 100);
            setClose();
          }else{ // 동의안한상태
            mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
            const userSaveData = {
              isState : loginUserInfo?.agreement,
              sns_id : loginUserInfo?.sns_id,
              email : loginUserInfo?.email,
              profileImage : loginUserInfo?.profile_img,
              agreement : loginUserInfo?.agreement,
              registDate : loginUserInfo?.regist_date,
              updatedDate : loginUserInfo?.updatedAt,
              unregistDate : loginUserInfo?.unregist_date,
              userId : loginUserInfo?.user_id,
              isGuest : true,
              joinType : loginUserInfo?.sns_type,
              nickName : loginUserInfo?.nickname,
              userMaxToken : guestMaxToken,
              userRetryLimitSec : guestRetryLimitSec
            }
            const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
            setLoginUserInfo(userSaveDataEncrypt);
            onSendSignupAgreeButton();
          }
          popup?.close();
          window.removeEventListener('message', receiveMessage);
        }else if (event?.data?.type === 'naver-auth') {
          const loginUserInfo = event?.data?.code?.data?.user;
          const accessToken = event?.data?.code?.data?.access_token;
          if ( loginUserInfo?.agreement ) { 
            mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
            const userSaveData = {
              isState : loginUserInfo?.agreement,
              sns_id : loginUserInfo?.sns_id,
              email : loginUserInfo?.email,
              profileImage : loginUserInfo?.profile_img, 
              agreement : loginUserInfo?.agreement,
              registDate : loginUserInfo?.regist_date,
              updatedDate : loginUserInfo?.updatedAt,
              unregistDate : loginUserInfo?.unregist_date,
              userId : loginUserInfo?.user_id,
              isGuest : false, 
              joinType : loginUserInfo?.sns_type,
              nickName : loginUserInfo?.nickname,
              userMaxToken : userMaxToken,
              userRetryLimitSec :userRetryLimitSec
            }
            const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
            setLoginUserInfo(userSaveDataEncrypt);
            setTimeout(() => {
              setNewChatOpen(true);
            }, 100);
            setClose();
          }else{ // 동의안한상태
            mCookie.setCookie(mConstants.apiTokenName, encryptToken(accessToken), { path: '/' , expires : expireDate })
            const userSaveData = {
              isState : loginUserInfo?.agreement,
              sns_id : loginUserInfo?.sns_id,
              email : loginUserInfo?.email,
              profileImage : loginUserInfo?.profile_img,
              agreement : loginUserInfo?.agreement,
              registDate : loginUserInfo?.regist_date,
              updatedDate : loginUserInfo?.updatedAt,
              unregistDate : loginUserInfo?.unregist_date,
              userId : loginUserInfo?.user_id,
              isGuest : true, 
              joinType : loginUserInfo?.sns_type,
              nickName : loginUserInfo?.nickname,
              userMaxToken : guestMaxToken,
              userRetryLimitSec : guestRetryLimitSec
            }
            const userSaveDataEncrypt = await encryptToken(JSON.stringify(userSaveData))
            setLoginUserInfo(userSaveDataEncrypt);
            onSendSignupAgreeButton();
          }
          popup?.close();
          window.removeEventListener('message', receiveMessage);
        }
      };
      window.addEventListener('message', receiveMessage);
      }catch(e:any){
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

  const setClcikClose = async(str:string) => {
    const currentPathname = await mCookie.getCookie('currentPathname');
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
  
    <Flex w="100%" maxW={`${mConstants.modalMaxWidth}px`} padding='10px' height='100%' alignItems={'center'}>
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
                    <CustomText color={'white'} noOfLines={1}>이용동의</CustomText>
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
                  />
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
