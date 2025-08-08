import React, { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import { Box,Flex,Stack,useColorModeValue,useColorMode,Icon, Modal,ModalOverlay,ModalContent,ModalHeader,SimpleGrid,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import { ModalDoctorListStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorDetailStore } from '@/store/modalStore';
import DoctorList from "@/components/modal/DoctorList";
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { BiChevronRight } from "react-icons/bi";
import { IconChatAiga,DefaultHeaderLogo } from '@/components/icons/svgIcons';
import DoctorAvatar from "@/assets/images/doctor_default_white.png";
import { MdOutlineArrowForward } from 'react-icons/md';
import TypeAnimation  from'@/components/text/TypeAnimation2';

function convertLinksAndImagesToHTML(text: string): string {
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const imageRegex = /\.(jpeg|jpg|png|gif|bmp|webp)(\?.*)?$/i;

  const imageUrls: string[] = [];

  // 1. Markdown 이미지 처리
  let convertedText = text.replace(markdownImageRegex, (_, alt, url) => {
    const cleanUrl = url.trim();
    imageUrls.push(cleanUrl);
    return `
      <img
        src="${cleanUrl}"
        alt="이미지"
        data-url="${cleanUrl}"
        style="max-width: 100%; height: auto; max-height: 100px; min-width: 100px; object-fit: contain; border-radius: 8px; display: block; cursor: pointer;"
      />
    `;
  });

  // 2. 일반 URL 처리 (단, HTML 태그 내부는 제외)
  const urls = convertedText.match(urlRegex);
  const uniqueUrls = Array.from(new Set(urls ?? []));

  convertedText = convertedText.replace(urlRegex, function (rawUrl, _1, offset, fullText) {
    const cleanUrl = rawUrl.trim();
  
    // HTML 태그 내부에 있으면 무시
    const before = fullText.lastIndexOf('<', offset);
    const after = fullText.indexOf('>', offset);
    const isInsideTag = before !== -1 && after !== -1 && before < offset && offset < after;
  
    if (isInsideTag) return rawUrl;
  
    if (imageUrls.includes(cleanUrl)) return rawUrl;
  
    if (imageRegex.test(cleanUrl)) {
      return `
        <img
          src="${cleanUrl}"
          alt="이미지"
          data-url="${cleanUrl}"
          style="max-width: 100%; height: auto; max-height: 100px; min-width: 100px; object-fit: contain;border-radius: 8px; display: block; cursor: pointer;"
        />
      `;
    } else {
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">${cleanUrl}</a>`;
    }
  });

  // 3. 사이트 바로가기 링크 (이미지가 하나도 없을 경우에만)
  const hasImage = imageUrls.length > 0;

  const firstTextLink = uniqueUrls.find((url) => {
    const cleanUrl = url.trim();
    return !imageRegex.test(cleanUrl) && !imageUrls.includes(cleanUrl);
  });

  const shortcut = !hasImage && firstTextLink
    ? `<br><a href="${firstTextLink.trim()}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">☞ 사이트 바로가기</a>`
    : '';

  return convertedText + shortcut;
}


type RecommandDoctorProps = {
    data : any;
    summary : any;
    isHistory : boolean;
    onSendButton: (data: any,id:number) => void; 
    isLiveChat? : boolean,
    setIsTypingDone: () => void;
};

const RecommandDoctor = ({  onSendButton , data, isHistory ,summary,isLiveChat,setIsTypingDone }: RecommandDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('navy.700', 'white')
  const flexRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [isLocalTypeDone, setLocalTypeDone] = useState(true)
  const [doctorList, setDoctorList] = useState([]);
  const [selectChatId, setSelectselectChatId] = useState(0);
  const isDark = useColorModeValue(false, true);
  const { isOpenDocListModal,chatId,doctorAllList } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.700');
  const arrowColor = useColorModeValue("#000000",'white')
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const profileBgColor = useColorModeValue("#F4F6FA",'navy.600');
  const nameTextColor = useColorModeValue('#17191D','white')
  const partTextColor = useColorModeValue('#7F879B','white')
  const iconColor = useColorModeValue('#0AA464','#0AA464');
  const navbarIcon = useColorModeValue('#7F879B', 'white');
  const navbarBgColor = useColorModeValue('white', 'navy.800');
  let navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');

  const previousOutputRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ( !functions.isEmpty(summary)) previousOutputRef.current =  summary; 
    else previousOutputRef.current = null
  }, [summary]);

  const isOutputSame = previousOutputRef.current === summary && previousOutputRef.current !== null;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.dataset.url) {
        const url = target.dataset.url;
        const width = window.innerWidth < 500 ? window.innerWidth : 600;
        const height = window.innerHeight < 600 ? window.innerHeight : 600;
  
        const popup = window.open('', '_blank', `width=${width},height=${height},resizable=yes,scrollbars=yes`);
        if (popup) {
          popup.document.write(`
            <html>
              <head>
                <title>AIGA PupUP 이미지 보기</title>
                <style>
                  body {
                    margin: 0;
                    background: #000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                  }
                  img {
                    max-width: 100vw;
                    max-height: 100vh;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                  }
                  .close-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                    border: none;
                    border-radius: 24px;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                  }
                  .close-btn:hover {
                    background: rgba(255,255,255,0.4);
                  }
                </style>
              </head>
              <body>
                <button class="close-btn" onclick="window.close()">✕</button>
                <img src="${url}" alt="이미지" />
              </body>
            </html>
          `);
          popup.document.close();
        }
      }
    };
  
    // 전역 등록
    document.addEventListener('click', onClick);
  
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);
  
  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if ( ( scrollLeft + clientWidth + 200 ) >= scrollWidth ) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const flexElement = flexRef.current;
      if (flexElement) {
        flexElement.addEventListener('scroll', handleScroll);
      }
      return () => {
        if (flexElement) {
          flexElement.removeEventListener('scroll', handleScroll);
        }
      };
    }, 500); // 0.5초 후에 강제 시도
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectselectChatId(!functions.isEmpty(data?.chat_id) ? data?.chat_id : !functions.isEmpty(data?.id) ? data?.id : 0)
    if ( !functions.isEmpty( data?.answer?.doctors )) {
      setDoctorList(data?.answer?.doctors)
      //setDoctorList(data?.answer?.doctors.slice(0, 3))
    }
  }, [data]);

  useEffect(() => {
    if ( ( isLiveChat && !functions.isEmpty(summary)  )  ) {
      setLocalTypeDone(false)
    }else{
      setLocalTypeDone(true)
    }
  }, [summary]);

  const setTypingCompleteDone = () => {
    setTimeout(() => {
      setLocalTypeDone(true)
      setIsTypingDone()
    }, 100);
  }

  const onSendDoctorListButton = async( id:any) => {
    history.push(`${pathnameRef?.current}#${mConstants.pathname_modal_1}`);
    mCookie.setCookie('currentPathname',`${mConstants.pathname_modal_1}`)   
    setIsOpenReview(false);
    setIsOpenRequestModal(false);
    setIsOpenDoctorDetailModal(false);
    setOpenDoctorListModal(true,id,doctorList);
  }

  const fn_close_modal_doctor_list = async() => {
    const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
    setOpenDoctorListModal(false,0,[]);
    router.replace(`/${locale}/chat`);
    setTimeout(() => {
      mCookie.setCookie('currentPathname','') 
    }, 200);
  }

  if ( doctorList?.length == 0 && functions.isEmpty(summary) ) {
    return (
      <Stack minWidth={'100%'} width={'auto'} minHeight={"50px"} maxHeight={"300px"} position={'relative'}>
        <Box>
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
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
          <Box>
            <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>추천할 의사를 찾을 수 없습니다.</CustomText>
          </Box>  
        </Flex>
      </Stack>
    )
  }else if ( doctorList?.length == 0  && !functions.isEmpty(summary)) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px" px="5px">
        <Box my="5px">
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
        </Box>
        <Box 
          display={summary?.length > 10 ? 'flex' : 'none'}
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
          <div
            ref={containerRef}
            style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{__html: convertLinksAndImagesToHTML(summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'))}}
          />
        </Box>
      </Flex>
    )
  }else{

    return (
      <Flex w="100%" flexDirection={'column'} mt="10px">
        <Box my="5px">
          { colorMode == 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} /> }
        </Box>
        <Box 
          display={summary?.length > 10 ? 'flex' : 'none'}
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
          mb="8px"
        > 
          <Box>
          {
              ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone)
              ?
              <TypeAnimation
                msg={ summary.replace(/^"(.*)"$/, '$1')}
                speed={30}
                onComplete={() => setTypingCompleteDone()}
              />
              :
              ( !isLiveChat && !functions.isEmpty(summary) )
              ?
              <div
                ref={containerRef}
                style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
                dangerouslySetInnerHTML={{__html: convertLinksAndImagesToHTML(summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'))}}
              />
              :
              ( !functions.isEmpty(summary) )
              ?
              <div
                ref={containerRef}
                style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
                dangerouslySetInnerHTML={{__html: convertLinksAndImagesToHTML(summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'))}}
              />
              :
              <div
                ref={containerRef}
                style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
                dangerouslySetInnerHTML={{__html: convertLinksAndImagesToHTML(summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'))}}
              />
            }
          </Box>
        </Box>
        <Stack
          minWidth={'100%'} width={'auto'} minHeight={"60px"} position={'relative'}
          sx={{
            '&::after': {
              content: ( isLocalTypeDone && showGradient && doctorList?.length > 3 ) ? '""' : 'none', position: 'absolute', top:0,right: 0,width: '200px',height: '100%',maxHeight : "250px",
              background:  isDark ? 'linear-gradient(to right, rgba(26, 54, 93, 0) 0%, rgba(26, 54, 93, 1) 100%)' : 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
              pointerEvents: 'none', // 클릭 이벤트 방지
            },
          }}
        >
          <Box  
            display={isLocalTypeDone ? 'flex' : 'none'}
            alignItems={"center"} justifyContent={'flex-start'} minWidth={'100%'} width={'auto'} minHeight={"60px"} maxHeight={"250px"} ref={flexRef} 
            overflowX={{ base : 'auto', sm : doctorList.length > 2 ? 'auto' : 'hidden'}}
          >
            {
              doctorList.slice(0, 9).map((element: any, index: number) => (
                <Flex 
                  key={index} 
                  bg={profileBgColor} 
                  //width={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                  //minWidth={ doctorList?.length >= 3 ? "calc(100% / 3)" : doctorList?.length == 2 ?  "calc(100% / 2)" :  "100%" }
                  width={ doctorList?.length === 1 ? "100%" : doctorList?.length === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }
                  minWidth={{ base : "150px" , sm2 : doctorList?.length === 1 ? "100%" : doctorList?.length === 2 ? "calc((100% - 8px) / 2)" : "calc((100% - 16px) / 3)" }}
                  padding="20px"
                  borderRadius="8px"
                  alignItems={'center'}
                  onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
                  flexDirection={{base : doctorList?.length === 1 ? 'row' : "column" , 'sm2' : doctorList?.length > 2 ? 'column' : 'row'}}
                  mr={index !== doctorList.length - 1 ? "8px" : "0px"}
                >
                  <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} maxWidth={"70px"}>
                    <NextImage 
                      src={DoctorAvatar}
                      alt="프로필이미지"
                      style={{ borderRadius: '50%', objectFit: 'cover' }} 
                      width={60} 
                      height={60}
                    />
                  </Box>
                  <Flex flex={4} flexDirection={'column'} justifyContent={'center'} px="20px" mt={doctorList?.length > 1 ? "10px" : 0}>
                    <Box display={'flex'}  justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'} height={'26px'}>
                      <CustomTextBold700 fontSize={'17px'} color={nameTextColor} lineHeight={"150%"} noOfLines={1}>
                        {element?.name}
                      </CustomTextBold700>
                    </Box>
                    <Box display={'flex'}  justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'} height={'26px'}>
                      <CustomTextBold700 fontSize={'12px'} color='#0AA464' lineHeight={"150%"} noOfLines={1}>
                        {element?.hospital}
                      </CustomTextBold700>
                    </Box>
                    <Box display={'flex'} justifyContent={doctorList?.length > 1 ? 'center' : 'flex-start'}  alignItems={'center'}  height={'26px'}>
                      <CustomTextBold700 fontSize={'12px'} color={partTextColor} lineHeight={"150%"} letterSpacing={'-5%'} noOfLines={1}>
                        {element?.deptname}
                      </CustomTextBold700>
                    </Box>
                  </Flex>
                  <Box
                    flex={1} display={doctorList?.length > 1 ? 'none' : 'flex'} alignItems={'center'} justifyContent={'flex-end'}
                    onClick={() => onSendButton(element,element?.doctor_id)} cursor={'pointer'}
                  >
                    <Icon as={BiChevronRight} width="20px" height="20px" color={arrowColor} />
                  </Box>
                </Flex>
              ))
            }
            {
              doctorList?.length > 3 && (
                <Flex flexDirection="column" bg={navbarBgColor} minWidth="100px" height={"100%"} justifyContent={'center'} alignItems={'center'}>
                  <Box
                    display={'flex'}  width="40px" height={"40px"} cursor={'pointer'} justifyContent='center' alignItems={'center'} 
                    borderRadius={'20px'} flexDirection={'column'} backgroundColor={navbarBgColor} border={'1px solid #efefef'} mb="5px"
                    onClick={()=> onSendDoctorListButton(selectChatId)}
                  >
                  <Icon as={MdOutlineArrowForward} width="25px" height="25px" color={navbarIcon} />
                </Box>
                <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color={navbarIcon} lineHeight={"150%"}>전체보기</CustomTextBold400>
              </Flex>
              )
            }
          </Box>
        </Stack>
        <Box  justifyContent={'flex-end'} display={doctorList?.length < 4  ? 'none' : isLocalTypeDone ? "flex" : 'none'} mt={'10px'}>
          <Box 
            display="flex" justifyContent={'center'} alignItems={'center'} bg={"#DFF5ED"} borderRadius={"4px"} height={"32px"} padding="0 8px 0 20px" cursor={'pointer'}
            onClick={() => onSendDoctorListButton(selectChatId)} 
          >
            <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"} >
            {data?.answer?.disease} 전체 보기
            </CustomTextBold400>
            <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
          </Box>
        </Box>
        {
          (isOpenDocListModal && chatId ==  selectChatId) && (
            <Modal
              onClose={() => fn_close_modal_doctor_list()}
              finalFocusRef={modalBtnRef}
              isOpen={(isOpenDocListModal && chatId ==  selectChatId)}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'} left={0} top={0} width="50px" height={'100%'} display={{base :'flex', md:'none'}} alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_list()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>{data?.answer?.disease ?? "의사소개"}</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'} right={0} top={0} width="50px" height={'100%'} display={{base :'none', md:'flex'}} justifyContent={'flex-end'} alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_list()}  cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0" >
                  <DoctorList
                    isOpen={(isOpenDocListModal && chatId ==  selectChatId)}
                    setClose={() => fn_close_modal_doctor_list()}
                    originDoctorData={doctorAllList}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )
        }
      </Flex>
    )
  }
};
  
export default RecommandDoctor;