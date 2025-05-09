'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Drawer,DrawerBody,Icon,useColorModeValue,DrawerOverlay,useDisclosure,DrawerContent,DrawerCloseButton } from '@chakra-ui/react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { renderThumb,renderTrack,renderView } from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import HeadTitle from './Title';
import mConstants from '@/utils/constants';

export interface NoticerModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

const items = [
  { idx: 1, title: "First Item", text: "Some value 1..." },
  { idx: 2, title: "Second Item", text: "Some value 2..." },
  { idx: 3, title: "Third Item", text: "Some value 3..." },
  { idx: 4, title: "Third Item", text: "Some value 3..." },
  { idx: 5, title: "Third Item", text: "Some value 3..." },
]

function NoticerModal(props: NoticerModalProps) {
  const { isOpen, setClose } = props;
  const [ isLoading, setLoading] = React.useState(true);
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');

  React.useEffect(() => {
    console.log("isLoading",isOpen,isLoading)
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [isOpen]);
  
 
  // SIDEBAR
  return (
    <Box display={{ base: 'block', xl: 'block' }} position="fixed" minH="100%">
      <Drawer
        isOpen={isOpen}
        onClose={setClose}
        placement={'left'}
      >
        <DrawerOverlay />
        <DrawerContent
          w="100%"
          maxW={`${mConstants.modalMaxWidth}px`}
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <HeadTitle title="공지사항" />
          <DrawerCloseButton
            zIndex="3"
            onClick={setClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW={`${mConstants.modalMaxWidth}px`} px="0rem" pb="10">
            
            <Scrollbars
              universal={true}
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Box sx={{width:'calc( 100% - 20px)',heigh:"90%",padding:'10px'}}>
                {
                  isLoading 
                  ?
                  <Box padding='6' boxShadow='lg' bg='white'>
                    {/* <SkeletonCircle size='10' /> */}
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
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}


export default NoticerModal;
