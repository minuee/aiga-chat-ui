'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,Text,Input, Divider} from '@chakra-ui/react';
import Image from 'next/image';
import functions from '@/utils/functions';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";
import DoctorAvatar from "@/assets/images/thumb_dr_basic.png";
type DoctorListProps = {
    data: any;
    onSendDoctorButton: (data: any, type:number) => void;
};
  
const DoctorList = ({ data, onSendDoctorButton }:DoctorListProps) => {
   
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
                                    <CustomText fontSize={'13px'} color="#5C5E69">{subItem.toString()}</CustomText>
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
            {/* <Flex justifyContent={'center'} alignItems={'center'}>
                <Flex flex={1}  onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    {
                        functions.isEmpty(data?.profileimgurl) 
                        ?
                        <NextImage width="200" height="200" src={sampleDoctor2} alt={'doctor1'} />
                        :
                        <Image src={data?.profileimgurl.trimEnd()} alt='profile' width={200} height={200} />
                    }
                </Flex>
                <Flex flex={2} flexDirection={'column'} minHeight={'50px'} padding={'0 10px'} cursor={'pointer'}>
                    <Box flex={1}>
                        <FormControl variant="floatingLabel">
                        <Input 
                            size={'sm'}
                            type="text" 
                            borderColor={borderColor}
                            color={textColor}
                            value={data?.doctor_name || ''}
                            placeholder='의사명' 
                            readOnly
                            id="input_doctorname"
                        />
                        </FormControl>
                    </Box>              
                    <Box flex={1} mt={2}>
                        <FormControl variant="floatingLabel">
                        <Input 
                            size={'sm'} 
                            type="text"
                            borderColor={borderColor}
                            color={textColor} 
                            value={data?.hospitalName}
                            placeholder='병원명' 
                            readOnly
                            id="input_hospital"
                        />
                        </FormControl>
                    </Box> 
                    <Box flex={1} mt={2}>
                        <FormControl variant="floatingLabel">
                        <Input 
                            size={'sm'} 
                            type="text"
                            borderColor={borderColor}
                            color={textColor} 
                            value={data?.depthName}
                            placeholder='진료과' 
                            readOnly
                            id="input_deptname"
                        />
                        </FormControl>
                    </Box> 
                    <Box flex={1} mt={2}>
                        <FormControl variant="floatingLabel">
                        <Input 
                            size={'sm'} 
                            type="text"
                            borderColor={borderColor}
                            color={textColor} 
                            value={data?.speciality}
                            placeholder='진료과목' 
                            readOnly
                            id="input_speciality"
                        />
                        </FormControl>
                    </Box> 
                </Flex>        
            </Flex> */}
            
        </>     
    )
};

export default DoctorList;