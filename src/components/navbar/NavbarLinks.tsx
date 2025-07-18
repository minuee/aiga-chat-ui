'use client';
// Chakra Imports
import * as React from 'react';
import { Button,Flex,Icon,VisuallyHidden,useColorMode,useColorModeValue,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import NoticerModal  from '@/components/modal/NoticeList';
import LoginModal  from '@/components/modal/LoginForm';
import routes from '@/routes';
import ProfileSetting from '@/components/modal/ProfileSetting';
import mConstants from '@/utils/constants';
import Alert from '@/components/alert/Alert';

import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"
import { UserBasicInfoStore } from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';

export default function HeaderLinks(props: {secondary: boolean;}) {

  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();

  const resetUserBasicInfo = UserBasicInfoStore((state) => state.resetUserBasicInfo);
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const userBaseInfo = React.useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    const ret = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    return ret;
  }, [userStoreInfo]);

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

  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  
  
  const onHandleLogout = () => {
    resetUserBasicInfo();
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 300);
    setIsOpenLogoutModal(false)
  }

  return (
    <Flex zIndex="100" w={'auto'} alignItems="center" justifyContent={'flex-end'} flexDirection="row" flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'} p="10px">
      {
        ( process.env.NODE_ENV == 'development' || userBaseInfo?.email == 'minuee47@gmail.com' || userBaseInfo?.email == 'wjlee2002@naver.com' ) && (
          <Button
            value={"dark-mode"} aria-label='Toggle dark mode' aria-labelledby='nonexistent' variant="no-hover" bg="transparent" p="0px"
            minW="unset" minH="unset" h="18px" w="max-content" onClick={toggleColorMode} id="button_toggle_mode" name="button_toggle_mode"
          >
            <VisuallyHidden>Toggle dark mode</VisuallyHidden>
            <Icon me="10px" h="18px" w="18px" color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
          </Button>
        )
      }
      
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