'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Icon,Box,Flex,Button,Text,FormControl,FormLabel,Input,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,useColorModeValue } from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import RequestForm from '@/components/modal/RequestForm';
import EntireForm from '@/components/modal/EntireForm';
import YakwanContent from '@/components/modal/YakwanContent';
import PolicyContent from '@/components/modal/PolicyContent'
import Alert from '@/components/alert/Alert';
import CustomAlert from '@/components/alert/CustomAlert';
import NoticerModal  from '@/components/modal/NoticeList';
import functions from '@/utils/functions';
import NextImage from 'next/legacy/image';
import * as RequestService from "@/services/request/index";
import * as MemberService from "@/services/member/index";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
//로그인 전역상태
import UserStateStore from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import ConfigInfoStore from '@/store/configStore';
import { ModalMypageNoticeStore,ModalMypageRequestStore,ModalMypageEntireStore,ModalMypagePolicyStore,ModalMypageYakwanStore,ModalMypageNoticeDetailStore } from '@/store/modalStore';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { SkeletonDefaultMixed } from "@/components/fields/LoadingBar";
import { DefaultProfile } from '@/components/icons/svgIcons';
import { NextAvatar } from '@/components/image/Avatar';
import Image from 'next/image';
import { MdOutlineClose,MdArrowBack,MdLogout } from 'react-icons/md';
import { BiDetail,BiInfoCircle,BiGroup,BiEdit,BiChevronRight } from "react-icons/bi";
import { iconAlertEntire } from "@/components/icons/IconImage"
import { text } from 'stream/consumers';

export interface ProfileSettingModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  setLogout : () => void;
}

