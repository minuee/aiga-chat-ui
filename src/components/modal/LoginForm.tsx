'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Drawer,DrawerBody,Text,useColorModeValue,DrawerOverlay,useDisclosure,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';

import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';

import HeadTitle from './Title';
import LoginScreen from '@/components/signup/LoginScreen';
import JoinScreen from '@/components/signup/JoinScreen';
import functions from '@/utils/functions';

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

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  
  React.useEffect(() => {
    console.log("isLoading",isOpen,isLoading)
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [isOpen]);
  
  const onClickJoin = (str:string) => {
    console.log('onClickJoin : ', str);
    setLoginForm({
      socialType : str
    });
  }

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
          maxW="450px"
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
          <DrawerBody maxW="450px" px="0rem" pb="10" height="100%" backgroundColor="white">
            
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Box width='calc( 100% - 20px)' padding='10px' height='100%'>
                {
                  (  ['naver','kakao','aiga'].includes(loginForm.socialType) ) 
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
                    />
                  )
                }
              </Box>
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default LoginModal;
