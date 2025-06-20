import Image from "next/image";
import { Box,Flex,Text,useColorModeValue ,UnorderedList,ListItem} from '@chakra-ui/react';
import functions from "@/utils/functions";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

type SimpleListMessageProps = {
    msg: any;
    indexKey : any
};

const SimpleListMessage = ({  msg = [], indexKey}: SimpleListMessageProps) => {

  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'white');
  const textSystemColor = useColorModeValue('#212127', 'navy.800');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  
  return (
    <Flex w="100%" key={indexKey} flexDirection={'column'} mt="10px">
      <UnorderedList>
      { 
        !functions.isEmpty(msg?.hospitals) && 
        msg.map((element:any,index:number) => {
          return (
            <Box key={index}>
              <ListItem><CustomText fontSize={'17px'} color={textSystemColor}>{element}</CustomText></ListItem>
            </Box>
          )
        })
      }
      </UnorderedList>
    </Flex>
  )
};
  
export default SimpleListMessage;