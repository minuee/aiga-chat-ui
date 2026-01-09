// src/components/msgType/DoctorRecommandItem.tsx
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { Box, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { BiChevronRight } from "react-icons/bi";
import DoctorAvatar from "@/assets/images/doctor_default_white.png"; // DoctorAvatar 경로 확인
import functions from "@/utils/functions"; // functions 유틸리티 경로 확인
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";

type DoctorRecommandItemProps = {
  element: any;
  index: number;
  onSendButton: (data: any, id: number) => void;
  profileBgColor: string;
  nameTextColor: string;
  partTextColor: string;
  arrowColor: string;
  doctorListLength: number; // doctorList의 길이 추가
};

const DoctorRecommandItem = ({
  element,
  index,
  onSendButton,
  profileBgColor,
  nameTextColor,
  partTextColor,
  arrowColor,
  doctorListLength
}: DoctorRecommandItemProps) => {
  const verbose = process.env.NEXT_PUBLIC_DOCTOR_IMAGE_VERBOSE === 'true';
  const photoSrc = (verbose && element?.photo && !functions.isEmpty(element.photo)) 
    ? element.photo.trim() 
    : DoctorAvatar.src;
  
  const [hasError, setHasError] = useState(false);

  // Reset error state when the photo source changes
  useEffect(() => {
    setHasError(false);
  }, [photoSrc]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <Flex
      key={index}
      bg={profileBgColor}
      width={ doctorListLength === 1 ? "100%" : doctorListLength === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }
      minWidth={{ base : "150px" , sm2 : doctorListLength === 1 ? "100%" : doctorListLength === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }}
      padding="20px"
      borderRadius="8px"
      alignItems={'center'}
      onClick={() => onSendButton(element, element?.doctor_id)}
      cursor={'pointer'}
      flexDirection={{ base : doctorListLength === 1 ? 'row' : "column" , 'sm2' : doctorListLength > 2 ? 'column' : 'row'}}
      mr={index !== doctorListLength - 1 ? "8px" : "0px"}
    >
      <Box
        // flex={1} 제거
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        width={"60px"} // 고정 폭으로 변경
        height={"60px"} // 고정 높이로 변경
        borderRadius={"50%"}
        overflow={"hidden"}
      >
        <Image
          src={hasError ? DoctorAvatar.src : photoSrc}
          alt="프로필이미지"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          sizes="60px"
          width={60} // Image prop도 Box의 고정 크기에 맞춤
          height={60} // Image prop도 Box의 고정 크기에 맞춤
          onError={handleImageError}
        />
      </Box>
      <Flex flex={4} flexDirection={'column'} justifyContent={'center'} px="20px" mt={doctorListLength > 1 ? "10px" : 0}>
        <Box display={'flex'} justifyContent={doctorListLength > 1 ? 'center' : 'flex-start'} alignItems={'center'} height={'26px'}>
          <CustomTextBold700 fontSize={'17px'} color={nameTextColor} lineHeight={"150%"} noOfLines={1}>
            {element?.name}
          </CustomTextBold700>
        </Box>
        <Box display={'flex'} justifyContent={doctorListLength > 1 ? 'center' : 'flex-start'} alignItems={'center'} height={'26px'}>
          <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
            {element?.hospital}
          </CustomTextBold700>
        </Box>
        <Box display={'flex'} justifyContent={doctorListLength > 1 ? 'center' : 'flex-start'} alignItems={'center'} height={'26px'}>
          <CustomTextBold700 fontSize={'12px'} color={partTextColor} lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
            {element?.deptname}
          </CustomTextBold700>
        </Box>
      </Flex>
      <Box
        flex={1} display={doctorListLength > 1 ? 'none' : 'flex'} alignItems={'center'} justifyContent={'flex-end'}
        onClick={() => onSendButton(element, element?.doctor_id)}
        cursor={'pointer'}
      >
        <Icon as={BiChevronRight} width="20px" height="20px" color={arrowColor} />
      </Box>
    </Flex>
  );
};

export default React.memo(DoctorRecommandItem);
