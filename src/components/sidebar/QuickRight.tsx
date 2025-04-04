'use client'

import * as React from 'react';
import Link from "next/link"
import Image from 'next/image';
import { Box,Stack,Flex,Icon,Img,Input,Text,Progress,} from '@chakra-ui/react';
import BgImage from "@/assets/images/etc/sub-quick-bar-box.png";


import IconInfo from "@/assets/images/etc/icon-sub-quick-info.png";
import IconEvent from "@/assets/images/etc/icon-sub-quick-event.png";
import IconReservation from "@/assets/images/etc/icon-sub-quick-reservation.png";


type QuickRightProps = {
  isMode? : string;
};
const QuickRight : React.FC<QuickRightProps> = ({isMode}) => {
 
  return (
      <Box sx={styles.mainWrapper}>
        <Image 
          src={BgImage}  
          alt="slide" 
          style={{width:'90px', height:'286px',objectFit: 'cover',zIndex:1}}
        />  
        <Box sx={styles.topWrapper} >
          <Link
             href="/chat"
            target='_blank'
          >
          <Image 
            src={IconInfo}  
            alt="slide" 
            style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
          />  
          <Text variant="sourceHanSans" sx={styles.titleStyle}>
            AIGA
          </Text>
          </Link>
        </Box>
        <Box sx={styles.middleWrapper} >
          <Image 
            src={IconEvent}  
            alt="slide" 
            style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
          />  
          <Text variant="sourceHanSans" sx={styles.titleStyle}>
            Event
          </Text>
        </Box>
        <Box sx={styles.bottomWrapper} >
          <Image 
            src={IconReservation}  
            alt="slide" 
            style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
          />  
          <Text variant="sourceHanSans" sx={styles.titleStyle}>
            예약
          </Text>
        </Box>
      </Box>
  );
}

const styles = {
  mainWrapper : {
    display:'flex',width:'90px',height:'286px',flexDirection:'column',backgroundColor:'transparent'
  },
  topWrapper : {
    position:'absolute',left:0,top:0,display:'flex',width:'100%',height:'110px',justifyContent:'center',alignItems:'center',flexDirection:'column',zIndex:2,cursor:'pointer'
  },
  middleWrapper : {
    position:'absolute',left:0,top:85,display:'flex',width:'100%',height:'110px',justifyContent:'center',alignItems:'center',flexDirection:'column',zIndex:2,cursor:'pointer'
  },
  bottomWrapper : {
    position:'absolute',left:0,top:170,display:'flex',width:'100%',height:'110px',justifyContent:'center',alignItems:'center',flexDirection:'column',zIndex:2,cursor:'pointer'
  },
  titleStyle : {
    color:'#fff',fontSize:'13px',lineHeight:'normal',letterSpacing:"-0.28px",opacity:0.8,fontWeight:'500'
  }
}

export default QuickRight;