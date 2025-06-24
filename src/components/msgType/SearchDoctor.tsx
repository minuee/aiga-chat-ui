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
import { IconChatAiga} from '@/components/icons/svgIcons';
type SearchDoctorProps = {
    data : any;
    isHistory : boolean;
    onSendButton: (data: any,id:number) => void; 
};

const SearchDoctor = ({  onSendButton , data,isHistory }: SearchDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [doctorList, setDoctorList] = useState([]);
  const isDark = useColorModeValue(false, true);
  const textSystemColor = useColorModeValue('#212127', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'white');
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
    if ( !functions.isEmpty( data?.answer?.doctors )) {
      setDoctorList(data?.answer?.doctors)
    }
  }, [data]);


  return (
    <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
      <Box my="5px">
        <IconChatAiga width={'46px'} height={"12px"} />
      </Box>
      <Flex 
        padding="12px 20px" 
        border={`1px solid ${bgSystemColor}`} 
        bgColor={bgSystemColor} 
        borderTopLeftRadius="2px" 
        borderTopRightRadius="20px" 
        borderBottomLeftRadius="20px"
        borderBottomRightRadius="20px" 
        w="auto" 
        zIndex={2}
        justifyContent={'center'}
        flexDirection={'column'}
      > 
        <Box>
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>증상에 맞는 의사를 추천해 드립니다.</CustomText>
        </Box>  
      </Flex>
      <Flex  
        alignItems={"center"} 
        justifyContent={'flex-start'} 
        minWidth={'100%'} 
        width={'auto'} 
        minHeight={"50px"} 
        //maxHeight={"0px"}  
        ref={flexRef} 
        mt={'10px'}
      >
        {
          doctorList.map((element: any, index: number) => (
            <Flex 
              key={index} 
              bg="#F4F6FA" 
              width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
              padding="20px"
              borderRadius="20px"
              onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
            >
              <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} maxWidth={"70px"}>
                <NextImage 
                  src={DoctorAvatar}
                  alt="프로필이미지"
                  style={{ borderRadius: '50%', objectFit: 'cover' }} 
                  width={60} 
                  height={60}
                />
              </Box>
              <Flex flex={4} flexDirection={'column'} justifyContent={'center'} px="20px">
                <Box display={'flex'} alignItems={'center'} height={'26px'}>
                  <CustomTextBold700 fontSize={'17px'} color='#17191D' lineHeight={"150%"} noOfLines={1}>
                    {element?.name}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'}  alignItems={'center'} height={'26px'}>
                  <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                    {element?.hospital}
                  </CustomTextBold700>
                </Box>
                <Box display={'flex'} alignItems={'center'} height={'26px'}>
                  <CustomTextBold700 fontSize={'12px'} color='#7F879B' lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                    {element?.deptname}
                  </CustomTextBold700>
                </Box>
              </Flex>
              <Box
                flex={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}
                onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
              >
                <Icon as={BiChevronRight} width="20px" height="20px" color="#000000" />
              </Box>
            </Flex>
          ))
        }
      </Flex>
    </Flex>
  )
};
  
export default SearchDoctor;