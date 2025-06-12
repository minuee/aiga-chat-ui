'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { 
  Box,Flex,Text,SkeletonCircle,SkeletonText,Tag,TagLabel, useColorModeValue,Stack,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,Icon,
  Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverArrow,PopoverBody,TagLeftIcon,
} from '@chakra-ui/react';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import DoctorItems from "@/components/text/DoctorItem";
import NextImage from 'next/legacy/image';
import functions from '@/utils/functions';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import mConstants from '@/utils/constants';
import DoctorDetail  from '@/components/modal/Doctor';
import { ModalDoctorDetailStore,DoctorFromListStore } from '@/store/modalStore';

import { MdArrowBack,MdInsertEmoticon,MdOutlineClose } from 'react-icons/md';
import { TbBook2 } from "react-icons/tb";
import { BsGeoAlt } from "react-icons/bs";
import Image from 'next/image';
import IconSearch from "@/assets/icons/img-search.png";

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}

import { loadingImage } from "@/components/icons/IconImage"

const mockupDoctors = [
  {
    doctor_id : 1,
    doctor_name : "홍길동",
    profileimgurl : "",
    hospitalName : "활빈대학교병원",
    depthName : "정신의학과",
    speciality : "불면증,자기망상"
  },
  {
    doctor_id : 2,
    doctor_name : "홍길순",
    profileimgurl : "https://avatars.githubusercontent.com/u/0?v=4",
    hospitalName : "단군대학교병원",
    depthName : "가정의학과",
    speciality : "불면증,자기망상"
  },
  {
    doctor_id : 3,
    doctor_name : "홍길동",
    profileimgurl : "https://avatars.githubusercontent.com/u/0?v=3",
    hospitalName : "활빈대학교병원",
    depthName : "내과",
    speciality : "간경화,기타등등"
  }
]

export interface DoctorListModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  doctorData : any;
}

