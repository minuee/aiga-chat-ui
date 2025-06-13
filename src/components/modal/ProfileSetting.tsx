'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Icon,Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,FormControl,FormLabel,Input,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,useColorModeValue } from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import RequestForm from '@/components/modal/RequestForm';
import EntireForm from '@/components/modal/EntireForm';
import Alert from '@/components/alert/Alert';
import NoticerModal  from '@/components/modal/NoticeList';
import functions from '@/utils/functions';
//로그인 전역상태
import UserStateStore from '@/store/userStore';
import * as RequestService from "@/services/request/index";
import { MdOutlineClose,MdArrowBack,MdLogout } from 'react-icons/md';
import { ModalMypageNoticeStore,ModalMypageRequestStore,ModalMypageEntireStore } from '@/store/modalStore';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import { SkeletonDefaultMixed } from "@/components/fields/LoadingBar";
import avatar4 from '/public/img/avatars/myphoto.jpeg';
import { NextAvatar } from '@/components/image/Avatar';
import Image from 'next/image';
import IconNotice from "@/assets/icons/icon_notice.png";
import IconPolicy from "@/assets/icons/icon_policy.png";
import IconPerson from "@/assets/icons/icon_person.png";
import IconRequest from "@/assets/icons/icon_request.png";
import IconDetail from "@/assets/icons/BiChevronRight.png";

