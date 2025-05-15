import React from 'react';
import { Box,Heading,Text,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverBody,Flex,Button,Icon,useColorModeValue,FormControl,Input,useDisclosure,useToast } from '@chakra-ui/react';
import { MdOutlineMoreVert,MdOutlineShare,MdOutlineEdit,MdOutlineDelete } from 'react-icons/md';
import Alert from '@/components/alert/Alert';
import mConstants from '@/utils/constants';
type HistoryItemProps = {
    data: any;
    onDeleteHistory: (historyId: number) => void;
    onHandleUpdateTitle: (inputs: any) => void;
};
  
const HistoryItem = ({ data, onDeleteHistory, onHandleUpdateTitle }:HistoryItemProps) => {
    const { content, createdAt } = data;
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editMode, setEditMode] = React.useState(false);
    const [isOpenShare, setIsOpenShare] = React.useState(false);
    const [inputs, setInputs] = React.useState<any>({
        ...data,
        content: content,
        shareLink : `https://aiga.kormedi.com/share/minuee/${data.historyId}`
    });
    const textColor = useColorModeValue('navy.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
    const bgColor = useColorModeValue('white', 'navy.700');

    const onHandleDeleteHistory = () => {
        console.log('onHandleDeleteHistory');
        onDeleteHistory(data.historyId);
    }

    React.useEffect(() => {
        setEditMode(false);
    }, [data?.historyId]);

    const onHandleShareHistory = () => {
        console.log('onHandleShareHistory');
        navigator.clipboard.writeText(inputs.shareLink);
        setTimeout(() => {
            toast({
                title: "공유 링크가 복사되었습니다",
                position: 'top-left',
                status: 'info',
                isClosable: true,
            })
        }, 1000);
      
    }

    return (
        <Box position={'relative'} width="100%" maxWidth={`${mConstants.modalMaxWidth-100}px`}>
            <Heading size='xs' textTransform='uppercase' fontWeight={'normal'}>
            {createdAt || '0000-00-00'}
            </Heading>
            {
                editMode ? 
                <FormControl variant="floatingLabel">
                    <Input 
                        type="text" 
                        placeholder='제목을 입력해주세요(필수)' 
                        value={inputs.content}
                        onChange={(e) => setInputs({...inputs, content: e.target.value})}
                        color={textColor}
                    />
                    <Flex flexDirection={'row'} justifyContent={'flex-end'} gap={2} mt={2}>
                        <Button size='sm' variant={'solid'} colorScheme='blue' onClick={() => {onHandleUpdateTitle(inputs);setEditMode(false)}}>
                            저장
                        </Button>
                        <Button size='sm' variant={'solid'} colorScheme='red' onClick={() => setEditMode(false)}>
                            취소
                        </Button>
                    </Flex>
                </FormControl>
                :
                <Text pt='2' fontSize='sm' noOfLines={1}>
                    {content}
                </Text>
            }
            
            
            { 
                !editMode && (
                    <Box position={"absolute"} left={0} top={0} width={'100%'} maxW={`${mConstants.modalMaxWidth-100}px`} height={'40px'} >
                        <Flex justifyContent={'flex-end'}>
                            <Popover>
                                <PopoverTrigger>
                                    <Icon as={MdOutlineMoreVert} width="18px" height="18px" color="inherit" />
                                </PopoverTrigger>
                                <PopoverContent width={'150px'} bg={bgColor}>
                                <PopoverArrow />
                                <PopoverBody>
                                    <Flex flexDirection={'column'} alignItems={'flex-start'} gap={2}>
                                        <Button leftIcon={<Icon as={MdOutlineEdit} />} size='sm' onClick={() => setEditMode(true)}>
                                            이름변경
                                        </Button>
                                        <Button leftIcon={<Icon as={MdOutlineShare} />} size='sm' onClick={() => setIsOpenShare(true)}>
                                            공유하기
                                        </Button>
                                        <Button leftIcon={<Icon as={MdOutlineDelete} />} size='sm' onClick={onOpen} color={'red'}>  
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
                                    <Text fontSize={'15px'}>이름,공유 후 추가하는 모든 메시지가 비공개로 유지됩니다.</Text>
                                </Box>
                                <Input 
                                    type='text' 
                                    placeholder='공유 링크 주소' 
                                    value={inputs.shareLink} 
                                    onChange={(e) => console.log("cloick")} 
                                    color={textColor}

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
        </Box>
    )
};

export default HistoryItem;