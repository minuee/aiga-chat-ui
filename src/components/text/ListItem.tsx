import React from 'react';
import { Flex,Text,Divider,Box,List,ListItem,ListIcon,Button } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
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
        <Flex padding={'0 10px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={marginTop}>
            <Text>{title}</Text>
            <Divider orientation='horizontal' my={2}/>
            <Box 
                noOfLines={expandedCount}
            >
                <List spacing={2}>
                    {content.map((item:any, index:number) => (
                        <ListItem key={index}>
                            <ListIcon as={MdCheckCircle} color='green.500' />
                            {item}
                        </ListItem>
                    ))}
                </List>
            </Box>
            {
                content.length > limintView && 
                (
                    <Button
                        size="sm"
                        variant="link"
                        fontWeight="bold"
                        colorScheme="slate"
                        textDecoration="underline"
                        onClick={handleToggle}
                        id="button_toggle"
                    >
                        {!expandedCount ? '감추기' : '더 보기'}
                    </Button>
                )
            }
            
        </Flex>
    )
};

export default React.memo(ListItemScreen);