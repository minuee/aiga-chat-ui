import { useRef, useEffect, useState } from "react";
import NextImage from 'next/legacy/image';
import Image from 'next/image';
import { Box,Flex,Stack,useColorModeValue,Text,useColorMode,Icon,Modal,ModalOverlay,ModalContent,ModalHeader,SimpleGrid,ModalBody, ListItem, UnorderedList, OrderedList } from '@chakra-ui/react';
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
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';

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

  // 'output' 텍스트를 정리하는 함수. LLM AI가 보내주는 텍스트에 불필요한 따옴표나 <br/> 태그가 있을 수 있음.
  const cleanOutput = (text: any) => {
    if (typeof text !== 'string') return '';
    // 텍스트 시작과 끝의 큰따옴표 제거
    let cleaned = text.replace(/^"(.*)"$/, '$1');
    // HTML <br/> 태그를 개행 문자로 변환
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    // \n을 \n으로 변환 (LLM 응답에서 올 수 있는 이스케이프된 개행 처리)
    cleaned = cleaned.replace(/\\n/g, '\n');
    // 이미지 URL 내 공백을 %20으로 인코딩
    cleaned = cleaned.replace(/(https?:\/\/.+?\.(?:jpeg|jpg|png|gif|bmp|webp|svg|gif))\s/gi, (match) => match.replace(/\s/g, '%20'));

    return cleaned;
  };

  const processedSummary = cleanOutput(summary);

  const renderers: Components = {
    // 이미지 렌더링 커스터마이징
    img: ({ node, ...props }) => {
        const imageUrl = props.src || '';
        const processedImageUrl = useVerbose ? (useCache ? `${imageCacheServer}?url=${encodeURIComponent(imageUrl)}&w=${imageCacheWidth}&h=${imageCacheHeight}` : imageUrl) : DoctorAvatar.src;
        return (
            <img
                {...props}
                src={processedImageUrl}
                alt={props.alt || "이미지"}
                data-url={imageUrl}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '100px',
                  minWidth: '100px',
                  objectFit: 'contain',
                  margin: '10px 0',
                  borderRadius: '8px',
                  display: 'block',
                  cursor: 'pointer',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = DoctorAvatar.src;
                }}
            />
        );
    },
    // 링크 렌더링 커스터마이징
    a: ({ node, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#1e90ff' }} />
    ),
    // Chakra UI 컴포넌트로 목록 렌더링
    ul: ({ node, ...props }) => <UnorderedList styleType='none' {...props} />,
    ol: ({ node, ...props }) => <OrderedList styleType='none' {...props} />,
    li: ({ node, ...props }) => <ListItem style={{ marginBottom: '5px', display: 'flex', alignItems: 'flex-start' }} {...props} />,
    p: ({ node, ...props }) => <p style={{ marginBottom: '10px' }} {...props} />,
    // strong 태그 (볼드체) 스타일링
    strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
  };
  
  const BoxProps = {
    ref: containerRef,
    fontSize: "17px",
    fontFamily: "Noto Sans",
    sx: {
      'ul li::before': {
        content: '"•"', 
        marginRight: '8px',
        color: '#1e90ff', 
        fontWeight: 'bold', 
        fontSize: '1em', 
        display: 'inline-block', 
        marginTop: '0.1em', 
      },
      'ol li::before': {
        content: 'counter(list-item) ". "',
        counterIncrement: 'list-item',
        marginRight: '8px',
        color: '#1e90ff',
        fontWeight: 'bold',
        fontSize: '1em',
        display: 'inline-block',
        marginTop: '0.1em',
      },
      'ul, ol': {
        paddingLeft: '0', 
      },
      'li': {
        paddingLeft: '0', 
        marginLeft: '0',
      },
    },
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
    
    let doctors = [];
    let title = "의사 소개";
    let llmSortType = null;
    try {
      let parsedAnswer = data.answer;
      if(typeof data.answer === 'string') {
          parsedAnswer = JSON.parse(data.answer);
      }
      if (Array.isArray(parsedAnswer?.doctors)) {
        doctors = parsedAnswer.doctors;
      }
      title = doctors[0]?.deptname ?? "의사 소개";
      llmSortType = parsedAnswer?.front_sort_type;
    } catch (e) { /* 파싱 오류 무시 */ }
    setOpenDoctorListModal(true, id, doctors, title, llmSortType);
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
          <Box {...BoxProps}>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone )
            ?
            <TypeAnimation
              msg={processedSummary}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            <ReactMarkdown components={renderers}>{processedSummary}</ReactMarkdown>
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
          <Box {...BoxProps}>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone )
            ?
            <TypeAnimation
              msg={processedSummary}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            <ReactMarkdown components={renderers}>{processedSummary}</ReactMarkdown>
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

      </Flex>
    )
  }
};
  
export default SearchDoctor;