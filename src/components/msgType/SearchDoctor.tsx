import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import Image from 'next/image';
import { Box,Flex,Stack,useColorModeValue,Text,Icon } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import { BiChevronRight } from "react-icons/bi";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import DoctorAvatar from "@/assets/images/doctor_default_white.png";
import LogoImage from "@/assets/images/logo.png";

type SearchDoctorProps = {
    data : any;
    onSendButton: (data: any,id:number) => void; 
};

const SearchDoctor = ({  onSendButton , data }: SearchDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [doctorList, setDoctorList] = useState([]);
  const isDark = useColorModeValue(false, true);

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

  useEffect(() => {
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

  useEffect(() => {
    console.log("data?.answer?.doctors",data?.answer?.doctors)
    if ( !functions.isEmpty( data?.answer?.doctors )) {
      setDoctorList(data?.answer?.doctors)
    }
  }, [data]);

  useEffect(() => {
    console.log("data?.answer?.doctors",doctorList?.length)
  }, [doctorList]);

  return (
    <Stack minWidth={'100%'} width={'auto'} minHeight={"50px"} maxHeight={"300px"} position={'relative'}>
      <Box my="5px">
        <Image 
          src={LogoImage}
          alt="Aiga Logo"
          style={{width:'45px',objectFit: 'contain'}}
        />
      </Box>
      <Flex  alignItems={"center"} mt="20px" justifyContent={'flex-start'} minWidth={'100%'} width={'auto'} minHeight={"50px"} maxHeight={"250px"} overflowX={'auto'} ref={flexRef} >
        {
          doctorList.map((element: any, index: number) => (
            <Flex 
              key={index} 
              bg="#F4F6FA" 
              width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
              maxWidth='300px' 
              px="10px"
              borderRadius="8px"
              mr='5px'
              onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
            >
              <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} pt="20px" pb="16px">
                <NextImage 
                  src={DoctorAvatar}
                  alt="프로필이미지"
                  style={{ borderRadius: '50%', objectFit: 'cover' }} 
                  width={60} 
                  height={60}
                />
              </Box>
              <Box flex={4} display={'flex'} justifyContent={'center'} alignItems={'center'} pt="20px" pb="16px">
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'26px'} pb="16px">
                  <CustomTextBold700 fontSize={'17px'} color='#17191D' lineHeight={"150%"} noOfLines={1}>
                    {element?.name}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'26px'} pb="16px">
                  <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                    {element?.hospital}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pb="32px" height={'26px'}>
                  <CustomTextBold700 fontSize={'12px'} color='#7F879B' lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                    {element?.deptname}
                  </CustomTextBold700>
                </Box>
              </Box>
              <Box
                flex={0.5} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}
                onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
              >
                <Icon as={BiChevronRight} width="20px" height="20px" color="#000000" />
              </Box>
            </Flex>
          ))
        }
      </Flex>
    </Stack>
  )
};
  
export default SearchDoctor;