export interface ProfileSettingModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function ProfileSettingModal(props: ProfileSettingModalProps) {
  const { isOpen, setClose } = props;

  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { nickName, ...userInfo } = UserStateStore(state => state);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);

  
  const { isOpenNoticeListModal } = ModalMypageNoticeStore(state => state);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const { isOpenMypageRequestModal } = ModalMypageRequestStore(state => state);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const { isOpenEntireModal } = ModalMypageEntireStore(state => state);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);


  const reviewBtnRef = React.useRef<any>();
  const entireBtnRef = React.useRef<any>();
  const noticeBtnRef = React.useRef<any>();

  const toast = useToast();
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
  const buttonTextColor = useColorModeValue('white', '#2b8fff');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const [inputs, setInputs] = React.useState<any>({
    nickName: ''
  });

  React.useEffect(() => {
    setTimeout(() => {
      setInputs({
        ...inputs,
        nickName : nickName
      })
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  const onHandleSave = async() => {
    console.log("inputs", inputs)
    try{
      if ( !functions.isEmpty(inputs?.nickName) ) {
        setReceiving(true)
        const res:any = await RequestService.setNickname(inputs.nickName);
        console.log("res of setNickname",res)
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsOpenMypageRequestModal(false);
          setReceiving(false);
          toast({
            title: res?.message || "정상적으로 변경 되었습니다.",
            position: 'top-right',
            status: 'info',
            isClosable: true,
          });
        }          
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleRequestAction = async(datas: any) => {
    console.log("datas", datas)
    try{
      if ( !functions.isEmpty(datas?.title) && !functions.isEmpty(datas?.content) ) {
        setReceiving(true)
        const res:any = await RequestService.setRequest(datas);
        console.log("res of setRequest",res)
        if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
          setIsOpenMypageRequestModal(false);
          setReceiving(false);
          toast({
            title: res?.message || "정상적으로 처리 되었습니다.",
            position: 'top-right',
            status: 'info',
            isClosable: true,
          });
        }          
      }
    }catch(e:any){
      setReceiving(false)
      console.log("error of getNewSessionID",e)
    }
  }

  const onHandleEntireAction = (inputs: any) => {
    toast({
      title: "이용해 주셔서 감사합니다. 정상적으로 탈퇴처리 되었습니다.",
      position: 'top-right',
      status: 'info',
      isClosable: true,
    });
    setIsOpenEntireModal(false);
    /* global logout */
    setIsOpenLogoutModal(false)
  }

  const onHandleLogout = () => {
    /* 여기서 전체 로그아웃을 처리한다 
    1. 세션제거
    2. Global State null 처리
    setLoginUserInfo(
      isState : boolean;
      userId: string;
      isGuest:boolean;
      joinType:string;
      nickName : string);
    */
    setLoginUserInfo(false,'',true,'',"Guest",0,0);
    setIsOpenLogoutModal(false)
  }

  const onHandleNickname = ( str: string ) => {
    console.log("onHandleNickname",str)
    if ( str == "" ) {
      setInputs({...inputs, nickName: str }) 
    }else if ( mConstants.nickNameAbleString.test(str)) { 
      setInputs({...inputs, nickName: str }) 
    }
  }

  const onSendNoticeListButton = async(  ) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_5}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5}`)
    setIsOpenNoticeListModal(true);
  }

  const fn_close_modal_mypage_notice = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenNoticeListModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_10}`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_10}`)
    }, 200);
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
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} mt={5}>
          <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} minHeight={'50px'} width={'100%'}>
            <Box flex={5} display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <NextAvatar h="48px" w="48px" src={avatar4} me="10px" />
              <Text fontSize={'17px'} fontWeight={'bold'}>minuee@kormedi.com</Text>
            </Box>
            <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} onClick={() => setIsOpenLogoutModal(true)}>
              <Icon as={MdLogout} width="20px" height="20px" color="inherit" />
            </Box>
          </Flex>
          
          <Flex display={'flex'} flexDirection={'column'} minHeight={'50px'}  my={5} bg='#fafbfd' borderRadius={'10px'}>
            <Box padding="20px">
              <FormControl variant="floatingLabel">
                <FormLabel>닉네임<span style={{color: 'red'}}>(필수)</span></FormLabel>
                <Input 
                  type="text" 
                  isRequired
                  name='nickName'
                  value={inputs.nickName}
                  placeholder='닉네임을 입력해주세요' 
                  onChange={(e) => onHandleNickname(e.target.value)}
                  id="input_nickName"
                  bgColor='#ffffff'
                />
                <FormLabel fontSize={'13px'} color="#7f879b" mt={2}>
                최소 2자, 최대 10자(한글,영문,숫자,밑줄(_)만 가능
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
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} bg='#fafbfd' borderRadius={'10px'}>
            <Box padding="20px">
              <FormControl variant="floatingLabel">
                <FormLabel>고객지원</FormLabel>
              </FormControl>
            </Box>              
            <Flex justifyContent={'center'} flexDirection={'column'} pb="20px">
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px">
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendNoticeListButton()} cursor={'pointer'}>
                  <Image 
                    src={IconNotice}
                    alt="IconNotice"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                  <Text fontSize={'15px'} ml={2}>공지사항</Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendNoticeListButton()} cursor={'pointer'}>
                  <Image 
                    src={IconDetail}
                    alt="IconDetail"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} >
                  <Image 
                    src={IconPolicy}
                    alt="IconPolicy"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                  <Text fontSize={'15px'} ml={2}>이용약관</Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1}>
                  <Image 
                    src={IconDetail}
                    alt="IconDetail"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} >
                  <Image 
                    src={IconPerson}
                    alt="IconPerson"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                  <Text fontSize={'15px'} ml={2}>개인정보 처리방침</Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1}>
                  <Image 
                    src={IconDetail}
                    alt="IconDetail"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} width={'100%'} px="20px" mt={5}>
                <Box display={'flex'} alignItems={'center'} flex={5} onClick={() => onSendMyPageRequestButton()} cursor={'pointer'}>
                  <Image 
                    src={IconRequest}
                    alt="IconRequest"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                  <Text fontSize={'15px'} ml={2}>의견 보내기</Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} flex={1} onClick={() => onSendMyPageRequestButton()} cursor={'pointer'}>
                  <Image 
                    src={IconDetail}
                    alt="IconDetail"
                    style={{width:'20px',objectFit: 'contain',maxWidth:"20px"}}
                  />
                </Box>
              </Box>
              
            </Flex>
          </Flex>

          <Flex 
            display={'flex'} 
            height={'50px'} 
            width="100%"
            position={'absolute'}
            right={0}
            bottom={0}
            justifyContent={'flex-end'}
            onClick={() => onSendMyPageEntireButton()} 
            cursor={'pointer'}
            pr="20px"
          >
            <Text fontSize={'17px'} fontWeight={'normal'} textDecoration={'underline'} color='#5c5e69'>탈퇴하기</Text>
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
              <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box 
                      flex={1} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_request()} 
                      cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'none', md:'flex'}} 
                      alignItems={'center'} 
                      >
                      <Text color={'white'} noOfLines={1}>의견 보내기</Text>
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      justifyContent={'flex-end'}
                    >
                      <Text color={'white'} noOfLines={1}>의견 보내기</Text>
                    </Box>
                    <Box 
                      flex={1} 
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'}
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_request()} 
                      cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                {/* <ModalCloseButton color={colorBtnColor} /> */}
                <ModalBody overflowY="auto" maxH="100vh">
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
              <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box 
                      flex={1} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_entire()} 
                      cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'none', md:'flex'}} 
                      alignItems={'center'} 
                      >
                      <Text color={'white'} noOfLines={1}>회원탈퇴</Text>
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      justifyContent={'flex-end'}
                    >
                      <Text color={'white'} noOfLines={1}>회원탈퇴</Text>
                    </Box>
                    <Box 
                      flex={1} 
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'}
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_entire()} 
                      cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh">
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
                <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box 
                      flex={1} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_notice()} 
                      cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'none', md:'flex'}} 
                      alignItems={'center'} 
                      >
                      <Text color={'white'} noOfLines={1}>공지사항</Text>
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      justifyContent={'flex-end'}
                    >
                      <Text color={'white'} noOfLines={1}>공지사항</Text>
                    </Box>
                    <Box 
                      flex={1} 
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'}
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_mypage_notice()} 
                      cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh">
                  <NoticerModal
                    isOpen={isOpenNoticeListModal}
                    setClose={() => fn_close_modal_mypage_notice()}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
      </>
    )
  }
}

export default ProfileSettingModal;