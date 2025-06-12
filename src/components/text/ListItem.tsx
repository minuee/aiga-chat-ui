import React from 'react';
import { Flex,Text,Divider,Box,List,ListItem,Icon,Button } from '@chakra-ui/react';
import { MdKeyboardDoubleArrowDown,MdKeyboardDoubleArrowUp } from 'react-icons/md';
type ListItemScreenProps = {
    title: string;
    content: any;
    limintView: number;
    marginTop?: number;
};
  
const ListItemScreen = ({ title = "", content, limintView = 3, marginTop = 2 }:ListItemScreenProps) => {
    const [expandedCount, setExpandedCount] = React.useState<any>(content.length > limintView ? limintView : undefined);
    const handleToggle = () =>
    setExpandedCount(expandedCount ? undefined : limintView);
  
    return (
        <Flex  flexDirection={'column'} justifyContent={'center'} mt={marginTop}>
            <Text fontSize={'15px'} fontWeight={'bold'} color="#000000">{title}</Text>
            {/* <Divider orientation='horizontal' my={2}/> */}
            <Box 
                noOfLines={expandedCount}
                mt={3}
            >
                <List spacing={2}>
                    {content.map((item:any, index:number) => (
                        <ListItem key={index}>
                            <Text fontSize={'15px'} fontWeight={'normal'} color="#5C5E69" letterSpacing={"-5%"}>{item}</Text>
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
                            backgroundColor={'#E9EDF3'}
                            borderRadius={0}
                            py={"3px"}
                            variant="link"
                            colorScheme="slate"
                            onClick={handleToggle}
                            id="button_toggle"
                        >
                            {!expandedCount ? <Icon as={MdKeyboardDoubleArrowUp} color={'#555'} /> : <Icon as={MdKeyboardDoubleArrowDown} color={'#555'} />}
                        </Button>
                    </Box>
                )
            }
            
        </Flex>
    )
};

export default React.memo(ListItemScreen);