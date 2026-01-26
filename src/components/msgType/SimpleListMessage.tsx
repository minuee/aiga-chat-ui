'use client';
import React from 'react';
import { Box,Flex,useColorMode ,useColorModeValue ,UnorderedList,ListItem, OrderedList} from '@chakra-ui/react';
import functions from "@/utils/functions";
import CustomText from "@/components/text/CustomText";
import TypeAnimation  from'@/components/text/TypeAnimation2';
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
type SimpleListMessageProps = {
    msg: any;
    summary : any;
    isHistory : boolean;
    indexKey : any,
    isLiveChat? : boolean,
    setIsTypingDone: () => void;
};

const SimpleListMessage = ({  msg = [], indexKey, isHistory = false, summary, isLiveChat = false,setIsTypingDone}: SimpleListMessageProps) => {

  const { colorMode, toggleColorMode } = useColorMode();
  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const textSystemColor = useColorModeValue('#212127', 'white');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  const [hospitalsList, setHospitalsList] = React.useState<any[]>([]);
  const [isLocalTypeDone, setLocalTypeDone] = React.useState(true)

  // 'output' 텍스트를 정리하는 함수. LLM AI가 보내주는 텍스트에 불필요한 따옴표나 <br/> 태그가 있을 수 있음.
  const cleanOutput = (text: any) => {
    if (typeof text !== 'string') return '';
    let cleaned = text.replace(/^"(.*)"$/, '$1');
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/(https?:\/\/.+?\.(?:jpeg|jpg|png|gif|bmp|webp|svg|gif))\s/gi, (match) => match.replace(/\s/g, '%20'));
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
      'li': {
        paddingLeft: '0', 
        marginLeft: '0',
      },
    },
  };

  const previousOutputRef = React.useRef<string | null>(null);

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
        console.error("SimpleListMessage: Failed to parse hospitals JSON:", e);
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

  const setTypingCompleteDone = () => {
    setTimeout(() => {
      setLocalTypeDone(true)
      setIsTypingDone()
    }, 100);
  }

  if ( hospitalsList?.length == 0 ) {
    if ( !functions.isEmpty(summary)) {
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
          <Box {...BoxProps}>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone  )
            ?
            <TypeAnimation
              msg={processedSummary}
              speed={30}
              onComplete={() => setTypingCompleteDone()}
            />
            :
            !functions.isEmpty(summary) 
            ?
            <ReactMarkdown components={renderers}>{processedSummary}</ReactMarkdown>
            :
            null
          }
          </Box>
        </Flex>
      </Flex>
      )
    }
    return (
      <Flex w="100%" flexDirection={'column'}>
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
          <CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>해당 병원을 찾을 수 없습니다.</CustomText> 
        </Flex>
      </Flex>
    )
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
        <Box {...BoxProps}>
        {
          ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone  )
          ?
          <TypeAnimation
            msg={processedSummary}
            speed={30}
            onComplete={() => setTypingCompleteDone()}
          />
          :
          !functions.isEmpty(summary) 
          ?
          <ReactMarkdown components={renderers}>{processedSummary}</ReactMarkdown>
          :
          null
        }
        </Box>
        <Box 
          display={isLocalTypeDone ? 'flex' : 'none'}
          padding="12px 20px" 
          border={`1px solid ${bgSystemColor}`} 
          bgColor={bgSystemColor} 
          borderTopLeftRadius="2px" 
          borderTopRightRadius="20px" 
          borderBottomLeftRadius="20px"
          borderBottomRightRadius="20px" 
          w="auto" 
          zIndex={2}
          alignItems={'center'}
        > 
          <UnorderedList>
          { 
            hospitalsList.map((element:any,index:number) => {
              return (
                <Box key={index}>
                  <ListItem><CustomText fontSize={'17px'} color={textSystemColor} lineHeight={'170%'}>{element?.name}</CustomText></ListItem>
                </Box>
              )
            })
          }
          </UnorderedList>
        </Box>
      </Flex>
    </Flex>
  )
};
  
export default SimpleListMessage;