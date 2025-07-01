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

import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { MdArrowBack,MdInsertEmoticon,MdOutlineClose } from 'react-icons/md';
import { TbBook2 } from "react-icons/tb";
import { BsGeoAlt } from "react-icons/bs";

import { IconSearch } from '@/components/icons/svgIcons';
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}
import ProcessingBar from '@/assets/icons/processing2x.gif';

export interface DoctorListModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  originDoctorData : any;
}

function DoctorListModal(props: DoctorListModalProps) {
  
  const { isOpen, setClose, originDoctorData } = props;
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
  const [inputs, setInputs] = React.useState({
    sortType : [],
    latitude : 0,
    longitude : 0
  });
  const [doctors, setDoctors] = React.useState([]);
  const [showGradient, setShowGradient] = React.useState(true);
  const isDark = useColorModeValue(false, true);
  const { location, error } = useGeoLocation(geolocationOptions)
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('white', 'white')
  const tabSelectedBgColor = useColorModeValue('blue.100', 'green')
  const tabDefaultBgColor = useColorModeValue('#DFE3EA', 'white');
  const tabSelectedTextColor = useColorModeValue('white', 'white')
  const tabDefaultTextColor = useColorModeValue('#5C5E69', 'navy.800');
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
    console.log("originDoctorData",originDoctorData)
    setDoctors(originDoctorData)
    setTimeout(() => {
      setIsLoading(false);
    }, 60);
  }, [isOpen,originDoctorData]);

  React.useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location]);

  const makeBgColor = (sortType: string = 'all') => {
    if (Array.isArray(inputs.sortType) && (inputs.sortType as string[]).includes(sortType)) {
      return tabSelectedBgColor;
    } else {
      return tabDefaultBgColor;
    }
  };

  const makeTextColor = (sortType: string = 'all') => {
    if (Array.isArray(inputs.sortType) && (inputs.sortType as string[]).includes(sortType)) {
      return tabSelectedTextColor;
    } else {
      return tabDefaultTextColor;
    }
  };

  const sortDoctors = async( doctorData: any,userLat: number,userLng: number, selectedCriteria:any ) => {
    if (selectedCriteria.length === 0) return doctorData;
  
    // 거리 포함 시 계산
    const withDistance = doctorData.map((doctor:any) => ({
      ...doctor,
      distance: functions.getDistance(userLat, userLng, doctor.lat, doctor.lon ),
    }));
  
    // 정규화용 min/max 계산
    const allValues = {
      experience: withDistance.map((d:any) => summaryRankSocre(d.doctor_score,'experience')),
      score: withDistance.map((d:any) => summaryRankSocre(d.doctor_score,'scroe')),
      distance: withDistance.map((d:any) => d.distance),
    };
  
    const minMax = {
      experience: [Math.min(...allValues.experience), Math.max(...allValues.experience)],
      score: [Math.min(...allValues.score), Math.max(...allValues.score)],
      distance: [Math.min(...allValues.distance), Math.max(...allValues.distance)],
    };
  
    const normalize = (value: number, min: number, max: number) => {
      if (max === min) return 1;
      return (value - min) / (max - min);
    };
  
    // 가중치 분배
    const weightPerCriterion = 1 / selectedCriteria.length;
  
    return withDistance.sort((a:any, b:any) => {
      const getScore = (doctor: typeof a) => {
        return selectedCriteria.reduce((acc:any, criterion:"experience" | "score" | "distance") => {
          let normalized = 0;
          const [min, max] = minMax[criterion];
  
          if (criterion === "distance") {
            normalized = 1 - normalize(doctor.distance, min, max); // 거리는 작을수록 높게
          } else {
            normalized = normalize(doctor[criterion], min, max);
          }
          return acc + normalized * weightPerCriterion;
        }, 0);
      };
  
      const scoreA = getScore(a);
      const scoreB = getScore(b);
  
      return scoreB - scoreA; // 높은 점수가 앞에 오게 내림차순
    });
  };

  const summaryRankSocre =  async(data:any, gubun:string) => {
    if ( gubun == 'score') {
      if ( !functions.isEmpty(data?.paper_score)){
        return data?.paper_score;
      }else {
        0
      }
    }else{
      if ( !functions.isEmpty(data?.patient_score)){
        return data?.patient_score;
      }else {
        0
      }
    }
  }
  
  const onHandleSortChange  = async(sortType: string = 'all') => {

    const isExist = ( Array.isArray(inputs.sortType) && (inputs.sortType as string[]).includes(sortType) ) ? true : false ;
    const updatedSortTypeList = isExist ? inputs.sortType.filter((item:any) => item !== sortType) : [...inputs.sortType, sortType]
    if (updatedSortTypeList.length === 0) {
      setDoctors(originDoctorData);
      setInputs({
        ...inputs,
        sortType: []
      });
      return;
    }
    
    const userLat = inputs?.latitude;
    const userLng = inputs?.longitude;

    setIsReLoading(true);
    const sorted = await sortDoctors(originDoctorData,userLat,userLng,updatedSortTypeList);
    setDoctors(sorted);
    setInputs((prev:any) => ({
      ...prev,
      sortType: updatedSortTypeList
    }));

    setTimeout(() => {
      setIsReLoading(false);
    },60)
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
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'} width="100%">
          {
            isReLoading && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
                <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                  <NextImage width="60" height="20" src={ProcessingBar} alt={'doctor1'}/>
                </Box>
              </Flex>
            )
          }
          <Stack
            position='absolute' left={"0"} top={"60px"} width="100%"
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
              width={"100%"} px="5px" flexDirection={'row'} alignItems={'center'} fontSize={'14px'} height={"64px"} borderBottom={"1px solid #ccc"} zIndex={1000} 
              bg={isReLoading ? "transparent" : haederBgColor} opacity={ isReLoading ? 0.7 : 1} overflowX={'auto'} whiteSpace="nowrap" ref={flexRef} 
            >
             {/*  <Tag size={'lg'} borderRadius='full' px={5} variant='solid' bg={makeBgColor('all')} flexShrink="0" onClick={() => onHandleSortChange('all')} cursor={'pointer'}>
                <TagLabel color={makeTextColor('all')}>
                  전체
                </TagLabel>
              </Tag> */}
              <Tag size={'lg'} borderRadius='full' px={5} ml={2} variant='solid' bg={makeBgColor('experience')} onClick={() => onHandleSortChange('experience')} cursor={'pointer'} flexShrink="0">
                <TagLeftIcon boxSize='17px' as={MdInsertEmoticon} color={makeTextColor('experience')} />
                <TagLabel color={makeTextColor('experience')}>
                  <CustomTextBold400 fontSize='15px' color={makeTextColor('experience')} letterSpacing={'-5%'}>환자 경험</CustomTextBold400>
                </TagLabel>
              </Tag>
              <Tag size={'lg'} borderRadius='full' px={5} ml={2} variant='solid' bg={makeBgColor('score')} onClick={() => onHandleSortChange('score')} cursor={'pointer'} flexShrink="0">
                <TagLeftIcon boxSize='17px' as={TbBook2} color={makeTextColor('score')} />
                <TagLabel color={makeTextColor('score')}>
                  <CustomTextBold400 fontSize='15px' color={makeTextColor('score')} letterSpacing={'-5%'}>논문 스코어</CustomTextBold400>
                </TagLabel>
              </Tag>
              {
                ( !functions.isEmpty(inputs.latitude) && !functions.isEmpty(inputs.longitude) ) ? 
                (
                  <Tag size={'lg'} borderRadius='full' px={5} ml={2} variant='solid' bg={makeBgColor('distance')} onClick={() => onHandleSortChange('distance')} cursor={'pointer'} flexShrink="0">
                    <TagLeftIcon boxSize='16px' as={BsGeoAlt} color={makeTextColor('distance')} />
                    <TagLabel color={makeTextColor('distance')}>
                      <CustomTextBold400 fontSize='15px' color={makeTextColor('distance')} letterSpacing={'-5%'}>거리순</CustomTextBold400>
                    </TagLabel>
                  </Tag>
                )
                :
                (
                  <Tag size={'lg'} borderRadius='full' px={5} ml={2} variant='solid' bg={makeBgColor('distance')} onClick={() => console.log("dddd")} cursor={'pointer'} flexShrink="0"
                  >
                    <TagLeftIcon boxSize='17px' as={BsGeoAlt} color={makeTextColor('distance')} />
                    <TagLabel color={textColor}>
                    <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
                      <Popover placement='top-start'>
                        <PopoverTrigger>
                          <CustomText color={makeTextColor('distance')}>거리순<span style={{color: 'red'}}>*</span></CustomText>
                        </PopoverTrigger>
                        <PopoverContent color='white' bg='#212127' borderColor='#212127'>
                          <PopoverHeader 
                            fontWeight='semibold'
                            bg='#212127'
                            color={textColor}
                          >
                            <CustomText color={textColor} fontSize={"15px"}>안내</CustomText>
                          </PopoverHeader>
                          <PopoverArrow bg='#212127' />
                          <PopoverBody width={"100%"}>
                            <CustomText 
                              color={textColor} 
                              fontSize={"13px"}
                              isTruncated // 긴 텍스트를 말줄임 처리
                              noOfLines={2} // 또는 여러 줄로 제한하고 싶을 경우
                              wordBreak="break-word" // 단어 단위 줄바꿈
                              whiteSpace="normal" // 줄바꿈 허용
                            >
                              자신의 위치정보를 수락하지 않을 경우 거리순으로 조회가 되지 않습니다.
                            </CustomText>
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
        {
          doctors?.length == 0 && (
          <Flex display={'flex'} flexDirection={'column'} minHeight={'200px'}  pt={10} overflowY={'auto'} justifyContent={'center'} alignItems={'center'}>
            <IconSearch boxSize={'26px'}/>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt="20px">
              <CustomText color='#7F879B' fontSize={'17px'}>조회된 결과가 없습니다.</CustomText>
            </Box>
          </Flex>
          )
        }
       {/*  <Flex display={'flex'} flexDirection={'column'} minHeight={'40px'}  pt={10}>
          <Box display={process.env.NODE_ENV == 'production' ? 'none' : 'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <CustomText color='#000000'>{`위도 : ${location?.latitude}`}</CustomText>
            <CustomText color='#000000'>{`경도 : ${location?.longitude}`}</CustomText>
          </Box>
        </Flex> */}
        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}  pt={10} overflowY={'auto'}>
          {
            doctors?.map((item:any,index:number) => {
              return (
                <Box key={index}>
                  <DoctorItems
                    data={item}
                    onSendDoctorButton={(data,ismode)=>{onSendDoctorButton(data);}}
                    inputs={inputs}
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
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_detail()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomTextBold700 color={'white'} noOfLines={1}>{selectedDoctor?.name} 교수</CustomTextBold700>
                    </Box>
                    <Box position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} 
                      alignItems={'center'}  onClick={() => fn_close_modal_doctor_detail()}  cursor={'pointer'}
                    >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody padding="basePadding" margin="0">
                  <DoctorDetail
                    selected_doctor={selectedDoctor}
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