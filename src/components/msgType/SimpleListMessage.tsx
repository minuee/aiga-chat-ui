'use client';
import React, { PropsWithChildren } from 'react';
import { Box,Flex,Text,useColorModeValue ,UnorderedList,ListItem} from '@chakra-ui/react';
import functions from "@/utils/functions";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import LogoImage from "@/assets/images/logo.png";
import Image from "next/image";

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
  
  React.useEffect(() => {
    console.log('msg',msg)
  }, [indexKey]);
  indexKey
  return (
    <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
      <Box my="5px">
        <Image 
          src={LogoImage}
          alt="Aiga Logo"
          style={{width:'45px',objectFit: 'contain'}}
        />
      </Box>
      <UnorderedList>
      { 
        !functions.isEmpty(msg?.hospitals) && 
        msg.hospitals.map((element:any,index:number) => {
          return (
            <Box key={index}>
              <ListItem><CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>{element?.name}</CustomText></ListItem>
            </Box>
          )
        })
      }
      </UnorderedList>
    </Flex>
  )
};
  
export default SimpleListMessage;