'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,FormControl,FormLabel,Input,useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,useColorModeValue } from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import RequestForm from '@/components/modal/RequestForm';
import EntireForm from '@/components/modal/EntireForm';
import Alert from '@/components/alert/Alert';
import NoticerModal  from '@/components/modal/Notice';
import functions from '@/utils/functions';
//로그인 전역상태
import UserStateStore from '@/store/userStore';
import * as RequestService from "@/services/request/index";

export interface ProfileSettingModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function ProfileSettingModal(props: ProfileSettingModalProps) {
  const { isOpen, setClose } = props;

  const setLoginUserInfo = UserStateStore((state) => state.setUserState);
  const { nickName, ...userInfo } = UserStateStore(state => state);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReceiving, setReceiving] = React.useState(false);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);
  const [isOpenRequestModal, setIsOpenRequestModal] = React.useState(false);
  const [isOpenEntireModal, setIsOpenEntireModal] = React.useState(false);
  const [isOpenNoticeModal, setIsOpenNoticeModal] = React.useState<boolean>(false);
  const reviewBtnRef = React.useRef<any>();
  const entireBtnRef = React.useRef<any>();
  const toast = useToast();
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('black', 'gray.700');
  const colorBtnColor = useColorModeValue('black', 'white');
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
          setIsOpenRequestModal(false);
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
          setIsOpenRequestModal(false);
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

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{

    return (
      <>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'14px'} fontWeight={'bold'}>minuee@kormedi.com</Text>
            <Button colorScheme='blue' variant='solid' size={'sm'} onClick={() => setIsOpenLogoutModal(true)} id="buttin_logout">
              로그아웃
            </Button>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}  my={5}>
            <Box>
              <FormControl variant="floatingLabel">
                <FormLabel>닉네임<span style={{color: 'red'}}>*</span></FormLabel>
                <Input 
                  type="text" 
                  isRequired
                  name='nickName'
                  value={inputs.nickName}
                  placeholder='닉네임을 입력해주세요 (필수)' 
                  onChange={(e) => setInputs({...inputs, nickName: e.target.value})}
                  id="input_nickName"
                />
              </FormControl>
            </Box>              
            <Box mt={5} display={'flex'} justifyContent={'center'}>
              <Button colorScheme='blue' variant='solid' size={'md'} width={'50%'} minWidth={'100px'} borderRadius={'5px'} onClick={() => onHandleSave()} id="button_save">
                저장
              </Button>
            </Box>
          </Flex>
          <Divider orientation='horizontal' my={2}/>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} mt={5}>
            <Text fontSize={'16px'} fontWeight={'bold'}>고객지원</Text>
            <Box my={2}>
              <Box onClick={() => setIsOpenNoticeModal(true)} cursor={'pointer'}>
                <Text fontSize={'14px'} fontWeight={'normal'} lineHeight={'2em'}>공지사항</Text>
              </Box>
              <Text fontSize={'14px'} fontWeight={'normal'} lineHeight={'2em'}>이용약관</Text>
              <Text fontSize={'14px'} fontWeight={'normal'} lineHeight={'2em'}>개인정보 처리방침</Text>
              <Box onClick={() => setIsOpenRequestModal(true)} cursor={'pointer'}>
                <Text fontSize={'14px'} fontWeight={'normal'} lineHeight={'2em'}>의견 보내기</Text>
              </Box>
            </Box>
          </Flex>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} mt={5} onClick={() => setIsOpenEntireModal(true)} cursor={'pointer'}>
            <Text fontSize={'13px'} fontWeight={'normal'} textDecoration={'underline'}>탈퇴하기</Text>
          </Flex>
        </Flex>
        <Box height={'100px'} />
        {
          isOpenRequestModal && (   
            <Modal
              onClose={() => setIsOpenRequestModal(false)}
              finalFocusRef={reviewBtnRef}
              isOpen={isOpenRequestModal}
              scrollBehavior={'inside'}
              blockScrollOnMount={false}
              preserveScrollBarGap={true}
              trapFocus={false}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader borderBottom={'1px solid #e0e0e0'}>{"의견 보내기"}</ModalHeader>
                <ModalCloseButton color={colorBtnColor} />
                <ModalBody overflowY="auto" maxH="100vh">
                  <RequestForm
                    isOpen={isOpenRequestModal}
                    setClose={() => setIsOpenRequestModal(false)}
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
              onClose={() => setIsOpenEntireModal(false)}
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
                <ModalHeader borderBottom={'1px solid #e0e0e0'}>{"탈퇴하기"}</ModalHeader>
                <ModalCloseButton color={colorBtnColor} />
                <ModalBody overflowY="auto" maxH="100vh">
                  <EntireForm
                    isOpen={isOpenEntireModal}
                    setClose={() => setIsOpenEntireModal(false)}
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
          isOpenNoticeModal && (
            <NoticerModal
              isOpen={isOpenNoticeModal}
              setClose={() => setIsOpenNoticeModal(false)}
            />
          )
        }
      </>
    )
  }
}

export default ProfileSettingModal;