'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,FormControl,Input, Divider} from '@chakra-ui/react';
import Image from 'next/image';
import NextImage, { ImageProps } from 'next/legacy/image';
import functions from '@/utils/functions';
import { sampleDoctor2 } from "@/components/icons/IconImage";

type DoctorListProps = {
    data: any;
    onSendDoctorButton: (data: any, type:number) => void;
};
  
const DoctorList = ({ data, onSendDoctorButton }:DoctorListProps) => {
   
    const textColor = useColorModeValue('gray.500','white')
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    return (
        <>
            <Flex justifyContent={'center'} alignItems={'center'}>
                <Flex flex={1}  onClick={() => onSendDoctorButton(data,1)} cursor={'pointer'}>
                    {
                        functions.isEmpty(data?.profileimgurl) 
                        ?
                            <NextImage
                                width="200"
                                height="200"
                                src={sampleDoctor2}
                                alt={'doctor1'}
                            />
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
                        />
                        </FormControl>
                    </Box> 
                </Flex>        
            </Flex>
            <Divider  my={2} />
        </>     
    )
};

export default DoctorList;