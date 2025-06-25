import React from 'react';
import { Box,Heading,Text,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverBody,Flex,Button,Icon,useColorModeValue,FormControl,Input,useDisclosure,useToast } from '@chakra-ui/react';
import { MdOutlineMoreVert,MdMoreHoriz,MdOutlineEdit,MdOutlineDelete } from 'react-icons/md';
import Alert from '@/components/alert/Alert';
import mConstants from '@/utils/constants';
import functions from '@/utils/functions';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { ChatSesseionIdStore } from '@/store/newChatStore';

type HistoryItemProps = {
    data: any;
    onDeleteHistory: (session_id: string) => void;
    onHandleUpdateTitle: (inputs: any) => void;
    onHandCallHistory : ( data :any) => void;
};
  
const HistoryItem = ({ data, onDeleteHistory, onHandleUpdateTitle,onHandCallHistory }:HistoryItemProps) => {
    const { cuser_id,session_id,title,session_time,chattings } = data;
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editMode, setEditMode] = React.useState(false);
    const [isOpenShare, setIsOpenShare] = React.useState(false);
    const [inputs, setInputs] = React.useState<any>({
        ...data,
        shareLink : `https://aiga.kormedi.com/share/minuee/${data.session_id}`
    });
    const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
    const textColor = useColorModeValue('navy.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
    const bgColor = useColorModeValue('white', 'navy.700');
    const moreColor = useColorModeValue('gray.500', 'whiteAlpha.300');
    const onHandleDeleteHistory = () => {
        onDeleteHistory(data.session_id);
    }

    React.useEffect(() => {
        setEditMode(false);
    }, [data?.session_id]);

    const onHandleShareHistory = () => {
        navigator.clipboard.writeText(inputs.shareLink);
        setTimeout(() => {
            toast({
                title: "공유 링크가 복사되었습니다",
                position: 'top-left',
                status: 'info',
                isClosable: true,
            })
        }, 60);
    }

    return (
        <Flex 
            display={'flex'}
            alignItems={'center'}
            position={'relative'} 
            width="100%" 
            minHeight={'42px'}
            px="10px"
            maxWidth={`${mConstants.modalMaxWidth}px`}
            bg={( editMode || chatSessionId == data?.session_id ) ?'#EAF4FF' : '#ffffff'}
            borderRadius={editMode ? '8px' : 0}
            _hover={{
                bg: editMode ?'#EAF4FF' : '#EFF2F7',
                borderRadius:'8px',
                cursor: 'pointer'
            }}
        >
        {
            editMode ? 
            <FormControl variant="floatingLabel" py="10px">
                <Input 
                    type="text" 
                    placeholder='제목을 입력해주세요(필수)' 
                    value={functions.isEmpty(inputs?.title) ? "무제" : inputs?.title}
                    onChange={(e) => setInputs({...inputs, title: e.target.value})}
                    color={textColor}
                    id="input_title"
                />
                <Flex flexDirection={'row'} justifyContent={'flex-end'} gap={2} mt={2}>
                    <Button size='sm' variant={'solid'} colorScheme='blue' onClick={() => {onHandleUpdateTitle(inputs);setEditMode(false)}} id="button_save">
                        저장
                    </Button>
                    <Button size='sm' variant={'solid'} colorScheme='gray' onClick={() => setEditMode(false)} id="button_cancel">
                        취소
                    </Button>
                </Flex>
            </FormControl>
            :
            <Box onClick={() => onHandCallHistory(data)} bg='transparent' minWidth={"90%"} zIndex={2} cursor={'pointer'}>
                <CustomText fontSize='17px' noOfLines={1} pr='20px' color='#212127'>
                    {functions.isEmpty(title) ? "무제" :title }
                </CustomText>
            </Box>
        }
        { 
            !editMode && (
                <Box position={"absolute"} left={'-5px'} top={"6px"} width={'100%'}  height={'42px'} zIndex={1}>
                    <Flex justifyContent={'flex-end'}>
                        <Popover>
                            <PopoverTrigger>
                                <Icon as={MdMoreHoriz} width="18px" height="25px" color={moreColor} />
                            </PopoverTrigger>
                            <PopoverContent width={'150px'} bg={bgColor}>
                            <PopoverArrow />
                            <PopoverBody>
                                <Flex flexDirection={'column'} alignItems={'flex-start'} gap={2}>
                                    <Button leftIcon={<Icon as={MdOutlineEdit} />} size='sm' onClick={() => setEditMode(true)} id="button_change_name">
                                        이름변경
                                    </Button>
                                    {/* <Button leftIcon={<Icon as={MdOutlineShare} />} size='sm' onClick={() => setIsOpenShare(true)} id="button_share">
                                        공유하기
                                    </Button> */}
                                    <Button leftIcon={<Icon as={MdOutlineDelete} />} size='sm' onClick={onOpen} color={'red'} id="button_remove">  
                                        삭제하기
                                    </Button>
                                </Flex>
                            </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Flex>
                </Box>
            )
        }
        {
            isOpen &&  (
            <Alert 
                AppName='AIGA'
                bodyContent='정말로 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.'
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={() => {onHandleDeleteHistory();onClose()}}
                closeText='취소'
                confirmText='삭제'
            />
            )
        }
        {
            isOpenShare && (
                <Alert 
                    AppName='공개 링크 공유'
                    bodyContent={
                        <Flex flexDirection={'column'}>
                            <Box mb={2}>
                                <CustomText fontSize={'15px'}>이름,공유 후 추가하는 모든 메시지가 비공개로 유지됩니다.</CustomText>
                            </Box>
                            <Input 
                                type='text' 
                                placeholder='공유 링크 주소' 
                                value={inputs.shareLink} 
                                onChange={(e) => console.log("cloick")} 
                                color={textColor}
                                id="input_link"
                            />
                        </Flex>
                    }
                    isOpen={isOpenShare}
                    onClose={() => setIsOpenShare(false) }
                    onConfirm={() => {onHandleShareHistory();setIsOpenShare(false)}}
                    closeText='취소'
                    confirmText='복사'
                    isCentered={true}
                />
            )
        }
        </Flex>
    )
};

export default HistoryItem;