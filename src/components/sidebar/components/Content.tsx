'use client';
// chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  StackDivider,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  PopoverBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { format } from 'date-fns';
//   Custom components
import avatar4 from '/public/img/avatars/myphoto.jpeg';
import { NextAvatar } from '@/components/image/Avatar';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import React, { useRef } from 'react';

import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineMoreVert, MdOutlineSettings } from 'react-icons/md';
import mConstants from '@/utils/constants';
//새창열기 전역상태
import NewChatStateStore from '@/store/newChatStore';

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { routes, setApiKey } = props;  
  const { isOpen, onOpen, onClose } = useDisclosure()
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
  const textColor2 = useColorModeValue('gray.500', 'white');
  const confirmRef = useRef();
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
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
      <Stack direction="column" mb="auto" mt="8px">
        <Flex flexDirection={'column'} alignItems={'center'}>
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
          <Flex flexDirection={'column'} justifyContent={'flex-start'} minHeight={'200px'} maxHeight={'calc( 100vh - 200px )'} overflowY={'auto'} width={'100%'} >
            <Card bg={bgColor}>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <Box position={'relative'}>
                      <Heading size='xs' textTransform='uppercase'>
                        2025-05-05
                      </Heading>
                      <Text pt='2' fontSize='sm' noOfLines={1}>
                        몸이 너무너무 아픕네다
                      </Text>
                      <Box position={"absolute"} right={0} top={0} width={'20px'} height={'40px'}>
                        <Popover>
                          <PopoverTrigger>
                            <Icon as={MdOutlineMoreVert} width="18px" height="18px" color="inherit" />
                          </PopoverTrigger>
                          <PopoverContent width={'150px'} bg={bgColor}>
                            <PopoverArrow />
                            
                            <PopoverBody>
                              <Flex flexDirection={'column'}>
                                <Button>이름변경</Button>
                                <Button>삭제</Button>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                    </Box>
                    <Box position={'relative'}>
                      <Heading size='xs' textTransform='uppercase'>
                      2025-05-04
                      </Heading>
                      <Text pt='2' fontSize='sm' noOfLines={1}>
                        몸이 너무너무 아픕네다
                      </Text>
                      <Box position={"absolute"} right={0} top={3} width={'20px'} height={'40px'}>
                        <Popover>
                          <PopoverTrigger>
                            <Icon as={MdOutlineMoreVert} width="18px" height="18px" color="inherit" />
                          </PopoverTrigger>
                          <PopoverContent width={'150px'} bg={bgColor}>
                            <PopoverArrow />
                            
                            <PopoverBody>
                              <Flex flexDirection={'column'}>
                                <Button colorScheme='blue'>이름변경</Button>
                                <Button>삭제</Button>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                    </Box>
                    <Box position={'relative'}>
                      <Heading size='xs' textTransform='uppercase'>
                        2025-05-03
                      </Heading>
                      <Text pt='2' fontSize='sm' noOfLines={1}>
                        몸이 너무너무 아픕네다
                      </Text>
                      <Box position={"absolute"} right={0} top={3} width={'20px'} height={'40px'}>
                        <Popover>
                          <PopoverTrigger>
                            <Icon as={MdOutlineMoreVert} width="18px" height="18px" color="inherit" />
                          </PopoverTrigger>
                          <PopoverContent width={'150px'} bg={bgColor}>
                            <PopoverArrow />
                            
                            <PopoverBody>
                              <Flex flexDirection={'column'}>
                                <Button>이름변경</Button>
                                <Button>삭제</Button>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>

          </Flex>
        </Flex>
      </Stack>

      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={confirmRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent backgroundColor={bgColor}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              AIGA
            </AlertDialogHeader>

            <AlertDialogBody>
              새로운 대화로 이동하시겠습니까?
              이전 데이터는 히스토리를 통해 열람하실 수 있습니다.
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={confirmRef as any} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme='red' onClick={() => {setNewChatOpen(true);onClose()}} ml={3}>
                열기
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default SidebarContent;
