'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,Divider} from '@chakra-ui/react';
import Image from 'next/image';
import functions from '@/utils/functions';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import DoctorAvatar from "@/assets/images/thumb_dr_basic.png";
type DoctorListProps = {
    data: any;
    inputs : any;
    onSendDoctorButton: (data: any, type:number) => void;
};
  
const DoctorList = ({ data, onSendDoctorButton,inputs }:DoctorListProps) => {
   
    const nameText = useColorModeValue('#000000','white')
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <>
            <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'} py="15px">
                <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} pr='15px' onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    <CustomTextBold700 fontSize={'15px'} color="#0AA464">{data?.hospital || ""}</CustomTextBold700>
                    <CustomTextBold700 fontSize={'19px'} color={nameText}  lineHeight={"200%"}>
                        {!functions.isEmpty(data?.name) ? data?.name : ""} 교수
                    </CustomTextBold700>
                    <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
                        <Box display={'flex'} padding="2px 4px" bg="#DFF5ED" borderRadius={"4px"}  mr="1" mt="1">
                            <CustomText fontSize={'13px'} color="#5C5E69">{data?.deptname || ""}</CustomText>
                        </Box>
                        {
                            !functions.isEmpty(data.specialties) && (
                                data.specialties.split(",").map((subItem:any, subIndex:number) => (
                                <Box display={'flex'} padding="2px 4px" bg="#EFF2F7" borderRadius={"4px"} mr="1" mt="1" key={subIndex}>
                                    <CustomText fontSize={'13px'} color="#5C5E69">{functions.cleanEscapeAsterrisk(subItem.toString())}</CustomText>
                                </Box>
                                )
                            ))
                        }
                    </Flex>
                </Box>
                <Box  display={'flex'}  justifyContent={'center'} alignItems={'center'} width={'60px'} onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    <Image src={DoctorAvatar} alt="doctor" width={60} height={60} />
                </Box>
            </Flex>
            <Divider  my={2} />
        </>     
    )
};

export default DoctorList;