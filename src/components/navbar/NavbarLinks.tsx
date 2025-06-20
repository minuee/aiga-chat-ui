'use client';
// Chakra Imports
import * as React from 'react';
import { 
    Box,Button,Center,Flex,Icon,Link,Menu,MenuButton,MenuItem,MenuList,Text,useColorMode,useColorModeValue,useToast,
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody
} from '@chakra-ui/react';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import NoticerModal  from '@/components/modal/NoticeList';
import LoginModal  from '@/components/modal/LoginForm';
import routes from '@/routes';
import ProfileSetting from '@/components/modal/ProfileSetting';
import mConstants from '@/utils/constants';
import Alert from '@/components/alert/Alert';
import UserStateStore from '@/store/userStore';
import ConfigInfoStore from '@/store/configStore';
import NewChatStateStore from '@/store/newChatStore';
import functions from '@/utils/functions';

export default function HeaderLinks(props: {secondary: boolean;}) {

  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const { userId, ...userInfo } = UserStateStore(state => state);
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const toast = useToast();
  // Loading state
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);
  const [isOpenNoticeModal, setIsOpenNoticeModal] = React.useState<boolean>(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = React.useState<boolean>(false);
  const [isOpenSetupModal, setIsOpenSetupModal] = React.useState<boolean>(false);
  const [buttonText, setButtonText] = React.useState<string>('구독하기');
  const [myToken, setMyToken] = React.useState<PushSubscription | null>(null);
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('white', 'navy.800');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.18)', '0px 41px 75px #081132');

  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  
  const sendNotification = async() => {
    try {
      const bodyDat = {
        ...myToken,
        endpoint: "http://localhost:3000/chat"
      }
      const response = await fetch('/api/sendpush', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(myToken),
      }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));;
     /*  if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
       */
    } catch (error) {
        console.error('Error sending notification:', error);
    }
  }

  const requestPermission = async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            // 이미 구독이 되어있다면 해지하기
            // TODO: DB에 구독 해지 정보 보내기
            setButtonText('구독하기');
            subscription.unsubscribe();
        } else {
            // 구독이 되어있지 않으면 구독하기
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });
            // TODO: DB에 구독 정보 보내기
            setButtonText('구독 해지하기');
        }
    } catch (e:any) {
        console.error(e.message);
    }
  }

   const subscribeUser = async() => {

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          setMyToken(subscription);
          toast({
            title: 'Already subscribed',
            position: 'top-right',
            description: 'You are already subscribed to the push notifications',
            status: 'info',
            containerStyle: {
              color: '#ffffff',
            },
            duration: 5000,
            isClosable: true,
          });
        } else {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            })
            .then((subscription) => {
              setMyToken(subscription);
              // save subscription on DB
              /* fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
              }); */
            });
        }
      });
    }).catch(e => {
      console.error(e);
    });
  }

  const onHandleLogout = () => {
    setLoginUserInfo({
      isState : false, //isState
      sns_id: '', //sns_id
      email : '', //email
      profileImage : '', //profileImage
      agreement : false, //agreement
      registDate : '', //registDate
      unregistDate : '',//unregistDate
      updatedDate : '',//updatedDate
      userId :  "Guest",//userId
      isGuest : true, //isGuest
      joinType : '',//joinType
      nickName : '',//nickName
      userMaxToken :guestMaxToken,//userMaxToken
      userRetryLimitSec : guestRetryLimitSec//userRetryLimitSec
    });
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 100);
    setIsOpenLogoutModal(false)
  }

  return (
    <Flex zIndex="100" w={'auto'} alignItems="center" justifyContent={'flex-end'} flexDirection="row" flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'} p="10px">
     {/*  <Button
        value={"dark-mode"} aria-label='' aria-labelledby='nonexistent' variant="no-hover" bg="transparent" p="0px"
        minW="unset" minH="unset" h="18px" w="max-content" onClick={toggleColorMode} id="button_toggle_mode" name="button_toggle_mode"
      >
        <Icon me="10px" h="18px" w="18px" color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
      </Button> */}
      <SidebarResponsive routes={routes} />
      {
        isOpenNoticeModal && (
          <NoticerModal
            isOpen={isOpenNoticeModal}
            setClose={() => setIsOpenNoticeModal(false)}
          />
        )
      }
      {
        isOpenLoginModal && (
          <LoginModal
            isOpen={isOpenLoginModal}
            setClose={() => setIsOpenLoginModal(false)}
          />
        )
      }
      {
        isOpenSetupModal && (   
          <Modal
            onClose={() => setIsOpenSetupModal(false)}
            finalFocusRef={reviewBtnRef}
            isOpen={isOpenSetupModal}
            scrollBehavior={'inside'}
            blockScrollOnMount={false}
            preserveScrollBarGap={true}
            trapFocus={false}
            size={'full'}
          >
            <ModalOverlay />
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
              <ModalHeader  padding="basePadding">{"Profile Settings"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                <ProfileSetting
                  isOpen={isOpenSetupModal}
                  setClose={() => setIsOpenSetupModal(false)}
                  setLogout={() => onHandleLogout()}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      }
      {        
        isOpenLogoutModal && (
          <Alert 
            AppName='AIGA'
            bodyContent='로그아웃 하시겠습니까? 기존대화는 초기화됩니다.'
            isOpen={isOpenLogoutModal}
            onClose={(bool) => setIsOpenLogoutModal(false)}
            onConfirm={() => onHandleLogout()}
            closeText='취소'
            confirmText='확인'
          />
        )
      }
    </Flex>
  );
}