'use client';
import React from 'react';
import { Box,Flex,useColorMode ,useColorModeValue ,UnorderedList,ListItem} from '@chakra-ui/react';
import functions from "@/utils/functions";
import CustomText from "@/components/text/CustomText";
import TypeAnimation  from'@/components/text/TypeAnimation2';
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
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
          <Box>
          {
            ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone  )
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
              style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
            />
            :
            !functions.isEmpty(summary)
            ?
            <div
              style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
            />
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
        <Box>
        {
          ( isLiveChat && !functions.isEmpty(summary) && !isLocalTypeDone  )
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
            style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
          />
          :
          !functions.isEmpty(summary)
          ?
          <div
            style={{ fontSize: '17px', whiteSpace: 'pre-line', fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{__html: summary.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')}}
          />
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