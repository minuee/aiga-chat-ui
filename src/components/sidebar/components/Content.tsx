'use client';
// chakra imports
import { Box,Button,Flex,Icon,Menu,MenuButton,Stack,Text,useColorModeValue,useDisclosure,SkeletonText, Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import { format } from 'date-fns';
import { HSeparator } from '@/components/separator/Separator';
//   Custom components
import avatar4 from '/public/img/avatars/myphoto.jpeg';
import { NextAvatar } from '@/components/image/Avatar';
import Alert from '@/components/alert/Alert';
import ProfileSetting from '@/components/modal/ProfileSetting';
import Brand from '@/components/sidebar/components/Brand';
import React, { useRef } from 'react';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSettings,MdArrowBack,MdLogout } from 'react-icons/md';
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';
import HistoryItem from '@/components/text/HistoryItem';

const mockupHistoryData = [
  {
    historyId: 1,
    createdAt: '2025-05-05',
    content: '몸이 너무너무 아픕네다',
  },
  {
    historyId: 2,
    createdAt: '2025-05-04',
    content: '수정된 제목입니다. 수정된 제목입니다.',
  },
  {
    historyId: 3,
    createdAt: '2025-05-04',
    content: 'The government of the people, by the people, for the people. a speech by Abraham Lincoln',
  },
  { 
    historyId: 4,
    createdAt: '2025-05-03',
    content: '空気読めない奴だな訳してKYな奴決して許せない。Qさまという番組は俺が一番好きな番組でござんす',
  },
]

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { onParentClose } = props;  
  const [ isLoading, setIsLoading] = React.useState(true);
  const [isOpenSetupModal, setIsOpenSetupModal] = React.useState<boolean>(false);

  const [historyData, setHistoryData] = React.useState(mockupHistoryData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue( '14px 17px 40px 4px rgba(112, 144, 176, 0.18)','14px 17px 40px 4px rgba(12, 44, 55, 0.18)' );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue( '4px 17px 40px 4px rgba(112, 144, 176, 0.08)','none' );
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor2 = useColorModeValue('gray.500', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const buttonBgColor = useColorModeValue('#2b8fff', 'white');
  const buttonTextColor = useColorModeValue('white', '#2b8fff');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = useRef();
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);

  React.useEffect(() => {
    setHistoryData(mockupHistoryData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const onDeleteHistory = (historyId: number) => {
    const newHistoryData = historyData.filter((item) => item.historyId !== historyId);
    setHistoryData(newHistoryData);
  }

  const onHandleUpdateTitle = (inputs: any) => {
    const newHistoryData = historyData.map((item) => {
      if (item.historyId === inputs.historyId) {
        return { ...item, content: inputs.content };
      }
      return item;
    });
    setHistoryData(newHistoryData);
  } 

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      //pt="20px"
      //pb="40px"
      borderRadius="30px"
      w="100%"
      maxW={`${mConstants.modalMaxWidth-10}px`}
      //px="20px"
    >
      <Brand />
      <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'} px="20px" my="10px">
        <Button 
          colorScheme='blue' 
          bgColor={buttonBgColor}
          color={buttonTextColor}
          variant='solid' 
          width={'100%'} 
          maxWidth={`${mConstants.modalMaxWidth-50}px`} 
          height={'48px'}
          borderRadius={'10px'}
          onClick={onOpen}
          id="button_new_dialig"
        >
          새 대화 
        </Button>
      </Flex>
      <Stack direction="column" mb="auto"  width={'100%'}  overflowY={'auto'} minHeight={'calc(100vh - 140px'}>
        <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'}>
         
          <HSeparator mt="20px" mb="20px" w="100%"  />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'100%'} mt={1} px="20px">
            <Text fontSize={'17px'} color={textColor2} fontWeight={'bold'}>
               {format(Date.now(), 'yyyy-MM-dd')}
            </Text>
          </Box>
          
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%"  px="20px">
            {
              isLoading ? (
                <Box padding='6' boxShadow='lg' bg={skeletonColor} width="100%" px="20px">
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='4' width={'100%'}  />
                </Box>
              )
              :
              <Stack spacing='2'>
                {historyData.map((item, index) => (
                  <HistoryItem 
                    key={index} 
                    data={item} 
                    onDeleteHistory={onDeleteHistory} 
                    onHandleUpdateTitle={onHandleUpdateTitle}
                  />
                ))}
              </Stack>
              }
          </Flex>

          <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'100%'} mt={1} px="20px">
            <Text fontSize={'17px'} color={textColor2} fontWeight={'bold'}>
               {format(Date.now()-1, 'yyyy-MM-dd')}
            </Text>
          </Box>
          
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width="100%" px="20px">
            {
              isLoading ? (
                <Box padding='6' boxShadow='lg' bg={skeletonColor} width="100%" maxWidth={`${mConstants.modalMaxWidth-50}px`}>
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='4' width={'100%'}  />
                </Box>
              )
              :
              <Stack spacing='2'>
                {historyData.map((item, index) => (
                  <HistoryItem 
                    key={index} 
                    data={item} 
                    onDeleteHistory={onDeleteHistory} 
                    onHandleUpdateTitle={onHandleUpdateTitle}
                  />
                ))}
              </Stack>
              }
          </Flex>
          <HSeparator mt="20px" mb="20px" w="calc( 100% - 40px )" px="20px" />
        </Flex>
      </Stack>

      <Flex 
        position={'fixed'}
        left={0}
        bottom={0}
        width='100%'
        maxWidth={`${mConstants.modalMaxWidth}px`}
        height={'80px'}
        alignItems="center" 
        justifyContent={'space-between'} 
        bg='#e9edf3' 
        px="20px"
      >
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <NextAvatar h="34px" w="34px" src={avatar4} me="10px" />
          <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
            민누이
          </Text>
        </Box>
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="transparent"
              aria-label=""
              border="1px solid"
              borderColor={borderColor}
              borderRadius="full"
              w="34px"
              h="34px"
              px="0px"
              p="0px"
              minW="34px"
              me="10px"
              justifyContent={'center'}
              alignItems="center"
              color={iconColor}
              onClick={()=> setIsOpenSetupModal(true)}
            >
              <Box display={'flex'} justifyContent={'center'} >
                <Icon as={MdOutlineSettings} width="20px" height="20px" color="inherit" />
              </Box>
            </MenuButton>
          </Menu>
        </Box>
      </Flex>
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
            <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000} margin={0} padding={0}>
              <ModalHeader bg={navbarBg}>
                <Flex flexDirection={'row'}>
                  <Box flex={1} display={'flex'} alignItems={'center'} onClick={() => setIsOpenSetupModal(false)} cursor={'pointer'}>
                    <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                  </Box>
                  <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Text color={'white'}>마이페이지</Text>
                  </Box>
                  <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                   
                  </Box>
                </Flex>
              </ModalHeader>
              <ModalBody overflowY="auto" maxH="100vh">
                <ProfileSetting
                  isOpen={isOpenSetupModal}
                  setClose={() => setIsOpenSetupModal(false)}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      }
      {
        isOpen && (
          <Alert 
            AppName='AIGA'
            bodyContent='새로운 대화로 이동하시겠습니까? 이전 데이터는 히스토리를 통해 열람하실 수 있습니다.'
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => {setNewChatOpen(true);onClose();onParentClose()}}
            closeText='취소'
            confirmText='열기'
          />
        )
      }
    </Flex>
  );
}

export default SidebarContent;
