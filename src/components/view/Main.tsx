'use client';

import React, { Children } from 'react';
import { Box,Stack,Flex,Icon,Img,Input,Text,Progress,} from '@chakra-ui/react';
import Image from "next/image";
import Footer from '@/components/footer/MainFooter';
import Header from '@/components/header/MainHeader';
import * as mConst from "@/utils/constants";
import QuickRight from "@/components/sidebar/QuickRight";
import {useTranslations} from 'next-intl';

import MainBgImage from "@/assets/images/etc/bg_1.png";
import MainBgImage2 from "@/assets/images/etc/bg_2.png";
import MiniMiddle12F from "@/assets/images/etc/mini_middle_12f.png";
import MiniSmall3F from "@/assets/images/etc/mini_small_3f.png";


export default function MainPage() {

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showPopDetail, setShowPopDetail] = React.useState(9);
  const [progress, setProgress] = React.useState(0);
  const [isOpenWindow, setOpenWindow] = React.useState(false);
  const elementRef = React.useRef(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const valueRef = React.useRef(0);
  const t = useTranslations('Titles');

  const onClickChageIndex = React.useCallback(
    (num:number,element:any) => {
      setActiveIndex(num);
      let scrollAmount = num*250;
      element.scrollLeft = scrollAmount;   
    },
    [activeIndex]
  );

/* 
  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
  
      setProgress((oldProgress) => {
          
        if (oldProgress === 100) {
          if ( activeIndex == mConst.sungwonjungThumb.length ) {
            valueRef.current =  1
          }else{
            valueRef.current += 1; 
          }
          return 0;
        }
        const diff = 1;
        return oldProgress + diff;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); */

/* 
  React.useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
          
        if (oldProgress === 100) {
          if ( activeIndex == mConst.sungwonjungThumb.length ) {
              setActiveIndex(0)
          }else{
              setActiveIndex(activeIndex+1)
          }
          return 0;
        }
        const diff = 1;
        return oldProgress + diff;
      });
    }, 100);

    if ( showPopDetail != 9  ) {
      setProgress(0);
      setActiveIndex(9)
      clearInterval(timer);
    }else{
      setProgress(0);
      setActiveIndex(activeIndex == 9 ? 0 : activeIndex)
    }
    return () => {
      clearInterval(timer);
    };
  }, [activeIndex,showPopDetail]); */

  const openQuickMenu = (val:number) => {
      setShowPopDetail(val);
  }

  return (
    <Box sx={styles.wrapper} minWidth={{base:'100%', md:'1600px'}} minHeight={{base:'100%', md:'100vh'}} >
      <Header />
      <Box sx={styles.outerWrap} minWidth={{base:'100%', md:'1600px'}} minHeight={{base:'100%', md:'100vh'}}>
        <Box sx={styles.quickWrap}>
          <QuickRight />
        </Box>
        <Stack hideFrom="mobile">
          <Image 
            alt={"main"}
            src={activeIndex%2 == 0 ?  MainBgImage :  MainBgImage2 }
            placeholder="blur"
            fill
            className={progress < 20 ? "fade-in-image" : ""}
            /* sizes="100%"
            style={{
                objectFit: 'cover'
            }} */
          />
        </Stack>
        <Box sx={styles.contentWrapper} minWidth={{base:'100%', md:'1600px'}} height='calc( 100vh - 200px )'>
          <Text variant="sourceHanSans" sx={{color:'#fff',fontSize:'48px',lineHeight:'3em'}}>
            {activeIndex%2 == 0 ? t('title') : '병원추천 AIGA'}
          </Text>
          <Text variant="sourceHanSans" sx={{color:'#fff',fontSize:'22px'}}>
          {
            activeIndex %2 == 0?  
            `의사추천 안내 메시지 1 의사추천 안내 메시지 1 의사 추천합시다`
            :
            `의사추천 안내 메시지 2 의사추천 안내 메시지 2 의사 추천합시다`
          }
          </Text>
          <Text variant="sourceHanSans" sx={{color:'#fff',fontSize:'22px'}}>
          {
            activeIndex %2 == 0?  
            `느껴지는 구성으로 매일 신선하고 건강한 상차림을 제공합니다.`
            :
            `풍부한 육즙과 부드러운 육질을 제공합니다.`
          }
          </Text>
        </Box>
        <Box sx={styles.miniWrapper} minWidth={{base:'100%', md:'1600px'}} ref={elementRef} >
          <Box sx={styles.miniInsideWrapper} minWidth={{base:'100%', md:'850px'}} >
            {
              mConst.sungwonjungThumb.map((item:any,index:number) => {
                return (
                  <Box
                    key={index} 
                    sx={{...styles.miniBoxWrapper,height: activeIndex == index ? '66px' : "56px", border : activeIndex == index ? "2px solid #fff" : "0.3px solid #ccc"}} onClick={()=> onClickChageIndex(index,elementRef.current)}
                  >
                    <Image 
                      src={index%2 == 0 ? MiniSmall3F : MiniMiddle12F}  
                      alt="slide" 
                      style={{width:'100%', height:'100%',borderRadius:'10px',objectFit: 'cover',opacity: activeIndex == index ? 1 :  0.4}}
                    />  
                    <Box sx={styles.miniTextWrapper}>
                        <Text variant="sourceHanSans" sx={{color:'#fff',fontSize:'18px'}}>{item.name}</Text>
                    </Box>
                    {activeIndex == index && (
                        <Box sx={styles.progressBar}>
                            <Progress hasStripe height='2px' width="100%" value={progress} />
                        </Box>
                    )}
                  </Box>
                )
              })
            }
          </Box>
        </Box>
      </Box>
          
      <Box sx={{position:'absolute',left:0,top:"100vh",width:'100%',heigth:"100px",backgroundColor:"#ffffff"}}>
        <Footer />
      </Box>
    </Box>
  )
}



const styles = {
  wrapper : {
      display:'flex',flexDirection:'column',justifyContent:'flex-start',backgroundColor : "#ffffff",
  },
  outerWrap : {
      display:'flex',backgroundColor:'transparent',
  },
  contentWrapper : {
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'absolute',left:0,top:0,
  },
  miniWrapper : {
      display:'flex',flexDirection:'colomn',alignItems:'center',justifyContent:'center',position:'absolute',left:0,bottom:'40px', width:'100%',height:'100px'
  },
  miniInsideWrapper : {
      display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',height:'100%'
  },
  miniBoxWrapper : {
      position: 'relative',height:'100%',width:'204px',border:'2px solid #fff',borderRadius:'10px',cursor:"pointer"
  },
  miniTextWrapper : {
      zIndex: 2,position: 'absolute',height: '100%',width: '204px',textAlign: 'center',top:0,left:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'
  },
  moreBtn : {
      border:'1px solid #ffffff',borderRadius:'5px',padding:'2px',marginTop:'3px'
  },
  progressBar : {
      position:'absolute',left:0,bottom:"-2px",width:'100%',height:'2px'
  },
  quickWrap : {
      position:'fixed',display:'flex',justifyContent:'center',alignItems:'center',right:"-12px",top:"300px",width:'90px',heigth:"286px",zIndex:100
  }
}