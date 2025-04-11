import { useRef,useEffect } from "react";
import functions from "../../utils/functions";
import { Box,Flex,Text,useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import BgImage from "@/assets/images/select_body_point.png";

type SelectBodyProps = {
    /* windowSrc?: string;
    title: string;
    width?: number;
    height?: number;
    children: React.ReactNode;*/
    onSendButton: (str: string) => void; 
};

const SelectBody = ({
   /*  windowSrc = "",
  title,
  width = 600,
  height = 600,
  children,*/
  onSendButton, 
}: SelectBodyProps) => {

  return (
    <Flex
      alignItems={"center"}
      mt="20px"
      padding={'10px'}
      justifyContent={'flex-start'}
      minWidth={'100%'}
      width={'auto'}
      overflowX={'auto'}
    >
      <Image 
        src={BgImage}
        alt="images"
        useMap="#image-map" 
        style={{width:'461px',objectFit: 'contain',maxWidth:"461px"}}
      />
      <map name="image-map">
          <area alt="전신" title="전신"  coords="1,4,241,330" shape="rect" onClick={() => onSendButton('전신')} />
          <area alt="머리외" title="머리외"  coords="252,5,452,112" shape="rect" onClick={() => onSendButton('머리,눈,귀,코,목,감상선')} />
          <area alt="기관지내" title="기관지내"  coords="451,229,250,118" shape="rect" onClick={() => onSendButton('기관지,폐,식도,심장,유방')} />
          <area alt="위등" title="위등" coords="454,444,255,241" shape="rect" onClick={() => onSendButton('위,간,췌장,담관,대장,항문,신장,비노기,전립선,자궁,난소')}  />
          <area alt="근골격등" title="근골격등" coords="253,447,452,544" shape="rect" onClick={() => onSendButton('근골격(척추,골반,사지,관철)')} />
          <area alt="기타" title="기타" coords="11,341,236,540" shape="rect" onClick={() => onSendButton('기타')} />
      </map>
    </Flex>
  )
    
};
  
export default SelectBody;