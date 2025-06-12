'use client';
import React from 'react';
// chakra imports
import { Box,Flex, useColorModeValue,SimpleGrid,Text,Textarea,Icon,Divider,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverBody,Button } from '@chakra-ui/react';
import ProgressBar from '@/components/fields/ProgressBar';
import mConstants from '@/utils/constants';
import { MdOutlineStarPurple500,MdMoreHoriz,MdOutlineEdit,MdOutlineDelete } from 'react-icons/md';

type ReivewItemProps = {
    data: any;
    onHandleDetail: (data: any) => void;
};
  
const ReviewItem = ({ data, onHandleDetail }:ReivewItemProps) => {
    const bgColor = useColorModeValue('white', 'navy.700');
    const moreColor = useColorModeValue('gray.500', 'whiteAlpha.300');
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
                                <Button leftIcon={<Icon as={MdOutlineEdit} />} size='sm' onClick={() => onHandleDetail(null)} id="button_change_name">
                                    수정하기
                                </Button>
                                {/* <Button leftIcon={<Icon as={MdOutlineShare} />} size='sm' onClick={() => setIsOpenShare(true)} id="button_share">
                                    공유하기
                                </Button> */}
                                <Button leftIcon={<Icon as={MdOutlineDelete} />} size='sm'  onClick={() => window.alert('준비중')} color={'red'} id="button_remove">  
                                    삭제하기
                                </Button>
                            </Flex>
                        </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    
                </Box>
                <Text fontSize={'16px'} color={"#000000"} fontWeight={"bold"}>닉네임</Text>
                <Text fontSize={'13px'} color={'#7F879B'}>YYYY.MM.DD</Text>
                <SimpleGrid spacing={3} templateColumns={{base : 'repeat(1, 1fr)' , sm : 'repeat(2, 1fr)'}} mt={3}>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>친절 • 배려</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>4.5</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>치료 만족</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>4.5</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>쉬운 설명</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>4.5</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
                    <Box flex={1} display={'flex'}>
                        <Text fontSize={'12px'} color='#5C5E69' lineHeight={"150%"}>추천 의향</Text>
                    </Box>
                    <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <Icon color='gold' as={MdOutlineStarPurple500}  />
                        <Text fontSize={'12px'} color='#55A5FF' lineHeight={"150%"}>4.5</Text>
                    </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={80} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                </SimpleGrid>
                <Box display={'flex'} py="15px">
                <Textarea 
                    readOnly 
                    variant={'outline'} 
                    value={'리뷰 내용 리뷰 내용 리뷰 내용 리뷰 내용 리뷰 내용 \n리뷰 내용리뷰 내용리뷰 내용'} 
                    isReadOnly 
                    padding={0}
                    resize={'none'}  
                    size={'md'} 
                    border={"0px solid #ffffff"}
                    id={"textarea_content"}
                    color={'#5C5E69'}
                />
                </Box>
            </Box> 
        </Flex>     
    )
};

export default ReviewItem;