'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { 
  Box,Flex,Text,SkeletonCircle,SkeletonText,Tag,TagLabel, useColorModeValue,Stack,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,Icon,
  Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverArrow,PopoverBody,
} from '@chakra-ui/react';
import DoctorItems from "@/components/text/DoctorItem";
import NextImage from 'next/legacy/image';
import functions from '@/utils/functions';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import mConstants from '@/utils/constants';
import DoctorDetail  from '@/components/modal/Doctor';
import { MdArrowBack } from 'react-icons/md';
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReLoading, setIsReLoading] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
  const [isOpenDoctorModal, setIsOpenDoctorModal] = React.useState<boolean>(false);
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
  const tabSelectedBgColor = useColorModeValue('green', 'green')
  const tabDefaultBgColor = useColorModeValue('gray', 'white');
  const haederBgColor = useColorModeValue('white', 'navy.700');
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const textColor2 = useColorModeValue('black', 'gray.700');

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
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          {
            isReLoading && (
              <Flex position='absolute' left={0} top={0} width='100%' height='100%' display={'flex'} justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7}>
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
            position='absolute' left={"20px"} top={"60px"} width="96%"
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
            <Box 
              display={"flex"}
              width={"calc( 100% - 40px)"} 
              flexDirection={'row'} alignItems={'center'} 
              fontSize={'14px'} minHeight={"40px"} 
              borderBottom={"1px solid #ccc"} zIndex={1000} 
              bg={isReLoading ? "transparent" : haederBgColor}
              opacity={ isReLoading ? 0.7 : 1}
              overflowX={'auto'} 
              whiteSpace="nowrap"
            >
              <Tag
                size={'lg'}
                borderRadius='full'
                px={5}
                variant='solid'
                colorScheme={makeBgColor('all')}
                onClick={() => onHandleSortChange('all')}
                cursor={'pointer'}
                flexShrink="0"
              >
                <TagLabel color={textColor}>
                  전체
                </TagLabel>
              </Tag>
              <Tag
                size={'lg'}
                borderRadius='full'
                px={5}
                ml={2}
                variant='solid'
                colorScheme={makeBgColor('score')}
                onClick={() => onHandleSortChange('score')}
                cursor={'pointer'}
                flexShrink="0"
              >
                <TagLabel color={textColor}>평점순</TagLabel>
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
                    colorScheme={makeBgColor('distance')}
                    onClick={() => onHandleSortChange('distance')}
                    cursor={'pointer'}
                    flexShrink="0"
                  >
                    <TagLabel color={textColor}>거리순</TagLabel>
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
                    colorScheme={makeBgColor('distance')}
                    onClick={() => console.log("dddd")}
                    cursor={'pointer'}
                    flexShrink="0"
                  >
                    <TagLabel color={textColor}>
                    <Box display={'flex'} alignItems={'center'} ml={2} cursor={'pointer'}>
                      <Popover placement='top-start'>
                        <PopoverTrigger>
                          <Text color={haederBgColor} >거리순<span style={{color: 'red'}}>*</span></Text>
                        </PopoverTrigger>
                        <PopoverContent bg={'white'}>
                          <PopoverHeader 
                            fontWeight='semibold'
                            backgroundColor={'gray.100'}
                            color={textColor2}
                          >
                            <Text color={textColor2} fontSize={"13px"}>설명</Text>
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverBody width={"100%"}>
                            <Text 
                              color={textColor2} 
                              fontSize={"12px"}
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
            </Box>
          </Stack>
        </Flex>

        <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'}  pt={5} overflowY={'auto'}>
          {
            doctors.map((item:any,index:number) => {
              return (
                <Box key={index}>
                  <DoctorItems
                    data={item}
                    onSendDoctorButton={(data,ismode)=>{setSelectedDoctor(data);setIsOpenDoctorModal(true)}}
                  />
                </Box>
              )
            })
          }
        </Flex>
        <Box height={'100px'} />
        {
          isOpenDoctorModal && (
            <Modal
              onClose={() => setIsOpenDoctorModal(false)}
              isOpen={isOpenDoctorModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1}>
                <ModalHeader>
                  <Flex flexDirection={'row'}>
                    <Box flex={1} display={'flex'} alignItems={'center'} onClick={() => setIsOpenDoctorModal(false)} cursor={'pointer'}>
                      <Icon as={MdArrowBack} width="20px" height="20px" color="inherit" />
                    </Box>
                    <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                      <Text>{"{{의사명}}"} 프로필</Text>
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody >
                  <DoctorDetail
                    data={selectedDoctor}
                  />
                </ModalBody>
               {/*  <ModalFooter>
                  <Button onClick={() => setIsOpenDoctorModal(false)}>Close</Button>
                </ModalFooter> */}
              </ModalContent>
            </Modal>
          )
        }
      </>
    )
  }
}


export default DoctorListModal;
