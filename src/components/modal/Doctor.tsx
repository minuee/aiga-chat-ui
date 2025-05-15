'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { Rating } from 'react-simple-star-rating'
import { 
  Box,Flex,Drawer,DrawerBody,Button,useColorModeValue,DrawerOverlay,Text,DrawerContent,DrawerCloseButton,SkeletonCircle,SkeletonText,Divider,
  Card,CardHeader,CardBody,CardFooter,Heading,Icon,Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverArrow,PopoverBody,
  Stack,Progress,SimpleGrid,Textarea,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,Portal
 } from '@chakra-ui/react';

import Image from 'next/image';
import { MdInfoOutline,MdEdit } from 'react-icons/md';
import ProgressBar from '@/components/fields/ProgressBar';
import ListItem from '@/components/text/ListItem';
import DoctorAvatar from "@/assets/images/avatar0.png";
import mConstants from '@/utils/constants';
import ReviewDetail from '@/components/modal/ReviewDetail';
import RequestDoctor from '@/components/modal/RequestDoctor';
export interface DoctorModalProps extends PropsWithChildren {
  data : any;
}
const limintView = 3
function DoctorModal(props: DoctorModalProps) {
  const { data } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpenReview, setIsOpenReview] = React.useState(false);
  const [reviewData, setReviewData] = React.useState<any>(null);
  const formBtnRef = React.useRef<HTMLButtonElement>(null);
  const [isOpenRequestModal, setIsOpenRequestModal] = React.useState(false);
  const reviewBtnRef = React.useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const starColor = useColorModeValue('#0000ff', '#ffffff');
  const skeletonColor = useColorModeValue('white', 'navy.700');

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, [data]);

  const onHandleRegistReview = (data:any) => {
    console.log('data', data);
  }

  const onHandleRequestDoctor = (data:any) => {
    console.log('data', data);
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
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'}>
          <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} padding={'0 10px'} fontSize={'15px'}>
            <Text fontSize={'1.5em'}>의사명</Text>
            <Text fontSize={'1em'}>분당 서울대학교 병원 가정의학과 전문분야1, 전문분야2</Text>
          </Box>
          <Box display={'flex'} flex={1.5} justifyContent={'center'} alignItems={'center'}>
            <Image src={DoctorAvatar} alt="doctor" width={100} height={100} />
          </Box>
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} minHeight={'100px'}>
          <Button 
            colorScheme='blue' 
            variant='outline' 
            width={'183px'} 
            borderRadius={'10px'}
            onClick={() => window.open('https://www.snubh.org/member/login.do?prevURI=/reserve/onlineReserve.do')}
          >
            온라인 예약
          </Button>
          { ( isMobileOnly || process.env.NODE_ENV === 'development' ) && (
            <Button 
              colorScheme='blue' 
              variant='outline' 
              width={'183px'} 
              borderRadius={'10px'}
              onClick={() => window.open('tel:01062880183')}
            >
              전화 예약
            </Button>
          )}
        </Flex>
        <ListItem
          title="경력"
          content={["경력____1", "경력____2", "경력____3", "경력____4"]}
          limintView={limintView}
          marginTop={0}
        />
        <ListItem
          title="학력"
          content={["학력____1", "학력____2"]}
          limintView={limintView}
          marginTop={5}
        />
        <ListItem
          title="논문"
          content={["논문____1", "논문____2", "논문____3", "논문____4", "논문____5", "논문____6", "논문____7", "논문____8"]}
          limintView={limintView}
          marginTop={5}
        />

        <Flex display={'flex'} flexDirection={'column'}  padding={'0 10px'} mt={10}>
          <Box 
            display={'flex'} 
            flexDirection={'row'} 
            alignItems={'center'} 
            cursor={'pointer'} 
            onClick={() => setIsOpenRequestModal(true)}
          >
            <Box display={'flex'} alignItems={'center'} mr={1}>
              <Icon as={MdEdit} color={'green.600'} />
            </Box>
            <Text fontWeight={'bold'} color={'green.600'}>의사 정보 수정 요청 {">"} </Text> 
          </Box>
        </Flex>


        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={5}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Text fontWeight={'bold'} color={'green.600'}>AI 소셜리뷰</Text>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={'green.600'} />
                </PopoverTrigger>
                <PopoverContent bg={'white'}>
                  <PopoverHeader 
                    fontWeight='semibold'
                    backgroundColor={'gray.100'}
                  >
                    설명
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          
          <Divider orientation='horizontal' my={2}/>
          <SimpleGrid spacing={3} templateColumns='repeat(2, 1fr)'>
            <Card>
              <CardHeader>
                <Heading size='md'>4.5</Heading>
              </CardHeader>
              <CardBody>
                <Text>친절•배려</Text>
              </CardBody>
              
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>4.5</Heading>
              </CardHeader>
              <CardBody>
                <Text>치료 만족도</Text>
              </CardBody>
            
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>4.5</Heading>
              </CardHeader>
              <CardBody>
                <Text>쉽고 명쾌한 설명</Text>
              </CardBody>
            
            </Card>
            <Card>
              <CardHeader>
                <Heading size='md'>4.5</Heading>
              </CardHeader>
              <CardBody>
                <Text>추천 여부</Text>
              </CardBody>
              
            </Card>
          </SimpleGrid>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={10}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Text fontWeight={'bold'} color={'green.600'}>AIGA 리뷰</Text>
            <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
              <Popover placement='top-start'>
                <PopoverTrigger>
                  <Icon as={MdInfoOutline} color={'green.600'} />
                </PopoverTrigger>
                <PopoverContent bg={'white'}>
                  <PopoverHeader 
                    fontWeight='semibold'
                    backgroundColor={'gray.100'}
                  >
                    설명
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} minHeight={'100px'} width={'98%'}>
            <Box flex={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} height={'100%'}>
              <Flex flex={1} >
                <Rating initialValue={4.5} readonly size={20} fillColor={starColor} SVGstyle={{ display: 'inline' }} />
              </Flex>
              <Flex flex={1} >
              <Text fontSize={'2em'} color={'blue.500'}>5.0</Text>
              </Flex>
            </Box>
            <Box flex={2} display={'flex'} flexDirection={'column'}  alignItems={'center'} justifyContent={'flex-end'} padding={'0 10px'}>
              <Box display={'flex'} flexDirection={'row'}  alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'}>친절•배려</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='12px' width={'100%'} value={80} borderRadius={'0px'} bg={'#cccccc'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'12px'}>40%</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'}>치료 만족도</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='12px' width={'100%'} value={20} borderRadius={'0px'} bg={'#cccccc'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'12px'}>20%</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'}>쉬운 설명</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='12px' width={'100%'} value={20} borderRadius={'0px'} bg={'#cccccc'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'12px'}>20%</Text>
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'}   alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                <Box flex={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} pr={'15px'}>
                  <Text fontSize={'13px'}>추천 의향</Text>
                </Box>
                <Box flex={2}>
                  <ProgressBar colorScheme='blue' height='12px' width={'100%'} value={20} borderRadius={'0px'} bg={'#cccccc'} />
                </Box>
                <Box flex={1} padding={'0 5px'}>
                  <Text fontSize={'12px'}>20%</Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider orientation='horizontal' my={2}/>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'13px'}>닉네임</Text>
            <Text fontSize={'12px'} color={'gray.500'}>YYYY.MM.DD</Text>
            <Box>
              <Textarea readOnly variant={'outline'} value={'리뷰 내용'} isDisabled resize={'none'}  size={'sm'} />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'99%'} 
              borderRadius={'10px'}
              onClick={() => setIsOpenReview(true)}
            >
              리뷰쓰기
            </Button>
          </Box>
        </Flex>
        <Box height={'100px'} />
        {
          isOpenReview && (
            <Portal>
            <Modal
              onClose={() => setIsOpenReview(false)}
              finalFocusRef={formBtnRef}
              isOpen={isOpenReview}
              scrollBehavior={'inside'}
              //blockScrollOnMount={false}
              //preserveScrollBarGap={true}
              //trapFocus={false} 
              //allowPinchZoom={true}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader>{"의사 리뷰"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto" maxH="100vh">
                  <ReviewDetail
                    isOpen={isOpenReview}
                    setClose={() => setIsOpenReview(false)}
                    onHandleRegistReview={(data:any) => onHandleRegistReview(data)}
                    reviewData={reviewData}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
            </Portal>
          )
        }
        {
          isOpenRequestModal && (   
            <Portal> 
            <Modal
              onClose={() => setIsOpenRequestModal(false)}
              finalFocusRef={reviewBtnRef}
              isOpen={isOpenRequestModal}
              scrollBehavior={'inside'}
              blockScrollOnMount={false}
              preserveScrollBarGap={true}
              trapFocus={false}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader>{"의사정보 수정 요청"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto" maxH="100vh">
                  <RequestDoctor
                    isOpen={isOpenRequestModal}
                    setClose={() => setIsOpenRequestModal(false)}
                    onHandleRegistReview={(data:any) => onHandleRequestDoctor(data)}
                    doctorId={'1'}
                   />
                </ModalBody>
              </ModalContent>
            </Modal>
            </Portal>
          )
        }
      </>
    )
  }
}


export default DoctorModal;
