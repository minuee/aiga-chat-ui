'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { 
    Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,FormControl,FormLabel,Input,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useColorModeValue
} from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import RequestForm from '@/components/modal/RequestForm';
import EntireForm from '@/components/modal/EntireForm';
export interface ProfileSettingModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function ProfileSettingModal(props: ProfileSettingModalProps) {
  const { isOpen, setClose } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = React.useState(false);
  const [isOpenRequestModal, setIsOpenRequestModal] = React.useState(false);
  const [isOpenEntireModal, setIsOpenEntireModal] = React.useState(false);
  const confirmRef = React.useRef<any>();
  const reviewBtnRef = React.useRef<any>();
  const entireBtnRef = React.useRef<any>();
  const toast = useToast();
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('black', 'gray.700');
  const colorBtnColor = useColorModeValue('black', 'white');
  const [inputs, setInputs] = React.useState<any>({
    nickname: ''
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  const onHandleSave = () => {
    console.log(inputs);
    toast({
      title: "이미 사용중인 닉네임입니다.",
      position: 'top-right',
      status: 'info',
      isClosable: true,
    });
  }

  const onHandleEntireAction = (inputs: any) => {
    console.log(inputs);
    toast({
      title: "정상적으로 등록되었습니다. 의견 주셔서 감사합니다.",
      position: 'top-right',
      status: 'info',
      isClosable: true,
    });
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
            <Button colorScheme='blue' variant='solid' size={'sm'} onClick={() => setIsOpenLogoutModal(true)}>
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
                  name='nickname'
                  value={inputs.nickname}
                  placeholder='닉네임을 입력해주세요 (필수)' 
                  onChange={(e) => setInputs({...inputs, nickname: e.target.value})}
                />
              </FormControl>
            </Box>              
            <Box mt={5} display={'flex'} justifyContent={'center'}>
              <Button colorScheme='blue' variant='solid' size={'md'} width={'50%'} minWidth={'100px'} borderRadius={'5px'} onClick={() => onHandleSave()}>
                저장
              </Button>
            </Box>
          </Flex>
          <Divider orientation='horizontal' my={2}/>
          <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} mt={5}>
            <Text fontSize={'16px'} fontWeight={'bold'}>고객지원</Text>
            <Box my={2}>
              <Text fontSize={'14px'} fontWeight={'normal'} lineHeight={'2em'}>공지사항</Text>
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
                    onHandleEntire={(inputs) => onHandleEntireAction(inputs)}
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
        <AlertDialog
          isOpen={isOpenLogoutModal}
          leastDestructiveRef={confirmRef as any}
          onClose={() => setIsOpenLogoutModal(false)}
          size={'sm'}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent backgroundColor='white'>
              <AlertDialogHeader fontSize='lg' fontWeight='bold' borderBottom={'1px solid #e0e0e0'} color={textColor}>
                AIGA
              </AlertDialogHeader>

              <AlertDialogBody minHeight={'50px'} py={5} color={textColor}>
                로그아웃 하시겠습니까?
              </AlertDialogBody>
             
              <AlertDialogFooter>
                <Button ref={confirmRef as any} onClick={() => setIsOpenLogoutModal(false)} color={textColor}>
                  취소
                </Button>
                <Button colorScheme='red' onClick={() => setIsOpenLogoutModal(false)} ml={3} color={textColor}>
                  확인
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
}


export default ProfileSettingModal;
