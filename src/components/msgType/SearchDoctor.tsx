import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import Image from 'next/image';
import { Box,Flex,Stack,useColorModeValue,Text,useColorMode,Icon,Modal,ModalOverlay,ModalContent,ModalHeader,SimpleGrid,ModalBody } from '@chakra-ui/react';
import mConstants from "@/utils/constants";
import * as history from '@/utils/history';
import { usePathname, useRouter } from 'next/navigation';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import { BiChevronRight } from "react-icons/bi";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
import { ModalDoctorListStore,ModalDoctorReviewStore,ModalDoctorRequestStore,ModalDoctorDetailStore } from '@/store/modalStore';
import { MdArrowBack,MdOutlineClose } from 'react-icons/md';
import DoctorList from "@/components/modal/DoctorList";
import { MdOutlineArrowForward } from 'react-icons/md';
import TypeAnimation  from'@/components/text/TypeAnimation2';
import DoctorAvatar from "@/assets/images/doctor_default_white.png";

import DoctorRecommandItem from "./DoctorRecommandItem";

type SearchDoctorProps = {
    data : any;
    summary : any;
    isHistory : boolean;
    onSendButton: (data: any,id:number) => void; 
    isLiveChat? : boolean,
    setIsTypingDone: () => void;
};

const SearchDoctor = ({ onSendButton, data, isHistory, summary, isLiveChat, setIsTypingDone }: SearchDoctorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const { colorMode, toggleColorMode } = useColorMode();
  const flexRef = useRef<HTMLDivElement>(null);
  const [selectChatId, setSelectselectChatId] = useState(0);
  const [proposalKeyword, setProposalKeyword] = useState(null);
  const [showGradient, setShowGradient] = useState(true);
  const [doctorList, setDoctorList] = useState<any>([]);
  const isDark = useColorModeValue(false, true);
  const [isLocalTypeDone, setLocalTypeDone] = useState(true)
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const profileBgColor = useColorModeValue("#F4F6FA",'navy.600');
  const nameTextColor = useColorModeValue('#17191D','white');
  const partTextColor = useColorModeValue('#7F879B','white');
  const arrowColor = useColorModeValue("#000000",'white')
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.700');
  const navbarBgColor = useColorModeValue('white', 'navy.800');
  const navbarBg = useColorModeValue('rgba(0, 59, 149, 1)','rgba(11,20,55,0.5)');
  const navbarIcon = useColorModeValue('#7F879B', 'white');
  const iconColor = useColorModeValue('#0AA464','#0AA464');
  
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const { isOpenDocListModal,chatId,doctorAllList } = ModalDoctorListStore(state => state);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);

  const previousOutputRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 이미지 캐싱 서버 관련 환경 변수
  const useVerbose = process.env.NEXT_PUBLIC_DOCTOR_IMAGE_VERBOSE === 'true';
  const useCache = useVerbose && process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_SERVER_VERBOSE === 'true';
  const imageCacheServer = process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_SERVER || 'http://localhost:7001';
  const imageCacheWidth = parseInt(process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_WIDTH || '300', 10);
  const imageCacheHeight = parseInt(process.env.NEXT_PUBLIC_DOCTOR_IMAGE_CACAE_HEIGHT || '300', 10);

  // 컴포넌트 내부로 이동된 convertLinksAndImagesToHTML 함수
  const convertLinksAndImagesToHTML = (text: string): string => {
    // Pre-process to encode spaces in image URLs
    const imageWithSpaceRegex = /(https?:\/\/.+?\.(?:jpeg|jpg|png|gif|bmp|webp))/gi;
    const textWithEncodedSpaces = text.replace(imageWithSpaceRegex, (url) => {
      return url.replace(/ /g, '%20');
    });

    // Regex to find the first image (markdown or plain)
    const firstImageRegex = /(!\[[^\]]*\]\((https?:\/\/[^)]+?\.(?:jpeg|jpg|png|gif|bmp|webp)[^)]*)\))|(https?:\/\/[^\s]+?\.(?:jpeg|jpg|png|gif|bmp|webp))/i;
    const imageMatch = textWithEncodedSpaces.match(firstImageRegex);

    // Regex for non-image URLs
    const urlRegex = /(https?:\/\/(?!.*\.(?:jpeg|jpg|png|gif|bmp|webp))[^\s]+)/g;

    if (imageMatch) {
      // Extract the full URL of the first image
      const imageUrl = imageMatch[2] || imageMatch[0];
      
      const processedImageUrl = useVerbose ? (useCache ? `${imageCacheServer}?url=${encodeURIComponent(imageUrl)}&w=${imageCacheWidth}&h=${imageCacheHeight}` : imageUrl) : DoctorAvatar.src;

      // Regex to remove all images (markdown or plain) to create clean text
      const allImagesRegex = /(!\[[^\]]*\]\((https?:\/\/[^)]+?\.(?:jpeg|jpg|png|gif|bmp|webp)[^)]*)\))|(https?:\/\/[^\s]+?\.(?:jpeg|jpg|png|gif|bmp|webp))/gi;
      let cleanText = textWithEncodedSpaces.replace(allImagesRegex, '');
      
      // Clean up excessive newlines that might be left after removing images
      cleanText = cleanText.replace(/(\r\n|\n|\r){2,}/g, '\n').trim();

      // Process remaining non-image links in the clean text
      const cleanTextWithLinks = cleanText.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">${url}</a>`;
      });

      // Assemble the new flexbox structure
      return `
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="flex: 1; max-width: 100px;">
            <img 
              src="${processedImageUrl}" 
              alt="이미지" 
              data-url="${imageUrl}" 
              style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; cursor: pointer;" 
              onerror="this.onerror=null; this.src='${DoctorAvatar.src}';"
            />
          </div>
          <div style="flex: 3;">
            ${cleanTextWithLinks}
          </div>
        </div>
      `;
    } else {
      // No image found, just process links as usual
      const urlRegexWithImages = /(https?:\/\/[^\s]+)/g; // Standard URL regex if no special layout is needed
      return textWithEncodedSpaces.replace(urlRegexWithImages, (url) => {
          // This regex is broad, so we double-check if it's an image to render as such
          const imageCheckRegex = /\.(jpeg|jpg|png|gif|bmp|webp)(\?.*)?$/i;
          if (imageCheckRegex.test(url)) {
              const processedImageUrl = useVerbose ? (useCache ? `${imageCacheServer}?url=${encodeURIComponent(url)}&w=${imageCacheWidth}&h=${imageCacheHeight}` : url) : DoctorAvatar.src;
              return `<img 
                        src="${processedImageUrl}" 
                        alt="이미지" 
                        data-url="${url}" 
                        style="max-width: 100%; height: auto; max-height: 100px; min-width: 100px; object-fit: contain;border-radius: 8px; display: block; cursor: pointer;" 
                        onerror="this.onerror=null; this.src='${DoctorAvatar.src}';"
                      />`;
          } else {
              return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">${url}</a>`;
          }
      });
    }
  };

  useEffect(() => {
    if ( !functions.isEmpty(summary)) previousOutputRef.current =  summary; 
    else previousOutputRef.current = null
  }, [summary]);

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
  
  const isOutputSame = previousOutputRef.current === summary && previousOutputRef.current !== null;

  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      // 스크롤이 끝에 도달했는지 확인
      if ( ( scrollLeft + clientWidth + 100 ) >= scrollWidth ) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = flexRef.current;
      if (!el) return;
      el.addEventListener('scroll', handleScroll);
     
      // 정리
      return () => {
        if (el) {
          el.removeEventListener('scroll', handleScroll);
        }
      };
    }, 500); // 0.5초 후에 강제 시도
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectselectChatId(!functions.isEmpty(data?.chat_id) ? data?.chat_id : !functions.isEmpty(data?.id) ? data?.id : 0);
    //console.log("data?.answer?.proposal",data?.answer?.proposal)
    setProposalKeyword(!functions.isEmpty(data?.answer?.proposal) ? data?.answer?.proposal : null);
    let parsedAnswer = null;
    if (typeof data?.answer === 'string') {
      // It's a string. Check if it looks like a JSON object before trying to parse.
      if (data.answer.trim().startsWith('{')) {
        try {
          parsedAnswer = JSON.parse(data.answer);
        } catch (e) {
          console.error("SearchDoctor: Failed to parse malformed answer JSON:", e);
          parsedAnswer = null; // Set to null if parsing fails
        }
      } else {
        // It's a plain string, not JSON. Do not attempt to parse.
        // This prevents errors for non-JSON string responses.
        parsedAnswer = null;
      }
    } else if (typeof data?.answer === 'object' && data?.answer !== null) {
      // It's already an object, use it directly.
      parsedAnswer = data.answer;
    }

    if (Array.isArray(parsedAnswer?.doctors)) {
      setDoctorList(parsedAnswer.doctors);
    } else {
      setDoctorList([]);
    }
  }, [data]);

  useEffect(() => {
    if ( isLiveChat && !functions.isEmpty(summary)  ) {
      setLocalTypeDone(false)
    }else{
      setLocalTypeDone(true)
      if (isLiveChat) {
        setIsTypingDone();
      }
    }
    
  }, [summary, isLiveChat]);

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

  
  if ( doctorList?.length == 0 && functions.isEmpty(summary)) {
    return (
      <Flex w="100%" flexDirection={'column'} mt="10px">
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
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>추천할 의사를 찾을 수 없습니다.</CustomText> 
        </Flex>
      </Flex>
    )
  }else if ( doctorList?.length == 0  && !functions.isEmpty(summary) && summary?.length > 10) {
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
          <Box>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone )
            ?
            <TypeAnimation
              msg={ summary.replace(/^"(.*)"$/, '$1')}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            ( !isLiveChat && !functions.isEmpty(summary) && summary?.length > 10 )
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
      </Flex>
    )
  }else {
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
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone )
            ?
            <TypeAnimation
              msg={ summary.replace(/^"(.*)"$/, '$1')}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            ( !isLiveChat && !functions.isEmpty(summary) && summary?.length > 10 )
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
                <DoctorRecommandItem
                  key={`${element.doctor_id}-${index}`} // doctor_id와 index를 조합하여 고유 키 생성
                  element={element}
                  index={index}
                  onSendButton={onSendButton}
                  profileBgColor={profileBgColor}
                  nameTextColor={nameTextColor}
                  partTextColor={partTextColor}
                  arrowColor={arrowColor}
                  doctorListLength={doctorList.length}
                />
              ))
            }
            {
              doctorList?.length > 3 && (
                <Flex 
                  flexDirection="column" 
                  bg={navbarBgColor} 
                  minWidth="100px" 
                  height={"100%"}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Box
                    display={'flex'}  width="40px" height={"40px"} cursor={'pointer'} justifyContent='center' alignItems={'center'} 
                    borderRadius={'20px'} 
                    flexDirection={'column'}
                    backgroundColor={navbarBgColor}
                    onClick={()=> onSendDoctorListButton(selectChatId)}
                    border={'1px solid #efefef'}
                    mb="5px"
                  >
                  <Icon as={MdOutlineArrowForward} width="25px" height="25px" color={navbarIcon} />
                </Box>
                <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color={navbarIcon} lineHeight={"150%"}>전체 보기</CustomTextBold400>
              </Flex>
              )
            }
          </Box>
        </Stack>
        <Box justifyContent={'flex-end'} display={doctorList?.length < 4 ? 'none' :  isLocalTypeDone ? 'flex' : 'none'} mt={'10px'}>
          <Box 
            display="flex" justifyContent={'center'} alignItems={'center'} bg={"#DFF5ED"} borderRadius={"4px"} height={"32px"}  padding="0 8px 0 20px" cursor={'pointer'}
            onClick={() => onSendDoctorListButton(selectChatId)} 
          >
            <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color='#0AA464' lineHeight={"150%"} >
            {proposalKeyword ? proposalKeyword : doctorList[0]?.deptname ? doctorList[0]?.deptname : "" } 전체 보기
            </CustomTextBold400>
            <Icon as={BiChevronRight} width="20px" height="20px" color={iconColor} />
          </Box>
        </Box>
        {
          (isOpenDocListModal && chatId ==  selectChatId) && (
            <Modal
              onClose={() => fn_close_modal_doctor_list()}
              finalFocusRef={modalBtnRef}
              isOpen={isOpenDocListModal}
              scrollBehavior={'inside'}
              size={'full'}
            >
              <ModalOverlay />
              <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} zIndex={1000}>
                <ModalHeader bg={navbarBg} padding="basePadding">
                  <Flex flexDirection={'row'} position={'relative'}>
                    <Box 
                      position={'absolute'}
                      left={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'flex', md:'none'}} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_list()} cursor={'pointer'}
                    >
                      <Icon as={MdArrowBack} width="24px" height="24px" color="white" />
                    </Box>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'} width='100%'>
                      <CustomText color={'white'} noOfLines={1}>{doctorList[0]?.deptname ?? "의사 소개"}</CustomText>
                    </Box>
                    <Box 
                      position={'absolute'}
                      right={0}
                      top={0}
                      width="50px"
                      height={'100%'}
                      display={{base :'none', md:'flex'}} 
                      justifyContent={'flex-end'} 
                      alignItems={'center'}  
                      onClick={() => fn_close_modal_doctor_list()}  cursor={'pointer'}
                      >
                      <Icon as={MdOutlineClose} width="24px" height="24px" color="white" />
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalBody overflowY="auto" maxH="100vh" padding="basePadding" margin="0" >
                  <DoctorList
                    isOpen={isOpenDocListModal}
                    setClose={() => fn_close_modal_doctor_list()}
                    originDoctorData={doctorList}
                    llmSortType={data?.answer?.front_sort_type}
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
  
export default SearchDoctor;