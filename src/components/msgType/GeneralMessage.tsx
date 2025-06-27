import React from 'react';
import dynamic from 'next/dynamic';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import { useColorModeValue,Text,Flex,Box } from '@chakra-ui/react'
import functions from '@/utils/functions';
import TypeAnimation  from'@/components/text/TypeAnimation2';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconChatAiga} from '@/components/icons/svgIcons';

const GeneralMessage = React.memo(function GeneralMessage({ output,isHistory,setIsTypingDone }: { output: any ,isHistory:boolean,setIsTypingDone: () => void;}) {
  
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장

  React.useEffect(() => {
    previousOutputRef.current =  output; // output이 변경될 때마다 이전 값을 업데이트
  }, [output]);

  const isOutputSame = previousOutputRef.current === output && previousOutputRef.current !== null;
  const hasUrl = /https?:\/\//.test(output);
  //const cleanedOutput = output.replace(/\\n/g, '\n')
  return (
   <Flex w="100%" flexDirection={'column'} mt="10px" overflow={'hidden'}>
      <Box my="5px">
        <IconChatAiga width={'46px'} height={"12px"} />
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
          isOutputSame
          ?
          <CustomText fontSize={'17px'} style={{ whiteSpace: 'pre-line' }} >
            {
              hasUrl 
              ? 
              output.replaceAll(/<br\s*\/?>/gi, '\n').replaceAll(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
              :
              output?.replaceAll(/<br\s*\/?>/gi, '\n').replaceAll(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
            }
          </CustomText>
          :
          isHistory
          ?
          <CustomText fontSize={'17px'} style={{ whiteSpace: 'pre-line' }}>
            {
              hasUrl
              ?
              output.replaceAll(/<br\s*\/?>/gi, '\n').replaceAll(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
              :
              output?.replaceAll(/<br\s*\/?>/gi, '\n').replaceAll(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
            }
          </CustomText>
          :
          <TypeAnimation
            msg={ output.replace(/^"(.*)"$/, '$1')}
            speed={30}
            onComplete={() => setIsTypingDone()}
          />
          
        }
      </Flex>
    </Flex>
  );
}, (prevProps, nextProps) => prevProps.output === nextProps.output);

export default GeneralMessage;
