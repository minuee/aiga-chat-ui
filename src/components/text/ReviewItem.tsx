'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,SimpleGrid,Text,Textarea,Icon,Divider,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverBody,Button } from '@chakra-ui/react';
import ProgressBar from '@/components/fields/ProgressBar';
import mConstants from '@/utils/constants';
import { MdOutlineStarPurple500,MdMoreHoriz,MdOutlineEdit,MdOutlineDelete } from 'react-icons/md';
import Alert from '@/components/alert/CustomAlert';
import NextImage from 'next/legacy/image';
import { format } from 'date-fns';
import ResizeTextarea from "react-textarea-autosize";

import { MdKeyboardDoubleArrowDown,MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { iconAlertWarning } from "@/components/icons/IconImage"
import functions from '@/utils/functions';

type ReivewItemProps = {
    data: any;
    onHandleDetail: (data: any) => void;
    onHandleDoctorRequestRegist: (data: any) => void;
};
  
const ReviewItem = ({ data, onHandleDetail,onHandleDoctorRequestRegist }:ReivewItemProps) => {

    const [isOpenAlert, setOpenAlert] = React.useState(false); 
    const [isExpanded, setIsExpanded] = React.useState(false);
    const bgColor = useColorModeValue('white', 'navy.700');
    const moreColor = useColorModeValue('gray.500', 'whiteAlpha.300');

    const onHandleAlertConfirm = () => {
        onHandleDoctorRequestRegist(data)
    }

    return (
        <Flex width={'100%'} flexDirection='column'>
            <Divider orientation='horizontal' my={5} />
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} position={'relative'}>
                <Box 
                    position={'absolute'} right="0" top="0" width="150px" height={'30px'}
                    display={'flex'} justifyContent={'center'} alignItems={'center'}
                >
                    <Popover>
                        <PopoverTrigger>
                            <Flex justifyContent={'flex-end'}width={'100%'}>
                                <Icon as={MdMoreHoriz} width="18px" height="25px" color={moreColor} />
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent width={'150px'} bg={bgColor}>
                        <PopoverArrow />
                        <PopoverBody>
                            <Flex flexDirection={'column'} alignItems={'flex-start'} gap={2}>
                                <Button leftIcon={<Icon as={MdOutlineEdit} />} size='sm' onClick={() => onHandleDetail(1)} id="button_change_name">
                                    수정하기
                                </Button>
                                {/* <Button leftIcon={<Icon as={MdOutlineShare} />} size='sm' onClick={() => setIsOpenShare(true)} id="button_share">
                                    공유하기
                                </Button> */}
                                <Button leftIcon={<Icon as={MdOutlineDelete} />} size='sm'  onClick={() => setOpenAlert(true)} color={'red'} id="button_remove">  
                                    삭제하기
                                </Button>
                            </Flex>
                        </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    
                </Box>
                <Text fontSize={'16px'} color={"#000000"} fontWeight={"bold"}>닉네임</Text>
                <Text fontSize={'13px'} color={'#7F879B'}>{format(data?.createAt, 'yyyy-MM-dd')}</Text>
                <SimpleGrid spacing={3} templateColumns={{base : 'repeat(1, 1fr)' , sm : 'repeat(2, 1fr)'}} mt={3}>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>친절 • 배려</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>{functions.floatFormat(parseFloat(data?.kindness_score))}</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.kindness_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>치료 만족</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>{functions.floatFormat(parseFloat(data?.satisfaction_score))}</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.satisfaction_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>쉬운 설명</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>{functions.floatFormat(parseFloat(data?.explaination_score))}</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.explaination_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>추천 의향</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>{functions.floatFormat(parseFloat(data?.recommand_score))}</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.recommand_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                </SimpleGrid>
                <Box display={'flex'} flexDirection={'column'} py="15px">
                    <Textarea 
                        readOnly 
                        variant={'outline'} 
                        value={data?.content} 
                        isReadOnly 
                        padding={0}
                        resize={'none'}  
                        size={'md'} 
                        border={"0px solid #ffffff"}
                        id={"textarea_content"}
                        color={'#5C5E69'}
                        as={ResizeTextarea}
                        maxHeight={isExpanded ? "none" : "calc(1.2em * 10)"} // 5줄 제한
                    />
                    <Box display={'flex'} width="100%" alignItems={'center'} my="10px">
                        <Button
                            size="sm"
                            backgroundColor={'#E9EDF3'}
                            borderRadius={0}
                            py={"3px"}
                            variant="link"
                            colorScheme="slate"
                            onClick={() => setIsExpanded(!isExpanded)}
                            id="button_toggle"
                        >
                            {isExpanded ? <Icon as={MdKeyboardDoubleArrowUp} color={'#555'} /> : <Icon as={MdKeyboardDoubleArrowDown} color={'#555'} />}
                        </Button>
                    </Box>
                </Box>
            </Box> 
            {
                isOpenAlert && (
                    <Alert 
                        isShowAppname={false}
                        AppName='AIGA'
                        bodyContent={
                            <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} py="20px">
                                <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                                    <NextImage
                                    width="106"
                                    height="90"
                                    src={iconAlertWarning}
                                    alt={'doctor1'}
                                    />
                                </Box>
                                <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"50px"}>
                                    <Text fontSize={'18px'} color="#212127" fontWeight={'bold'}>이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.</Text>
                                </Box>
                            </Flex>
                        }
                        isOpen={isOpenAlert}
                        onClose={() => setOpenAlert(false)}
                        onConfirm={() => onHandleAlertConfirm()}
                        closeText='취소'
                        confirmText='확인'
                        footerContent={
                            <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'} py="20px" width={"100%"}>
                                <Box width={"78px"} mr="5px" display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#F94848" borderRadius={'6px'} onClick={() => onHandleAlertConfirm()} cursor={'pointer'}>
                                    <Text fontSize={'16px'} color="#ffffff" fontWeight={'bold'}>삭제</Text>
                                </Box>
                                <Box width={"78px"} ml="5px" display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#DFE3EA" borderRadius={'6px'} onClick={() => setOpenAlert(false)} cursor={'pointer'}>
                                    <Text fontSize={'16px'} color="#000000" fontWeight={'bold'}>취소</Text>
                                </Box>
                            </Flex>
                        }
                    />
                )
                }
        </Flex>     
    )
};

export default ReviewItem;