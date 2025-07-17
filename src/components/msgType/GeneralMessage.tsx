'use client'

import React from 'react';
import { useColorModeValue,useColorMode,Flex,Box } from '@chakra-ui/react'
import TypeAnimation  from'@/components/text/TypeAnimation2';
import { IconChatAiga,DefaultHeaderLogo} from '@/components/icons/svgIcons';

const GeneralMessage = React.memo(function GeneralMessage({ output,isHistory,setIsTypingDone,isLiveChat }: { output: any,isLiveChat:boolean ,isHistory:boolean,setIsTypingDone: () => void;}) {
  console.log("GeneralMessage 렌더링"); // ← 디버깅용
  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장

  React.useEffect(() => {
    previousOutputRef.current =  output; // output이 변경될 때마다 이전 값을 업데이트
  }, [output]);

  const isOutputSame = previousOutputRef.current === output && previousOutputRef.current !== null;
  

  return (
   <Flex w="100%" flexDirection={'column'} overflow={'hidden'}>
      <Box mb="5px">
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
        alignItems={'center'}
      > 
        {
          ( isLiveChat && !isOutputSame )
          ?
          <TypeAnimation
            msg={ output.replace(/^"(.*)"$/, '$1')}
            speed={30}
            onComplete={() => setIsTypingDone()}
          />
          :
          <div
            style={{ fontSize: '17px', whiteSpace: 'pre-line',fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{
              __html: output
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/\\n/g, '\n')
                .replace(/^"(.*)"$/, '$1'),
            }}
          />
        }
      </Flex>
    </Flex>
  );
}, (prevProps, nextProps) => prevProps.output === nextProps.output);

export default GeneralMessage;
