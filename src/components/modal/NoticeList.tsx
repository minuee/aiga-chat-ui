'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import {Flex,Box,useColorModeValue,Accordion,AccordionItem,AccordionButton,AccordionPanel,AccordionIcon,SkeletonText,SkeletonCircle } from '@chakra-ui/react';
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";

import { ModalDoctorDetailStore } from '@/store/modalStore';

import { loadingImage } from "@/components/icons/IconImage";

const items = [
  { idx: 1, title: "First Item", text: "Some value 1..." },
  { idx: 2, title: "Second Item", text: "Some value 2..." },
  { idx: 3, title: "Third Item", text: "Some value 3..." },
  { idx: 4, title: "Third Item", text: "Some value 3..." },
  { idx: 5, title: "Third Item", text: "Some value 3..." },
]

export interface NoticeListModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function NoticeListModal(props: NoticeListModalProps) {
  
  const { isOpen, setClose } = props;
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = React.useRef(pathname);
  const [isLoading, setIsLoading] = React.useState(true);

  const skeletonColor = useColorModeValue('white', 'navy.800');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{
    return (
      <>
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} minHeight={'20px'}>
          <Box sx={{width:'100%',heigh:"90%",padding:'10px'}}>
            {
              isLoading 
              ?
              <Box padding='6' boxShadow='lg' bg={skeletonColor}>
                <SkeletonText noOfLines={5} spacing='4' skeletonHeight='10' />
              </Box>
              :
              <Accordion defaultIndex={[0]} allowMultiple>
              {
                items.map((element, index) => {
                  return (
                    <AccordionItem key={index}>
                      <h2>
                        <AccordionButton>
                          <Box as='span' flex='1' textAlign='left'>
                            Section {index+1} title
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        동해물과 백수산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 
                        이걸 {index + 1} 반복하세요 
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })
              }
              </Accordion>
            }
          </Box>
        </Flex>
      </>
    )
  }
}

export default NoticeListModal;