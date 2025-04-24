'use client';
import React, { PropsWithChildren } from 'react';
import { signInWithCredentials } from '@/serverActions/login';
import { signIn } from 'next-auth/react';

// chakra imports
import { 
  Box,Flex,Drawer,DrawerBody,Icon,useColorModeValue,DrawerOverlay,useDisclosure,DrawerContent,DrawerCloseButton,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import HeadTitle from './Title';
import functions from '@/utils/functions';

export interface NoginModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

const items = [
  { idx: 1, title: "First Item", text: "Some value 1..." },
  { idx: 2, title: "Second Item", text: "Some value 2..." },
  { idx: 3, title: "Third Item", text: "Some value 3..." },
  { idx: 4, title: "Third Item", text: "Some value 3..." },
  { idx: 5, title: "Third Item", text: "Some value 3..." },
]

function NoticerModal(props: NoginModalProps) {
  const { isOpen, setClose } = props;
  const [ isLoading, setLoading] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');

  React.useEffect(() => {
    console.log("isLoading",isOpen,isLoading)
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [isOpen]);
  

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const user_email = e.target.email.value;
    const user_password = e.target.password.value;
    if ( !functions.isEmpty(user_email) && !functions.isEmpty(user_password) ) {
      const result:any = await signIn('aiga_credentials', { 
        user_email,
        user_password,
        //callbackUrl: '/chat', // 로그인 성공 후 리다이렉션 할 URL
        redirect: false,
      });
      console.log('result',result);
      if (result?.ok) {
        // 로그인 성공 처리
        
        // 사용자에게 오류 메시지 표시 등 추가 처리
      } else {
        // 로그인 실패시 
        console.log(result.error);
        // 예: router.push('/chat');
      }
    }
  };
  // SIDEBAR
  return (
    <Box display={{ base: 'block', xl: 'block' }} position="fixed" minH="100%">
      <Drawer
        isOpen={isOpen}
        onClose={setClose}
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
          <HeadTitle title="로그인" />
          <DrawerCloseButton
            zIndex="3"
            onClick={setClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="450px" px="0rem" pb="10" height="100%" backgroundColor="gray.200">
            
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Box width='calc( 100% - 20px)' padding='10px' height='100%'>
              <Flex
                  flexDirection="column"
                  width="100%"
                  height="100%"
                  backgroundColor="gray.200"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Stack
                    flexDir="column"
                    pt="10"
                    mb="2"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Avatar bg="teal.500" />
                    <Heading color="teal.400">Welcome</Heading>
                    <Box minW={{ base: "80%", md: "408px" }}>
                      {/* <form onSubmit={async (e) => {
                        e.preventDefault(); // 기본 폼 제출 방지
                        const formData = new FormData(e.currentTarget); // FormData 생성
                        await signInWithCredentials(formData); // 함수 호출
                      }}> */}
                      <form onSubmit={handleSubmit}>
                        <Stack
                          spacing={4}
                          p="1rem"
                          backgroundColor="whiteAlpha.900"
                          boxShadow="md"
                        >
                          <FormControl>
                            <InputGroup>
                              <InputLeftElement
                                pointerEvents="none"
                                children={<CFaUserAlt color="gray.300" />}
                              />
                              <Input type="email" placeholder="email address" name="email" />
                            </InputGroup>
                          </FormControl>
                          <FormControl>
                            <InputGroup>
                              <InputLeftElement
                                pointerEvents="none"
                                color="gray.300"
                                children={<CFaLock color="gray.300" />}
                              />
                              <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                              />
                              <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                  {showPassword ? "Hide" : "Show"}
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormHelperText textAlign="right">
                              <Link>forgot password?</Link>
                            </FormHelperText>
                          </FormControl>
                          <Button
                            borderRadius={0}
                            type="submit"
                            variant="solid"
                            colorScheme="teal"
                            width="full"
                          >
                            Login
                          </Button>
                        </Stack>
                      </form>
                    </Box>
                  </Stack>
                  <Box>
                    New to us?{" "}
                    <Link color="teal.500" href="#">
                      Sign Up
                    </Link>
                  </Box>
                </Flex>
              </Box>
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}


export default NoticerModal;
