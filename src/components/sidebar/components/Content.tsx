'use client';
// chakra imports
import { Box,Button,Flex,Icon,Menu,MenuButton,Stack,Text,useColorModeValue,Card,CardBody,StackDivider,useDisclosure,SkeletonCircle,SkeletonText } from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { format } from 'date-fns';
//   Custom components
import avatar4 from '/public/img/avatars/myphoto.jpeg';
import { NextAvatar } from '@/components/image/Avatar';
import Alert from '@/components/alert/Alert';

import Brand from '@/components/sidebar/components/Brand';
import React, { useRef } from 'react';

import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineMoreVert, MdOutlineSettings } from 'react-icons/md';
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
  const [historyData, setHistoryData] = React.useState(mockupHistoryData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor2 = useColorModeValue('gray.500', 'white');
  const confirmRef = useRef();
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);

  React.useEffect(() => {
    setHistoryData(mockupHistoryData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const onDeleteHistory = (historyId: number) => {
    console.log('onDeleteHistory', historyId);
    const newHistoryData = historyData.filter((item) => item.historyId !== historyId);
    setHistoryData(newHistoryData);
  }

  const onHandleUpdateTitle = (inputs: any) => {
    console.log('onHandleUpdateTitle', inputs);
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
      pt="20px"
      pb="40px"
      borderRadius="30px"
      w="100%"
      maxW={`${mConstants.modalMaxWidth-10}px`}
      px="20px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px" width={'100%'}>
        <Flex flexDirection={'column'} alignItems={'center'}  width={'100%'}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            width={'100%'} 
            maxWidth={`${mConstants.modalMaxWidth-50}px`} 
            borderRadius={'10px'}
            onClick={onOpen}
          >
            새 대화 
          </Button>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} width={'98%'} mt={5}>
            <Text fontSize={'15px'} color={textColor2}>
               {format(Date.now(), 'yyyy-MM-dd')}
            </Text>
          </Box>
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'200px'} maxHeight={'calc( 100vh - 200px )'} >
            {
              isLoading ? (
                <Box padding='6' boxShadow='lg' bg={skeletonColor} width={`${mConstants.modalMaxWidth-50}px`}>
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='4' width={'100%'}  />
                </Box>
              )
              :
              <Card bg={bgColor}>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    {historyData.map((item, index) => (
                      <HistoryItem 
                        key={index} 
                        data={item} 
                        onDeleteHistory={onDeleteHistory} 
                        onHandleUpdateTitle={onHandleUpdateTitle}
                      />
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            }
          </Flex>
        </Flex>
      </Stack>

      <Flex mt="8px" justifyContent="center" alignItems="center" boxShadow={shadowPillBar} borderRadius="30px" p="14px">
        <NextAvatar h="34px" w="34px" src={avatar4} me="10px" />
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
          minuee@kormedi.com
        </Text>
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
          >
            <Flex align="center" justifyContent="center">
              <Icon as={MdOutlineSettings} width="18px" height="18px" color="inherit" />
            </Flex>
          </MenuButton>
        </Menu>
        <Button
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>

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
