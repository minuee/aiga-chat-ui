'use client';
import React from 'react';
import { isMobileOnly } from "react-device-detect";
import { Box,Flex,useColorMode ,useColorModeValue ,UnorderedList,ListItem, OrderedList, SimpleGrid, Button, Stack, HStack, Icon, Badge, Text, useToast} from '@chakra-ui/react';
import { PhoneIcon } from "@chakra-ui/icons";
import { FiMapPin } from "react-icons/fi";
import functions from "@/utils/functions";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import TypeAnimation  from'@/components/text/TypeAnimation2';
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
import { BiChevronRight } from "react-icons/bi";
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
type HospitalListProps = {
    msg: any;
    summary : any;
    isHistory : boolean;
    indexKey : any,
    isLiveChat? : boolean,
    setIsTypingDone: () => void;
};

const HospitalCard = ({ hospital, onCopy, cardBg, textColor, titleColor, borderColor }: { hospital: any, onCopy: (text: string) => void, cardBg: string, textColor: string, titleColor: string, borderColor: string }) => {
    return (
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="xl"
        bg={cardBg}
        borderColor={borderColor}
        boxShadow="md"
        _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        <Stack spacing={3}>
          {/* 병원명 */}
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold" color={titleColor}>
              {hospital.name}
            </Text>
            {/* <Badge colorScheme="blue">가정의학과</Badge> */}
          </HStack>
  
          {/* 주소 */}
          <HStack color={textColor} fontSize="sm" alignItems="flex-start">
            <Icon as={FiMapPin} mt="2px" />
            <Text maxWidth='250px' noOfLines={2} minHeight="42px">{hospital.address}</Text>
          </HStack>

          {/* 전화 */}
          {hospital?.telephone && (
            isMobileOnly ? (
              <HStack color={textColor} fontSize="sm" onClick={() => window.open(`tel:${hospital.telephone}`)} cursor={'pointer'}>
                <PhoneIcon />
                <Text>{hospital.telephone}</Text>
              </HStack>
            ) : (
              <HStack color={textColor} fontSize="sm" onClick={() => onCopy(hospital.telephone)} cursor={'pointer'}>
                <PhoneIcon />
                <Text>{hospital.telephone}</Text>
              </HStack>
            )
          )}
  
          {/* 버튼 */}
          <HStack pt={2}>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() =>
                window.open(
                  `https://map.kakao.com/link/map/${hospital.name},${hospital.lat},${hospital.lon}`
                )
              }
            >
              지도보기
            </Button>
  
            {hospital?.hospital_site && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(hospital.hospital_site, '_blank')}
              >
                홈페이지 이동
              </Button>
            )}
          </HStack>
        </Stack>
      </Box>
    );
  }

