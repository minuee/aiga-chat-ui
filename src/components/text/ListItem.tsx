import React from 'react';
import { Flex,Text,Divider,Box,List,ListItem,Icon,Button,useColorModeValue } from '@chakra-ui/react';
import { MdKeyboardDoubleArrowDown,MdKeyboardDoubleArrowUp } from 'react-icons/md';
import functions from '@/utils/functions';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { FiChevronDown,FiChevronUp } from "react-icons/fi";

type ListItemScreenProps = {
    title: string;
    content: any;
    limintView: number;
    marginTop?: number;
    isType:string;
};
  
const ListItemScreen = ({ title = "", content, limintView = 3, marginTop = 2 ,isType='career'}:ListItemScreenProps) => {
    const [expandedCount, setExpandedCount] = React.useState<any>(content.length > limintView ? limintView : undefined);
    
    const nameText = useColorModeValue('#000000','white');
    const textColor = useColorModeValue('#5C5E69','white');
    const iconBgColor = useColorModeValue('#E9EDF3','navy.600')
    const iconColor = useColorModeValue('#555',"white");

    const [isExpanded, setIsExpanded] = React.useState(false);
    const visibleItems = isExpanded ? content : content.slice(0, limintView);
    const handleToggle = () => setIsExpanded((prev) => !prev);

    return (
        <Flex  flexDirection={'column'} justifyContent={'center'} mt={marginTop} minWidth={0}>
            <CustomTextBold700 fontSize={'15px'} color={nameText}>{title}</CustomTextBold700>
            <Box 
                mt={3}
            >
                <List spacing={2}>
                    {visibleItems.map((item:any, index:number) => (
                        <ListItem key={index}>
                            <CustomText fontSize={'15px'}  color={textColor} letterSpacing={"-5%"}>
                            {
                                isType == 'education' 
                                ?
                                functions.stripHtmlTags(item?.action)
                                :
                                isType == 'career' 
                                ?
                                functions.stripHtmlTags(item?.action)
                                :
                                functions.stripHtmlTags(item)
                            }
                            </CustomText>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {
                content.length > limintView && 
                (
                    <Box display={'flex'} width="100%" alignItems={'center'} my="10px">
                        <Button
                            size="sm"
                            backgroundColor={iconBgColor}
                            borderRadius={0}
                            py={"3px"}
                            variant="link"
                            colorScheme="slate"
                            onClick={handleToggle}
                            id="button_toggle"
                        >
                            {isExpanded ? <Icon as={FiChevronUp} color={iconColor} /> : <Icon as={FiChevronDown} color={iconColor} />}
                        </Button>
                    </Box>
                )
            }
            
        </Flex>
    )
};

export default React.memo(ListItemScreen);