'use client';
import React, { PropsWithChildren } from 'react';
import { Box,Flex,Text,useColorModeValue ,UnorderedList,ListItem} from '@chakra-ui/react';
import functions from "@/utils/functions";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconChatAiga} from '@/components/icons/svgIcons';
type SimpleListMessageProps = {
    msg: any;
    isHistory : boolean;
    indexKey : any
};

const SimpleListMessage = ({  msg = [], indexKey, isHistory = false}: SimpleListMessageProps) => {

  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  const [hospitalsList, setHospitalsList] = React.useState([]);

  React.useEffect(() => {
    if ( functions.isEmpty(msg?.hospitals) ) {
      const reData = functions.parseMaybeJson(msg?.hospitals)
      setHospitalsList(reData);
    }else{
      setHospitalsList(msg?.hospitals);
    }
  }, [indexKey]);

  if ( hospitalsList?.length == 0 ) {
    return (
      <Flex w="100%" flexDirection={'column'} px="5px">
        <Box my="5px">
          <IconChatAiga width={'46px'} height={"12px"} />
        </Box>
        <Flex 
          padding="12px 20px" 
          border={`1px solid ${bgSystemColor}`} 
          bgColor={bgSystemColor} 
          borderTopLeftRadius="2px" 
          borderTopRightRadius="20px" 
          borderBottomLeftRadius="20px"
          borderBottomRightRadius="20px" 
          w="auto" 
          zIndex={2}
          justifyContent={'center'}
          flexDirection={'column'}
        > 
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>해당 병원을 찾을 수 없습니다.</CustomText> 
        </Flex>
      </Flex>
    )
  }
  return (
    <Flex w="100%" flexDirection={'column'}  px="5px">
      <Box my="5px">
        <IconChatAiga width={'46px'} height={"12px"} />
      </Box>
      <Flex 
        padding="12px 20px" 
        border={`1px solid ${bgSystemColor}`} 
        bgColor={bgSystemColor} 
        borderTopLeftRadius="2px" 
        borderTopRightRadius="20px" 
        borderBottomLeftRadius="20px"
        borderBottomRightRadius="20px" 
        w="auto" 
        zIndex={2}
        justifyContent={'center'}
        flexDirection={'column'}
      > 
        {
          !functions.isEmpty(msg?.department) && (
            <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>{msg?.department} 진료를 잘하는 병원 {hospitalsList?.length}군데를 추천 드리겠습니다.</CustomText>
          )
        }
        <Flex 
          padding="12px 20px" 
          border={`1px solid ${bgSystemColor}`} 
          bgColor={bgSystemColor} 
          borderTopLeftRadius="2px" 
          borderTopRightRadius="20px" 
          borderBottomLeftRadius="20px"
          borderBottomRightRadius="20px" 
          w="auto" 
          zIndex={2}
          alignItems={'center'}
        > 
        <UnorderedList>
        { 
          hospitalsList.map((element:any,index:number) => {
            return (
              <Box key={index}>
                <ListItem><CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>{element?.name}</CustomText></ListItem>
              </Box>
            )
          })
        }
        </UnorderedList>
        </Flex>
      </Flex>
    </Flex>
  )
};
  
export default SimpleListMessage;