const HospitalList = ({  msg = [], indexKey, isHistory = false, summary, isLiveChat = false,setIsTypingDone}: HospitalListProps) => {

  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const [hospitalsList, setHospitalsList] = React.useState<any[]>([]);
  const [isLocalTypeDone, setLocalTypeDone] = React.useState(true)
  const toast = useToast();
  const flexRef = React.useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = React.useState(true);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const cardBg = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const titleColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'navy.600');
  const expandButtonBg = useColorModeValue('#DFF5ED', 'gray.700');
  const expandButtonTextColor = useColorModeValue('#0AA464', 'green.300');
  
  const handleScroll = () => {
    if (flexRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = flexRef.current;
      if ( ( scrollLeft + clientWidth + 200 ) >= scrollWidth ) {
        setShowGradient(false);
      } else {
        setShowGradient(true);
      }
    }
  };

  React.useEffect(() => {
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
    }, 500);
  
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async (textToCopy : string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "복사 완료!",
        position: 'top-right',
        description: `"${textToCopy}"가 클립보드에 복사되었습니다.`,
        status: 'info',
        containerStyle: {
          color: '#ffffff',
        },
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "복사 실패",
        position: 'top-right',
        description: "클립보드 복사 중 문제가 발생했어요.",
        status: "error",
        containerStyle: {
          color: '#ffffff',
        },
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // 'output' 텍스트를 정리하는 함수. LLM AI가 보내주는 텍스트에 불필요한 따옴표나 <br/> 태그가 있을 수 있음.
  const cleanOutput = (text: any) => {
    if (typeof text !== 'string') return '';
    let cleaned = text.replace(/^"(.*)"$/, '$1');
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    //cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/(https?:\/\/.+?\.(?:jpeg|jpg|png|gif|bmp|webp|svg|gif))\s/gi, (match) => match.replace(/\s/g, '%20'));
    // 각 줄의 선행 공백을 제거 (ltrim 효과) 
    cleaned = cleaned.replace(/^[ \t]+/gm, '');
    return cleaned;
  };

  const processedSummary = cleanOutput(summary);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const renderers: Components = {
    img: ({ node, ...props }) => (
      <img
        {...props}
        alt={props.alt || "이미지"}
        style={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '100px',
          minWidth: '100px',
          objectFit: 'contain',
          margin: '10px 0',
          borderRadius: '8px',
          display: 'block',
        }}
      />
    ),
    a: ({ node, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#1e90ff' }} />
    ),
    ul: ({ node, ...props }) => <UnorderedList styleType='none' {...props} />,
    ol: ({ node, ...props }) => <OrderedList styleType='none' {...props} />,
    li: ({ node, ...props }) => <ListItem style={{ marginBottom: '5px', display: 'flex', alignItems: 'flex-start' }} {...props} />,
    p: ({ node, ...props }) => <p style={{ marginBottom: '10px' }} {...props} />,
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
      // ol 바로 뒤에 오는 ul의 li에만 들여쓰기를 적용 (교수 상세 정보)
      'ol + ul li': { // ol 바로 뒤에 오는 ul의 li에 적용
        paddingLeft: '10px !important', // 10px 들여쓰기
        marginLeft: '10px !important',
      },
    },
  };

  const previousOutputRef = React.useRef<string | null>(null);

  const gradientBackground = useColorModeValue(
    'linear-gradient(to right, rgba(244, 246, 250, 0) 0%, rgba(244, 246, 250, 1) 100%)',
    'linear-gradient(to right, rgba(26, 54, 93, 0) 0%, rgba(26, 54, 93, 1) 100%)'
  );

  React.useEffect(() => { 
    if ( !functions.isEmpty(summary)) previousOutputRef.current =  summary; 
    else previousOutputRef.current = null
  }, [summary]);

  const isOutputSame = previousOutputRef.current === summary && previousOutputRef.current !== null;
  
  React.useEffect(() => {
    let parsedHospitals = null;
    if (typeof msg?.hospitals === 'string') {
      try {
        parsedHospitals = JSON.parse(msg.hospitals);
      } catch (e) {
        console.error("HospitalList: Failed to parse hospitals JSON:", e);
        parsedHospitals = null;
      }
    } else if (Array.isArray(msg?.hospitals)) {
      parsedHospitals = msg.hospitals;
    }
  
    if (Array.isArray(parsedHospitals)) {
      setHospitalsList(parsedHospitals);
    } else {
      setHospitalsList([]);
    }
  }, [msg]);

  React.useEffect(() => {
    if ( isLiveChat && !functions.isEmpty(summary)  ) {
      setLocalTypeDone(false)
    }else{
      setLocalTypeDone(true)
      if (isLiveChat) {
        setIsTypingDone();
      }
    }
  }, [summary, isLiveChat]);

  React.useEffect(() => {
    setIsExpanded(false);
  }, [msg]);

  const setTypingCompleteDone = () => {
    setTimeout(() => {
      setLocalTypeDone(true)
      setIsTypingDone()
    }, 100);
  }

  return (
    <Flex w="100%" flexDirection={'column'}  px="5px">
      <Box my="5px">
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
        {(!functions.isEmpty(summary)) && (
          <Box {...BoxProps}>
            {(isLiveChat && !isLocalTypeDone) ? (
              <TypeAnimation
                msg={processedSummary}
                speed={30}
                onComplete={() => setTypingCompleteDone()}
              />
            ) : (
              <ReactMarkdown components={renderers}>{processedSummary}</ReactMarkdown>
            )}
          </Box>
        )}
        
        {hospitalsList?.length > 0 ? (
          <>
            {isExpanded ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%" mt={4}>
                {hospitalsList.map((h, index) => (
                  <HospitalCard key={index} hospital={h} onCopy={handleCopy} cardBg={cardBg} textColor={textColor} titleColor={titleColor} borderColor={borderColor} />
                ))}
              </SimpleGrid>
            ) : (
              <Box
                position="relative"
                sx={{
                  '&::after': {
                    content: (isLocalTypeDone && showGradient && hospitalsList?.length > (isMobileOnly ? 1 : 2)) ? '""' : 'none',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100%',
                    background: gradientBackground,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Flex 
                  display={isLocalTypeDone ? 'flex' : 'none'}
                  mt={4}
                  w="100%"
                  overflowX="auto"
                  ref={flexRef}
                  onScroll={handleScroll}
                  sx={{
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                > 
                    {hospitalsList.map((h, index) => (
                        <Box key={index} flexShrink={0} minWidth={{ base: '80%', md: '300px' }} mr={4} pb={4}>
                            <HospitalCard hospital={h} onCopy={handleCopy} cardBg={cardBg} textColor={textColor} titleColor={titleColor} borderColor={borderColor} />
                        </Box>
                    ))}
                </Flex>
              </Box>
            )}
            {hospitalsList.length > 2 && (
              <Flex justifyContent="flex-end" mt={4}>
                <Flex 
                  display="flex" justifyContent={'center'} alignItems={'center'} bg={expandButtonBg} borderRadius={"4px"} height={"32px"} padding="0 8px 0 20px" cursor={'pointer'}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <CustomTextBold400 fontSize={'15px'} fontWeight={'bold'} color={expandButtonTextColor} lineHeight={"150%"} >
                  {isExpanded ? '간략히 보기' : `${hospitalsList.length}개 펼쳐보기`}
                  </CustomTextBold400>
                  <Icon as={BiChevronRight} width="20px" height="20px" color={expandButtonTextColor} />
                </Flex>
              </Flex>
            )}
          </>
        ) : functions.isEmpty(summary) ? (
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>해당 병원을 찾을 수 없습니다.</CustomText>
        ) : null}
      </Flex>
    </Flex>
  )
};
  
export default HospitalList;
