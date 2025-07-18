'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import {Flex,Box,useColorModeValue,SkeletonText } from '@chakra-ui/react';
import * as history from '@/utils/history';
import { usePathname } from 'next/navigation';
import * as CommonService from "@/services/common/index";
import mConstants from '@/utils/constants';
import * as mCookie from "@/utils/cookies";
import { ModalMypageNoticeDetailStore } from '@/store/modalStore';
import { IconNotice } from '@/components/icons/svgIcons';
import NoticeDetail from "@/components/modal/NoticeDetail";
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";

export interface NoticeListModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
}

function NoticeListModal(props: NoticeListModalProps) {
  
  const { isOpen, setClose } = props;
  const pathname = usePathname();
  const pathnameRef = React.useRef(pathname);
  const [isLoading, setIsLoading] = React.useState(true);
  const [noticeList, setNoticeList] = React.useState<any>([]);
  const [selectNoticeId, setSelectNoticeId] = React.useState(null);

  const { isOpenNoticeDetailModal } = ModalMypageNoticeDetailStore(state => state);
  const setIsOpenNoticeDetailModal = ModalMypageNoticeDetailStore((state) => state.setIsOpenNoticeDetailModal);

  const skeletonColor = useColorModeValue('white', 'navy.800');
  const textColor2 = useColorModeValue('#7F879B', 'white');
  const titleColor = useColorModeValue('#212127', 'white');
  const dateColor = useColorModeValue('#7F879B', 'white');
  const bgColor = useColorModeValue('white', 'navy.800');
  
  React.useEffect(() => {
    getNoticeListData();
    setIsOpenNoticeDetailModal(false)
    setTimeout(() => {
      setIsLoading(false);
    }, 60);
  }, [isOpen]);


  const getNoticeListData = async() => {
    try{
      const res:any = await CommonService.getNoticeList();
      if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
        setNoticeList(res?.data?.notice)
        setIsLoading(false)
      }      
      setIsLoading(false)
    }catch(e:any){
      setIsLoading(false)
    }
  }

  const onSendNoticeListButton = async(nid:any) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_5_2}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_5_2}`)
    setIsOpenNoticeDetailModal(true)
    setSelectNoticeId(nid)
  }

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{
    return (
      <>
        <Flex display={isOpenNoticeDetailModal ? 'block' : 'none'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} width={'100%'}>
          <NoticeDetail
            noticeID={selectNoticeId}
          />
        </Flex>
        <Flex display={isOpenNoticeDetailModal ? 'none' : 'block'} flexDirection={'row'} justifyContent={'center'} alignItems={'flex-start'} width={'100%'} >
          <Box sx={{width:'100%',heigh:"100%"}}>
            {
              noticeList?.length == 0 
              ?
              <Flex flexDirection={'column'} justifyContent={'center'} minHeight={'calc( 100vh - 300px )'} width={'100%'} mt={5}>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'}> 
                  <IconNotice boxSize={'40px'}/>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'} mt="20px"> 
                  <CustomText fontSize={'17px'} color={textColor2}>
                    공지사항이 없습니다.
                  </CustomText>
                </Box>
              </Flex>
              :
              <Flex flexDirection={'column'}  minHeight={'calc( 100vh - 300px )'} width={'100%'} mt={5}>
              {
                noticeList.map((element:any, index:number) => {
                  return (
                    <Flex 
                      key={index} 
                      flexDirection={'column'} minHeight={'70px'} borderBottom={'1px solid #DFE3EA'} mb="20px"
                      cursor={'pointer'} onClick={() => onSendNoticeListButton(element)}
                    >
                      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                        <CustomTextBold700 fontSize={'17px'} color={titleColor} lineHeight={"150%"}>{element.title}</CustomTextBold700>
                        <CustomText fontSize={'13px'} color={dateColor} lineHeight={"150%"}>{element.date}</CustomText>
                      </Box>
                    </Flex>
                  )
                })
              }
              </Flex>
            }
          </Box>
        </Flex>
      </>
    )
  }
}

export default NoticeListModal;