function DoctorListModal(props: DoctorListModalProps) {
  
  const { isOpen, setClose, doctorData } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);

  const { isOpenDoctorModal } = ModalDoctorDetailStore(state => state);
  const setIsOpenDoctorModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const { isFromDoctorDepth2 } = DoctorFromListStore(state => state);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReLoading, setIsReLoading] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
  const [inputs, setInputs] = React.useState<any>({
    sortType : 'all',
    latitude : null,
    longitude : null
  });
  const [doctors, setDoctors] = React.useState<any>([]);
  const [showGradient, setShowGradient] = React.useState(true);
  const isDark = useColorModeValue(false, true);
  const { location, error } = useGeoLocation(geolocationOptions)
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('white', 'navy.700')
  const tabSelectedBgColor = useColorModeValue('blue.100', 'green')
  const tabDefaultBgColor = useColorModeValue('gray.300', 'white');
  const tabSelectedTextColor = useColorModeValue('white', 'white')
  const tabDefaultTextColor = useColorModeValue('gray.500', 'white');
  const haederBgColor = useColorModeValue('white', 'navy.700');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const textColor2 = useColorModeValue('black', 'gray.700');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const flexRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if ( ( scrollLeft + clientWidth +100 ) >= scrollWidth ) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };
  
  React.useEffect(() => {
    setDoctors(mockupDoctors)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  React.useEffect(() => {
    try{
      if ( !functions.isEmpty( location?.latitude && location?.longitude )) {
        setInputs({
          ...inputs,
          latitude : location?.latitude,
          longitude : location?.longitude
        })
      }
    }catch(e){
      console.log("location eror",e)
    }
  }, [location]);

  const makeBgColor = (sortType:string = 'all') => {
    if ( sortType == inputs.sortType ) {
      return tabSelectedBgColor;
    }else{
      return tabDefaultBgColor
    }
  }

  const makeTextColor = (sortType:string = 'all') => {
    if ( sortType == inputs.sortType ) {
      return tabSelectedTextColor;
    }else{
      return tabDefaultTextColor
    }
  }

  const onHandleSortChange  = ( sortType:string) => {
    if ( sortType !== inputs.sortType ) {
      setIsReLoading(true);
      setDoctors([
        ...doctors,
        {
          doctor_id : doctors.length + 1,
          doctor_name : "장무기",
          profileimgurl : "",
          hospitalName : "무당대학교병원",
          depthName : "재활의학과",
          speciality : "재활"
        },
      ])
      setInputs({
        ...inputs,
        sortType
      })
      setTimeout(() => {
        setIsReLoading(false);
      },1000)
    }
  }

  React.useEffect(() => {
    const flexElement = flexRef.current;
    if (flexElement) {
      flexElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (flexElement) {
        flexElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const fn_close_modal_doctor_detail = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setIsOpenDoctorModal(false);
    router.replace(`/${locale}/chat#${mConstants.pathname_modal_1}`);
    setTimeout(() => {
      setFromDoctorDepth2(false)
      mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`)
    }, 200);
  }

  const onSendDoctorButton = async( data : any ) => {
    setSelectedDoctor(data);
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_2_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_2_2}`)
    setFromDoctorDepth2(true)
    setIsOpenDoctorModal(true);
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
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          {
            isReLoading && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
                <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                  <NextImage
                      width="100"
                      height="100"
                      src={loadingImage}
                      alt={'doctor1'}
                  />
                  <Text color="#ffffff">Data Processing!!!</Text>
                </Box>
              </Flex>
            )
          }
          <Stack
            position='absolute' left={"0"} top={"65px"} width="100%"
            sx={{
              '&::after': {
                content: showGradient ? '""' : 'none', 
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50px',
                height: '100%',
                background:  isDark ? 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0  , 1) 100%)' : 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
                pointerEvents: 'none', // 클릭 이벤트 방지
              },
            }}
          >
            <Flex 
              width={"100%"} 
              padding="15px 20px"
              flexDirection={'row'} alignItems={'center'} 
              fontSize={'14px'} minHeight={"40px"} 
              borderBottom={"1px solid #ccc"} zIndex={1000} 
              bg={isReLoading ? "transparent" : haederBgColor}
              opacity={ isReLoading ? 0.7 : 1}
              overflowX={'auto'} 
              whiteSpace="nowrap"
              ref={flexRef} 
            >
              <Tag
                size={'lg'}
                borderRadius='full'
                px={5}
                variant='solid'
                bg={makeBgColor('all')}
                onClick={() => onHandleSortChange('all')}
                cursor={'pointer'}
                flexShrink="0"
              >
                <TagLabel color={makeTextColor('all')}>
                  전체
                </TagLabel>
              </Tag>
              <Tag
                size={'lg'}
                borderRadius='full'
                px={5}
                ml={2}
                variant='solid'
                bg={makeBgColor('experience')}
                onClick={() => onHandleSortChange('experience')}
                cursor={'pointer'}
                flexShrink="0"
              >
                <TagLeftIcon boxSize='17px' as={MdInsertEmoticon} color={makeTextColor('experience')} />
                <TagLabel color={makeTextColor('experience')}>환자 경험</TagLabel>
              </Tag>
              <Tag
                size={'lg'}
                borderRadius='full'
                px={5}
                ml={2}
                variant='solid'
                bg={makeBgColor('score')}
                onClick={() => onHandleSortChange('score')}
                cursor={'pointer'}
                flexShrink="0"
              >
                <TagLeftIcon boxSize='17px' as={TbBook2} color={makeTextColor('score')} />
                <TagLabel color={makeTextColor('score')}>논문 스코어</TagLabel>
              </Tag>
              {
                ( functions.isEmpty(inputs.latitude) && functions.isEmpty(inputs.longitude) ) ? 
                (
                  <Tag
                    size={'lg'}
                    borderRadius='full'
                    px={5}
                    ml={2}
                    variant='solid'
                    bg={makeBgColor('distance')}
                    onClick={() => onHandleSortChange('distance')}
                    cursor={'pointer'}
                    flexShrink="0"
                  >
                    <TagLeftIcon boxSize='17px' as={BsGeoAlt} color={makeTextColor('distance')} />
                    <TagLabel color={makeTextColor('distance')}>거리순</TagLabel>
                  </Tag>
                )
                :
                (
                  <Tag
                    size={'lg'}
                    borderRadius='full'
                    px={5}
                    ml={2}
                    variant='solid'
                    bg={makeBgColor('distance')}
                    onClick={() => console.log("dddd")}
                    cursor={'pointer'}
                    flexShrink="0"
                  >
                    <TagLeftIcon boxSize='17px' as={BsGeoAlt} color={makeTextColor('distance')} />
                    <TagLabel color={textColor}>
                    <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
                      <Popover placement='top-start'>
                        <PopoverTrigger>
                          <Text color={makeTextColor('distance')}>거리순<span style={{color: 'red'}}>*</span></Text>
                        </PopoverTrigger>
                        <PopoverContent bg={'white'}>
                          <PopoverHeader 
                            fontWeight='semibold'
                            backgroundColor={'gray.100'}
                            color={textColor2}
                          >
                            <Text color={textColor2} fontSize={"15px"}>안내</Text>
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverBody width={"100%"}>
                            <Text 
                              color={textColor2} 
                              fontSize={"13px"}
                              isTruncated // 긴 텍스트를 말줄임 처리
                              noOfLines={2} // 또는 여러 줄로 제한하고 싶을 경우
                              wordBreak="break-word" // 단어 단위 줄바꿈
                              whiteSpace="normal" // 줄바꿈 허용
                            >
                              자신의 위치정보를 수락하지 않을 경우 거리순으로 조회가 되지 않습니다.
                            </Text>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    </TagLabel>
                  </Tag>
                )
              }
              <Tag width="40px" border="0px" backgroundColor={"transparent"}></Tag>
            </Flex>
          </Stack>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'200px'}  pt={10} overflowY={'auto'} justifyContent={'center'} alignItems={'center'}>
          <Image 
            src={IconSearch}
            alt="IconSearch"
            style={{width:'26px',objectFit: 'contain',maxWidth:"26px"}}
          />
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt="20px">
            <Text color='#7F879B' fontSize={'17px'}>조회된 결과가 없습니다.</Text>
          </Box>
        </Flex>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}  pt={10} overflowY={'auto'}>
          {
            doctors.map((item:any,index:number) => {
              return (
                <Box key={index}>
                  <DoctorItems
                    data={item}
                    onSendDoctorButton={(data,ismode)=>{onSendDoctorButton(data);}}
                  />
                </Box>
              )
            })
          }
        </Flex>
        <Box height={'50px'} />
        {
          isOpenDoctorModal && (
            <Modal
              onClose={() => fn_close_modal_doctor_detail()}
              isOpen={isOpenDoctorModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1}>
                <ModalHeader bg={navbarBg}>
                  <Flex flexDirection={'row'}>
                    <Box 
                      flex={1} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_doctor_detail()} 
                      cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="20px" height="20px" color="white" />
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'none', md:'flex'}} 
                      alignItems={'center'} 
                     >
                      <Text color={'white'} noOfLines={1}>{"{의사명} 교수"}</Text>
                    </Box>
                    <Box 
                      flex={3} 
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'} 
                      justifyContent={'flex-end'}
                    >
                      <Text color={'white'} noOfLines={1}>{"{의사명} 교수"}</Text>
                    </Box>
                    <Box 
                      flex={1} 
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'}
                      alignItems={'center'} 
                      onClick={() => fn_close_modal_doctor_detail()} 
                      cursor={'pointer'}
                     >
                      <Icon as={MdOutlineClose} width="30px" height="30px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody >
                  <DoctorDetail
                    data={selectedDoctor}
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

export default DoctorListModal;