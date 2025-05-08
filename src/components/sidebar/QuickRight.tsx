'use client'

import * as React from 'react';
//import Link from "next/link"
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import { Box,Button,Flex,Icon,Img,Input,Text,Progress,} from '@chakra-ui/react';
import * as mCookie from "@/utils/cookies";
import PopWondowScreen from "@/components/modal/PopWindow";
import ChatScreenModal  from '@/components/modal/ChatScreen';

import BgImage from "@/assets/images/etc/sub-quick-bar-box.png";
import IconInfo from "@/assets/images/etc/icon-sub-quick-info.png";
import IconEvent from "@/assets/images/etc/icon-sub-quick-event.png";
import IconReservation from "@/assets/images/etc/icon-sub-quick-reservation.png";
import { routing } from '@/i18n/routing';
import functions from '@/utils/functions';

const QuickRight : React.FC = () => {
  const [isOpenDoctorModal, setIsOpenDoctorModal] = React.useState<boolean>(false);
  const [locale, setLocale] = React.useState<string>(routing.defaultLocale);

  React.useEffect(() => {  
    const locale = mCookie.getCookie('currentLocale'); 
    if ( !functions.isEmpty(locale) ) {
      setLocale(locale);
    }
  },[isOpenDoctorModal]);

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
            <Flex flexDirection={'column'} alignItems='center'>
              <Image 
                src={IconInfo}  
                alt="slide" 
                style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
              />  
              <Text variant="sourceHanSans" sx={styles.titleStyle}>
                Page이동
              </Text>
            </Flex>
          
          </Link>
        </Box>
        <Box sx={styles.middleWrapper} >
          <PopWondowScreen
            url={`/${locale}/chat`}
            window_width={500}
            window_height={750}
          >
            <Flex flexDirection={'column'} alignItems='center'>
              <Image 
                src={IconEvent}  
                alt="slide" 
                style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
              />  
              <Text variant="sourceHanSans" sx={styles.titleStyle}>
                Window
              </Text>
            </Flex>
          </PopWondowScreen>
        </Box>
        <Box sx={styles.bottomWrapper} >
          <Flex flexDirection={'column'} alignItems='center' onClick={() => setIsOpenDoctorModal(!isOpenDoctorModal)}>
            <Image 
                src={IconReservation}  
                alt="slide" 
                style={{width:'25px',objectFit: 'contain',marginBottom:'3px'}}
              />  
              <Text variant="sourceHanSans" sx={styles.titleStyle}>
                Drawer
              </Text>
            </Flex>
        </Box>
        {
          isOpenDoctorModal && (
            <ChatScreenModal
              isOpen={isOpenDoctorModal}
              setClose={() => setIsOpenDoctorModal(false)}
            />
          )
        }
       

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