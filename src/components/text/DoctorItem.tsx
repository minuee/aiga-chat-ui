'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,Text,Input, Divider} from '@chakra-ui/react';
import Image from 'next/image';
import functions from '@/utils/functions';
import DoctorAvatar from "@/assets/images/thumb_dr_basic.png";
type DoctorListProps = {
    data: any;
    onSendDoctorButton: (data: any, type:number) => void;
};
  
const DoctorList = ({ data, onSendDoctorButton }:DoctorListProps) => {
   
    const textColor = useColorModeValue('gray.500','white')
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <>
            <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'100px'} mt="20px" padding="10px 20px">
                <Box flex={3} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'} pr='15px' onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    <Text fontSize={'15px'} color="#0AA464" fontWeight={'bold'}>병원명</Text>
                    <Text fontSize={'24px'} color="#000000" fontWeight={'bold'} lineHeight={"200%"}>
                    의사명 교수
                    </Text>
                    <Flex mt="2" flexShrink={1} flexWrap={'wrap'}>
                    <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                        <Text fontSize={'13px'} color="#5C5E69">진료분야 1</Text>
                    </Box>
                    <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                        <Text fontSize={'13px'} color="#5C5E69">진료분야 2</Text>
                    </Box>
                    <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                        <Text fontSize={'13px'} color="#5C5E69">진료분야 3</Text>
                    </Box>
                    <Box display={'flex'} padding="5px" bg="#EFF2F7" borderRadius={"4px"} gap="8px" mr="1" mt="1">
                        <Text fontSize={'13px'} color="#5C5E69">진료분야 4</Text>
                    </Box>
                    </Flex>
                </Box>
                <Box display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'} pl='15px' minWidth={'90px'} onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    <Image src={DoctorAvatar} alt="doctor" width={90} height={90} />
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