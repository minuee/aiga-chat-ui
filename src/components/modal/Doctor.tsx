'use client';
import React, { PropsWithChildren } from 'react';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
// chakra imports
import { StarIcon } from '@chakra-ui/icons';
import { 
  Box,Flex,Drawer,DrawerBody,Button,useColorModeValue,DrawerOverlay,Text,DrawerContent,DrawerCloseButton,SkeletonCircle,SkeletonText,Divider,
  Card,CardHeader,CardBody,CardFooter,Heading,Icon,Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverArrow,PopoverBody,
  Stack,Progress,SimpleGrid,Textarea
 } from '@chakra-ui/react';
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Image from 'next/image';
import { MdInfoOutline } from 'react-icons/md';
import { FULLStarContainer, HalfStarContainer } from '@/components/icons/Star';
import ProgressBar from '@/components/fields/ProgressBar';
import ListItem from '@/components/text/ListItem';
import DoctorAvatar from "@/assets/images/avatar0.png";

export interface DoctorModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}
const limintView = 3
function DoctorModal(props: DoctorModalProps) {
  const { isOpen, setClose } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [expandedCount, setExpandedCount] = React.useState<any>(limintView);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log('isMobile', isMobile);
    }, 2000);
  }, [isOpen]);

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg='white'>
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
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={'0 10px'} mt={10}>
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
            <Box flex={1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
              <Box display={'flex'} flexDirection={'row'} mb={5}  alignItems={'flex-start'}>
                <Box position={'relative'} width={'20px'}>
                  <FULLStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="blue" />
                  </FULLStarContainer>
                </Box>
                <Box position={'relative'} width={'20px'}>
                  <FULLStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="blue" />
                  </FULLStarContainer>
                </Box>
                <Box position={'relative'} width={'20px'}>
                  <FULLStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="blue" />
                  </FULLStarContainer>
                </Box>
                <Box position={'relative'} width={'20px'}>
                  <FULLStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="blue" />
                  </FULLStarContainer>
                <Box position={'relative'} width={'20px'}>
                  <FULLStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="blue" />
                  </FULLStarContainer>
                </Box></Box>
                <Box position={'relative'} width={'20px'}>
                  <HalfStarContainer >
                    <StarIcon color="blue" />
                    <StarIcon color="white" stroke="gray" />
                  </HalfStarContainer>
                </Box>
              </Box>
              <Text fontSize={'2em'} color={'blue.500'}>4.5</Text>
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
            >
              리뷰쓰기
            </Button>
          </Box>
        </Flex>
        <Box height={'100px'} />
      </>
    )
  }
}


export default DoctorModal;
