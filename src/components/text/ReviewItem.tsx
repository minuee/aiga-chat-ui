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
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { MdKeyboardDoubleArrowDown,MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { iconAlertWarning } from "@/components/icons/IconImage"
import functions from '@/utils/functions';
import { BiTrash,BiEdit,BiDotsHorizontalRounded } from "react-icons/bi";
import UserStateStore from '@/store/userStore';
import { FiChevronDown,FiChevronUp } from "react-icons/fi";
type ReivewItemProps = {
    data: any;
    onHandleDetail: (data: any) => void;
    onHandleDoctorRequestRegist: (data: any) => void;
};
  
const ReviewItem = ({ data, onHandleDetail,onHandleDoctorRequestRegist }:ReivewItemProps) => {

    const [isOpenAlert, setOpenAlert] = React.useState(false); 
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [shouldShowExpand, setShouldShowExpand] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const { ...userBaseInfo } = UserStateStore(state => state);

    const bgColor = useColorModeValue('white', 'navy.700');
    const borderColor = useColorModeValue('#7F879B', 'navy.900');
    const nameTextColor = useColorModeValue("#000000", 'white');
    const iconColor = useColorModeValue('#AFB5C3','white')
    const iconRedColor = useColorModeValue('#FA6464','white');
    const dateColor = useColorModeValue('#7F879B','white')
    const voteTextColor = useColorModeValue('#5C5E69','white');
    const iconBgColor = useColorModeValue('#E9EDF3','navy.900');
    const moreColor = useColorModeValue('#AFB5C3', 'white');

    const onHandleAlertConfirm = () => {
        onHandleDoctorRequestRegist(data)
    }

    React.useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
          // 한 줄 높이 기준 계산
          const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "20")
          const maxVisibleLines = 5
          const totalLines = Math.round(textarea.scrollHeight / lineHeight)
          setShouldShowExpand(totalLines > maxVisibleLines)
        }
    }, [data?.content])

    return (
        <Flex width={'100%'} flexDirection='column'>
            <Divider orientation='horizontal' my={5} />
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} position={'relative'}>
                <Box 
                    position={'absolute'} right="0" top="0" width="150px" height={'30px'} justifyContent={'center'} alignItems={'center'}
                    display={userBaseInfo?.userId == data?.user_id ? 'flex' : 'none'} 
                >
                    <Popover>
                        <PopoverTrigger>
                            <Flex justifyContent={'flex-end'}width={'100%'}>
                            <Icon as={BiDotsHorizontalRounded} width="24px" height="24px" color={moreColor} />
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent width={'150px'} bg={bgColor} borderColor={borderColor}>
                        <PopoverBody borderRadius={'8px'} width={"150px"}>
                            <Flex flexDirection={'column'} alignItems={'flex-start'}>
                                <Button leftIcon={<Icon as={BiEdit} width="16px" height="16px" color={iconColor} />} size='sm' onClick={() => onHandleDetail(data)} id="button_change_name"  bg="transparent">
                                    <CustomText fontSize='15px' color={iconColor}>수정하기</CustomText> 
                                </Button>
                                <Button leftIcon={<Icon as={BiTrash} width="16px" height="16px" color={iconRedColor}  />} size='sm' onClick={() => setOpenAlert(true)} color={iconRedColor} id="button_remove"  bg="transparent">  
                                    <CustomText fontSize='15px' color={iconColor}>삭제하기</CustomText> 
                                </Button>
                            </Flex>
                        </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    
                </Box>
                <CustomTextBold700 fontSize={'16px'} color={nameTextColor}>{data?.nickname}</CustomTextBold700>
                <CustomText fontSize={'13px'} color={dateColor}>{format(data?.createAt, 'yyyy-MM-dd')}</CustomText>
                <SimpleGrid spacing={3} templateColumns={{base : 'repeat(1, 1fr)' , sm : 'repeat(2, 1fr)'}} mt={3}>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}  mb={'5px'}>
                        <Box flex={2} display={'flex'} >
                            <CustomText fontSize={'12px'} color={voteTextColor} lineHeight={"150%"}>친절 • 배려</CustomText>
                        </Box>
                        <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'}>
                                <Icon color='#FFCE05' as={MdOutlineStarPurple500}  />
                            </Box>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'} pt={0.5}>
                                <CustomText fontSize={'12px'} color='#55A5FF' lineHeight={"150%"} pl="5px">{functions.floatFormat(parseFloat(data?.kindness_score))}</CustomText>
                            </Box>
                        </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.kindness_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}  mb={'5px'}>
                        <Box flex={2} display={'flex'}>
                            <CustomText fontSize={'12px'} color={voteTextColor} lineHeight={"150%"}>치료 만족</CustomText>
                        </Box>
                        
                        <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'}>
                                <Icon color='#FFCE05' as={MdOutlineStarPurple500}  />
                            </Box>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'} pt={0.5}>
                                <CustomText fontSize={'12px'} color='#55A5FF' lineHeight={"150%"} pl="5px">{functions.floatFormat(parseFloat(data?.satisfaction_score))}</CustomText>
                            </Box>
                        </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.satisfaction_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'} mb={'5px'}>
                        <Box flex={21} display={'flex'}>
                            <CustomText fontSize={'12px'} color={voteTextColor} lineHeight={"150%"}>쉬운 설명</CustomText>
                        </Box>
                        <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'}>
                                <Icon color='#FFCE05' as={MdOutlineStarPurple500}  />
                            </Box>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'} pt={0.5}>
                                <CustomText fontSize={'12px'} color='#55A5FF' lineHeight={"150%"} pl="5px">{functions.floatFormat(parseFloat(data?.explaination_score))}</CustomText>
                            </Box>
                        </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.explaination_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                <Box display={'flex'} flexDirection='column' flex={1} justifyContent={'center'} alignItems={'center'} >
                    <Flex flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'} mb={'5px'}>
                        <Box flex={1} display={'flex'}>
                            <CustomText fontSize={'12px'} color={voteTextColor} lineHeight={"150%"}>추천 의향</CustomText>
                        </Box>
                        <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'}>
                                <Icon color='#FFCE05' as={MdOutlineStarPurple500}  />
                            </Box>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'17px'} pt={0.5}>
                                <CustomText fontSize={'12px'} color='#55A5FF' lineHeight={"150%"} pl="5px">{functions.floatFormat(parseFloat(data?.recommand_score))}</CustomText>
                            </Box>
                        </Box>
                    </Flex>
                    <ProgressBar colorScheme='green' height='8px' width={'100%'} value={parseFloat(data?.recommand_score)*20} borderRadius={'1rem'} bg={'#EFF2F7'} />
                </Box>
                </SimpleGrid>
                <Box display={'flex'} flexDirection={'column'} pt="30px">
                    <Textarea 
                        ref={textareaRef}
                        readOnly 
                        variant={'outline'} 
                        value={data?.content} 
                        isReadOnly 
                        padding={0}
                        resize={'none'}  
                        size={'md'} 
                        border={"0px solid #ffffff"}
                        id={"textarea_content"}
                        color={{voteTextColor}}
                        fontFamily={'body_notosans'}
                        as={ResizeTextarea}
                        minRows={1}
                        maxRows={isExpanded ? undefined : 5}
                        //maxHeight={isExpanded ? "none" : "calc(1.2em * 10)"} 
                    />
                    {   shouldShowExpand && (
                        <Box display={'flex'} width="100%" alignItems={'center'} my="10px">
                            <Button
                                size="sm"
                                backgroundColor={iconBgColor}
                                borderRadius={0}
                                py={"3px"}
                                variant="link"
                                colorScheme="slate"
                                onClick={() => setIsExpanded(!isExpanded)}
                                id="button_toggle"
                            >
                                {isExpanded ? <Icon as={FiChevronUp} color={'#555'} /> : <Icon as={FiChevronDown} color={'#555'} />}
                            </Button>
                        </Box>
                    )}
                    {/* <Box display={'flex'} width="100%" alignItems={'center'} my="10px">
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
                            {isExpanded ? <Icon as={FiChevronUp} color={'#555'} /> : <Icon as={FiChevronDown} color={'#555'} />}
                        </Button>
                    </Box> */}
                </Box>
            </Box> 
            {
                isOpenAlert && (
                    <Alert 
                        isShowAppname={false}
                        AppName='AIGA'
                        bodyContent={
                            <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                <Box width={"100%"}  display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"120px"}>
                                    <NextImage
                                    width="106"
                                    height="90"
                                    src={iconAlertWarning}
                                    alt={'doctor1'}
                                    />
                                </Box>
                                <Box width={"100%"} flexDirection={'column'} display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={"50px"}>
                                    <CustomTextBold700 fontSize={'18px'} color="#212127">이 리뷰를 삭제하시겠습니까?</CustomTextBold700>
                                    <CustomTextBold700 fontSize={'18px'} color="#212127">삭제된 리뷰는 복구할 수 없습니다.</CustomTextBold700>
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
                                    <CustomTextBold700 fontSize={'16px'} color="#ffffff">삭제</CustomTextBold700>
                                </Box>
                                <Box width={"78px"} ml="5px" display={'flex'} justifyContent={'center'} alignItems={'center'} height={"50px"} bg="#DFE3EA" borderRadius={'6px'} onClick={() => setOpenAlert(false)} cursor={'pointer'}>
                                    <CustomTextBold700 fontSize={'16px'} color="#000000">취소</CustomTextBold700>
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