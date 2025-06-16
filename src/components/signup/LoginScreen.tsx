'use client';
import React, { PropsWithChildren } from 'react';
import { signIn } from 'next-auth/react';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import Image from "next/image";
import { MdCoPresent } from "react-icons/md";
// chakra imports
import { Box,Flex,Text,Heading,Input,Button,InputGroup,Stack,InputLeftElement,chakra,Divider,Link,Avatar,FormControl,FormHelperText,InputRightElement,Spinner,useToast } from '@chakra-ui/react';
import { FaUserAlt, FaLock } from "react-icons/fa";
import UserStateStore from '@/store/userStore';
import ConfigInfoStore from '@/store/configStore';

import BaseImage from "@/assets/images/img-login.png";
import IconKakao from "@/assets/icons/ico-kakao.png";
import IconNaver from "@/assets/icons/ico-naver.png";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}
import functions from '@/utils/functions';
import * as mCookie from "@/utils/cookies";

import KakaoButtom from "@/assets/images/login/kakao_login.png";
import NaverButtom from "@/assets/images/login/naver_login.png";

export interface LoginScreenProps extends PropsWithChildren {
  onClickJoin  : (str:string) => void;
  onClcikClose : (str:string) => void;
  isProduction : boolean
}

function LoginScreen(props: LoginScreenProps) {
  const { onClickJoin,isProduction = false } = props;
  const [ isLoading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();
  const { location, error } = useGeoLocation(geolocationOptions)
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    toast.closeAll();
    setLoading(true);
    setTimeout(async () => {
      const user_email = e.target.email.value;
      const user_password = e.target.password.value;

      const locale = mCookie.getCookie('currentLocale'); 
      if ( !functions.isEmpty(user_email) && !functions.isEmpty(user_password) ) {
        setLoginUserInfo(
          true,
          user_email,
          false,
          'aiga',
          '아이가',
          userMaxToken,
          userRetryLimitSec
        )
        setLoading(false);
        props.onClcikClose('');
        /* const result:any = await signIn('credentials', { 
          user_email,
          user_password,
          callbackUrl: `/${locale || 'ko'}/chat`, // 로그인 성공 후 리다이렉션 할 URL
          redirect: false,
        });
        console.log('result',result);
        setLoading(false)
        if (result?.ok) {
          // 로그인 성공 처리
          setLoginUserInfo(
            true,
            user_email,
            false,
            'aiga',
            '아이가',
            userMaxToken,
            userRetryLimitSec
          )
          // 사용자에게 오류 메시지 표시 등 추가 처리
        } else {
          toast({
            title: "login Fail",
            position: 'top-left',
            status: 'info',
            isClosable: true,
          });
          // 로그인 실패시 
          console.log(result.error);
          // 예: router.push('/chat');
        } */
      }
    }, 1500)
  };

  if ( isProduction ) {
    return (
      <Flex flexDirection="column" width="100%" height="100%" justifyContent="flex-start" alignItems="center">
        <Stack flexDir="column" pt="10" mb="2" width="100%" height="100%" justifyContent="center" alignItems="center">
          <Box display={'flex'} flexDirection={'column'} flex={2} alignItems={'center'}>
            <Text color="#17191D" fontSize={"21px"} fontWeight={'bold'} lineHeight={"150%"}>AIGA 로그인</Text>
            <Text color="#7F879B" fontSize={"16px"} lineHeight={"200%"}>SNS 계정으로 편리하게 AIGA를 시작하세요</Text>
            <Image 
                src={BaseImage}
                alt="BaseImage"
                style={{width:'200px',objectFit: 'contain',maxWidth:"200px"}}
            />
          </Box>
          
          <Box display='flex' flex={1} flexDirection={'column'} w={"100%"} minW={"100%"} justifyContent={'flex-end'}> 
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('kakao')} bg='#F9DF32' py="10px" mb="10px">
                <Image 
                  src={IconKakao}  
                  alt="kakao" 
                  style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                /> 
                <Text color="#212127" fontSize={"16px"} pl="10px">카카오톡 로그인</Text>
              </Box>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('naver')} bg='#1EC800' py="10px">
                <Image 
                  src={IconNaver}  
                  alt="naver" 
                  style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                /> 
                <Text color="#ffffff" fontSize={"16px"} pl="10px">네이버 로그인</Text>
              </Box>
    
           
          </Box>
        </Stack>
      </Flex>       
    );
  }
  // SIDEBAR
  return (
    <Flex flexDirection="column" width="100%" height="100%" backgroundColor="gray.200" justifyContent="flex-start" alignItems="center">
      <Stack flexDir="column" pt="10" mb="2" width="100%" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "80%", md: "408px" }}>    
          <form onSubmit={handleSubmit}>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" placeholder="email address" name="email" id="input_email" />
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
                    id="input_password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText> */}
              </FormControl>
              <Button borderRadius={0} type="submit" variant="solid" colorScheme="teal" width="full">
                {isLoading ? <Spinner size='xs' /> : "Login"}
              </Button>
              <Divider orientation='horizontal' />
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('aiga')}>
                <Button leftIcon={<MdCoPresent />} colorScheme='blue' variant='outline' width={'183px'} borderRadius={'10px'} id="button_join">
                  AIGA 회원가입
                </Button>
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('kakao')}>
                  <Image 
                    src={KakaoButtom}  
                    alt="kakao" 
                    style={{width:'183px', height:'45px',borderRadius:'10px',objectFit: 'cover'}}
                  /> 
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} onClick={() => onClickJoin('naver')}>
                  <Image 
                    src={NaverButtom}  
                    alt="naver" 
                    style={{ width:'183px', height:'45px',borderRadius:'10px',objectFit: 'cover'}}
                  /> 
                </Box>
              </Stack>
          </form>
        </Box>
      </Stack>
      <Box display={isProduction ? 'none' : 'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Text>{`위도 : ${location?.latitude}`}</Text>
        <Text>{`경도 : ${location?.longitude}`}</Text>
      </Box>
    </Flex>       
  );
}

export default LoginScreen;