function ProfileSettingModal(props: ProfileSettingModalProps) {
  const { isOpen, setClose,setLogout } = props;

  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { ...userBaseInfo } = UserStateStore(state => state);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);
  const [isOpenAlert, setOpenAlert] = React.useState(false);  
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const { isOpenNoticeListModal } = ModalMypageNoticeStore(state => state);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const { isOpenMypageRequestModal } = ModalMypageRequestStore(state => state);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const { isOpenEntireModal } = ModalMypageEntireStore(state => state);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);
  const { isOpenPolicyModal } = ModalMypagePolicyStore(state => state);
  const setIsOpenPolicyModal = ModalMypagePolicyStore((state) => state.setIsOpenPolicyModal);
  const { isOpenYakwanModal } = ModalMypageYakwanStore(state => state);
  const setIsOpenYakwanModal = ModalMypageYakwanStore((state) => state.setIsOpenYakwanModal);
  const { isOpenNoticeDetailModal } = ModalMypageNoticeDetailStore(state => state);
  const setIsOpenNoticeDetailModal = ModalMypageNoticeDetailStore((state) => state.setIsOpenNoticeDetailModal);
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);

  const reviewBtnRef = React.useRef<any>();
  const entireBtnRef = React.useRef<any>();
  const noticeBtnRef = React.useRef<any>();
  const policyBtnRef = React.useRef<any>();
  const yakwanBtnRef = React.useRef<any>();

  const toast = useToast();
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const bgColor = useColorModeValue('white', 'navy.800');
  const buttonBgColor = useColorModeValue('#2b8fff', 'navy.500');
  const buttonTextColor = useColorModeValue('white', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const profileBgColor = useColorModeValue('#FAFBFD', 'navy.900');
  const iconColor = useColorModeValue('#7F879B','white');
  const iconExitColor = useColorModeValue('#000000','white');
  const textRedcolor = useColorModeValue('#F94848','#F94848');
  const inputBgcolor = useColorModeValue('#ffffff','navy.700');
  const textColor2 = useColorModeValue('#7F879B','white');
  const textColor3 = useColorModeValue('#212127','white');
  const entireTextColor = useColorModeValue('#5C5E69','white')

  const [inputs, setInputs] = React.useState<any>({
    nickName: ''
  });

  React.useEffect(() => {
    setTimeout(() => {
      setInputs({
        ...inputs,
        nickName : userBaseInfo?.nickName
      })
      setIsLoading(false);
    }, 60);
  }, [isOpen]);

  const onHandleSave = async() => {
    try{
      const regex = mConstants.nickNameAbleString;
      if (!regex.test(inputs.nickName)) {
        toast({
          title: "닉네임은 한글, 영문, 숫자, 언더스코어만 가능해요!",
          position: 'top-right',
          status: 'success',
          containerStyle: {
            color: '#ffffff',
          },
          isClosable: true,
          duration:1500
        });
        return;
      }
      if ( !functions.isEmpty(inputs?.nickName) ) {
        setReceiving(true)
        const res:any = await MemberService.setNickname(inputs.nickName);
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsOpenMypageRequestModal(false);
          setLoginUserInfo({
            ...userBaseInfo,
            nickName : inputs.nickName
          })
          setReceiving(false);
          toast({
            title: res?.message || "정상적으로 변경 되었습니다.",
            position: 'top-right',
            status: 'success',
            containerStyle: {
              color: '#ffffff',
            },
            isClosable: true,
            duration:1500
          });
        }          
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleRequestAction = async(datas: any) => {
    try{
      if ( !functions.isEmpty(datas?.title) && !functions.isEmpty(datas?.content) ) {
        setReceiving(true)
        const res:any = await RequestService.setRequest(datas);
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsOpenMypageRequestModal(false);
          setReceiving(false);
          toast({
            title: res?.message || "정상적으로 처리 되었습니다.",
            position: 'top-right',
            status: 'success',
            containerStyle: {
              color: '#ffffff',
            },
            isClosable: true,
          });
        }          
      }
    }catch(e:any){
      setReceiving(false)
    }
  }

  const onHandleEntireAction = async(inputs: any) => {

    try{
      if ( !functions.isEmpty(userBaseInfo?.userId) ) {
        setReceiving(true)
        const res:any = await MemberService.setMemberEntire();
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setOpenAlert(true)
          setReceiving(false);
          
        }else{
          toast({
            title: res?.message || "처리중 오류가 발생하였습니다. 잠시후에 다시 이용해주십시요",
            position: 'top-right',
            status: 'error',
            containerStyle: {
              color: '#ffffff',
            },
            isClosable: true,
            duration:1500
          });
          setReceiving(false);
        }        
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleAlertConfirm = () => {
    onHandleLogout();
  }

  const onHandleLogout = async() => {
    if ( process.env.NODE_ENV == 'development') {
      onHandleLogoutAction(); 
      return;
    }
    try{
      if ( !functions.isEmpty(userBaseInfo?.userId) ) {
        setReceiving(true)
        const res:any = await MemberService.setMemberLogout();
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          onHandleLogoutAction(); 
        }else{
          if ( res?.message?.statusCode == '401') {
            setReceiving(false);
            onHandleLogoutAction(); 
          }else{
            toast({
              title: res?.message || "처리중 오류가 발생하였습니다.",
              position: 'top-right',
              status: 'error',
              containerStyle: {
                color: '#ffffff',
              },
              isClosable: true,
              duration:1500
            });
          }
        }        
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleLogoutAction = () => {
    /* 여기서 전체 로그아웃을 처리한다 
    1. 세션제거
    2. Global State null 처리
    */
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
    mCookie.removeCookie(mConstants.apiTokenName)
    setIsOpenLogoutModal(false)
    setLogout();
    setNewChatOpen(false);
    setTimeout(() => {
      setNewChatOpen(true);
    }, 60);
  }

  const onHandleNickname = ( str: string ) => {
    setInputs({...inputs, nickName: str }) 
  }

  const onSendNoticeListButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_5}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5}`)
    setIsOpenNoticeListModal(true);
  }

  const fn_close_modal_mypage_notice = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    if ( isOpenNoticeDetailModal ) {
      setIsOpenNoticeDetailModal(false);
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_5}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5}`)
      }, 200);
    }else{
      setIsOpenNoticeListModal(false);
      router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
      setTimeout(() => {
        mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
      }, 200);
    }
  }

  const onSendMyPageRequestButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_6}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_6}`)
    setIsOpenMypageRequestModal(true);
  }

  const fn_close_modal_mypage_request = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenMypageRequestModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    }, 200);
  }

  const onSendMyPageEntireButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_7}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_7}`)
    setIsOpenEntireModal(true);
  }

  const fn_close_modal_mypage_entire = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenEntireModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    }, 200);
  }

  const onSendMypagePolicyButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_9}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_9}`)
    setIsOpenPolicyModal(true);
  }

  const fn_close_modal_mypage_policy = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenPolicyModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    }, 200);
  }

  const onSendMypageYakwanButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_8}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_8}`)
    setIsOpenYakwanModal(true);
  }

  const fn_close_modal_mypage_yakwan = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenYakwanModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    }, 200);
  }

  if ( isLoading ) {
    return (
      <SkeletonDefaultMixed
        isOpen={isLoading}
        lineNum={4}
      />
    )
  }else{

    return (
      <>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}>
          <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} minHeight={'50px'} width={'100%'}>
            <Box flex={5} display={'flex'} flexDirection={'row'} alignItems={'center'}>
            {
              functions.isEmpty(userBaseInfo?.profileImage) 
              ?
              <DefaultProfile boxSize={'48px'} />
              :
              <NextImage 
                src={userBaseInfo?.profileImage}
                alt="프로필이미지"
                style={{ borderRadius: '50%', objectFit: 'cover' }} 
                width={34} 
                height={34}
              />
            }
              <Box pl="10px">
                <CustomTextBold700 color={textColor} fontSize="17px" me="10px">
                  {userBaseInfo?.email}
                </CustomTextBold700>
              </Box>
            </Box>
            <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} onClick={() => setIsOpenLogoutModal(true)} cursor={'pointer'}>
              <Icon as={MdLogout} width="20px" height="20px" color={iconExitColor} />
            </Box>
          </Flex>
          
          <Flex display={'flex'} flexDirection={'column'} minHeight={'50px'}  my={5} bg={profileBgColor} borderRadius={'10px'}>
            <Box padding="20px">
              <FormControl variant="floatingLabel">
                <FormLabel color={textColor} flexDirection={'row'}>
                <CustomTextBold700 color={textColor} fontSize="17px">닉네임<span style={{ color: textRedcolor, fontSize: '13px',paddingLeft:"10px" }}>(필수)</span></CustomTextBold700>
                </FormLabel>
                <Input 
                  type="text" 
                  isRequired
                  name='nickName'
                  value={inputs.nickName}
                  placeholder='닉네임을 입력해주세요' 
                  onChange={(e) => onHandleNickname(e.target.value)}
                  color={textColor}
                  id="input_nickName"
                  bgColor={inputBgcolor}
                />
                <FormLabel fontSize={'13px'} color="#7f879b" mt={2}>
                <CustomTextBold400 color={textColor2} fontSize="13px">최소 2자, 최대 10자(한글,영문,숫자,밑줄(_)만 가능</CustomTextBold400>
                </FormLabel>
              </FormControl>
            </Box>              
            <Box display={'flex'} justifyContent={'center'} pb="20px">
              <Button 
                colorScheme='blue' 
                bgColor={inputs.nickName?.length < 2 ? "#ccc" : buttonBgColor}
                color={buttonTextColor}
                variant='solid' 
                size={'md'} 
                width={'98px'} minWidth={'98px'} 
                borderRadius={'5px'} 
                onClick={() => onHandleSave()} 
                id="button_save"
              >
                저장하기
              </Button>
            </Box>
          </Flex>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} bg={profileBgColor} borderRadius={'10px'}>
            <Box padding="20px">
              <FormControl variant="floatingLabel">
                <FormLabel><CustomTextBold700 color={textColor} fontSize="17px">고객지원</CustomTextBold700></FormLabel>
              </FormControl>
            </Box>              
            <Flex justifyContent={'center'} flexDirection={'column'} pb="20px">
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px">
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendNoticeListButton()} cursor={'pointer'}>
                  <Icon as={BiDetail} width="20px" height="20px" color={iconColor} />
                  <CustomTextBold400 fontSize={'17px'} ml={2} color={textColor3}>공지사항</CustomTextBold400>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendNoticeListButton()} cursor={'pointer'}>
                  <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendMypageYakwanButton()} cursor={'pointer'}>
                  <Icon as={BiInfoCircle} width="20px" height="20px" color={iconColor} />
                  <CustomTextBold400 fontSize={'17px'} ml={2} color={textColor3}>이용약관</CustomTextBold400>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendMypageYakwanButton()} cursor={'pointer'}>
                  <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor}/>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendMypagePolicyButton()} cursor={'pointer'}>
                  <Icon as={BiGroup} width="20px" height="20px" color={iconColor} />
                  <CustomTextBold400 fontSize={'17px'} ml={2} color={textColor3}>개인정보 처리방침</CustomTextBold400>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendMypagePolicyButton()} cursor={'pointer'}>
                  <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendMyPageRequestButton()} cursor={'pointer'}>
                  <Icon as={BiEdit} width="20px" height="20px" color={iconColor} />
                  <CustomTextBold400 fontSize={'17px'} ml={2} color={textColor3}>의견 보내기</CustomTextBold400>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendMyPageRequestButton()} cursor={'pointer'}>
                  <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Flex 
            display={'flex'} height={'50px'} width="100%" position={'absolute'} right={0} bottom={0} justifyContent={'flex-end'}
            onClick={() => onSendMyPageEntireButton()} cursor={'pointer'} pr="20px"
          >
            <CustomTextBold400 fontSize={'17px'} textDecoration={'underline'} color={entireTextColor}>탈퇴하기</CustomTextBold400>
          </Flex>
        </Flex>
        <Box height={'100px'} />
        {
          isOpenMypageRequestModal && (   
            <Modal
              onClose={() => fn_close_modal_mypage_request()}
              finalFocusRef={reviewBtnRef}
              isOpen={isOpenMypageRequestModal}
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
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_request()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>의견 보내기</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_request()}  cursor={'pointer'}
                    >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                  <RequestForm
                    isOpen={isOpenMypageRequestModal}
                    setClose={() => fn_close_modal_mypage_request()}
                    onHandleRequest={(inputs) => onHandleRequestAction(inputs)}
                    isReceiving={isReceiving}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
        {
          isOpenEntireModal && (   
            <Modal
              onClose={() => fn_close_modal_mypage_entire()}
              finalFocusRef={entireBtnRef}
              isOpen={isOpenEntireModal}
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
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_entire()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>회원탈퇴</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_entire()}  cursor={'pointer'}
                    >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0">
                  <EntireForm
                    isOpen={isOpenEntireModal}
                    setClose={() => fn_close_modal_mypage_entire()}
                    onHandleEntire={(inputs) => onHandleEntireAction(inputs)}
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
              bodyContent='로그아웃 하시겠습니까?'
              isOpen={isOpenLogoutModal}
              onClose={(bool) => setIsOpenLogoutModal(false)}
              onConfirm={() => onHandleLogout()}
              closeText='취소'
              confirmText='확인'
            />
          )
        }
        {
          isOpenNoticeListModal && (
            <Modal
              onClose={() => fn_close_modal_mypage_notice()}
              finalFocusRef={noticeBtnRef}
              isOpen={isOpenNoticeListModal}
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
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_notice()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>공지사항</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_notice()}  cursor={'pointer'}
                    >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0" bg={bgColor}>
                  <NoticerModal
                    isOpen={isOpenNoticeListModal}
                    setClose={() => fn_close_modal_mypage_notice()}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
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
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_policy()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>개인정보 처리방침</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
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
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}}  alignItems={'center'}  
                      onClick={() => fn_close_modal_mypage_yakwan()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>이용약관</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0}width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
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
          isOpenAlert && (
            <CustomAlert 
              isShowAppname={false}
              AppName='AIGA'
              bodyContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px">
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                    <NextImage
                      width="106"
                      height="90"
                      src={iconAlertEntire}
                      alt={'doctor1'}
                    />
                  </Box>
                  <Flex width={"100%"}  flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minHeight={"60px"}>
                    <CustomText fontSize={'17px'} color="#212127" lineHeight={'200%'}>회원 탈퇴가 완료되었습니다.</CustomText>
                    <CustomText fontSize={'17px'} color="#212127" lineHeight={'200%'}>24시간 이후 재가입 부탁드립니다.</CustomText>
                  </Flex>
                </Flex>
              }
              isOpen={isOpenAlert}
              onClose={() => setOpenAlert(false)}
              onConfirm={() => onHandleAlertConfirm()}
              closeText='취소'
              confirmText='확인'
              footerContent={
                <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px" width={"100%"}>
                  <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#2B8FFF" borderRadius={'6px'} onClick={() => onHandleAlertConfirm()} cursor={'pointer'}>
                    <CustomTextBold700 fontSize={'16px'} color="#ffffff">확인</CustomTextBold700>
                  </Box>
                </Flex>
              }
            />
          )
        }
      </>
    )
  }
}

export default ProfileSettingModal;