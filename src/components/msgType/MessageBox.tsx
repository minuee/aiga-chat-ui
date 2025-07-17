'use client'
import React from 'react';
import dynamic from 'next/dynamic';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import { useColorModeValue,useColorMode,Flex,Box } from '@chakra-ui/react'
import Card from '@/components/card/Card';
import TypeAnimation  from'@/components/text/TypeAnimation2';
import LogoImage from "@/assets/images/logo.png";
import Image from "next/image";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
import { IconChatAiga,DefaultHeaderLogo} from '@/components/icons/svgIcons';

const MessageBox = React.memo(function MessageBox({ output }: { output: any }) {
  
  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장

  React.useEffect(() => {
    previousOutputRef.current = output; // output이 변경될 때마다 이전 값을 업데이트
  }, [output]);

  const isOutputSame = previousOutputRef.current === output; // 이전 output과 현재 output 비교

  return (
   <Flex w="100%" flexDirection={'column'} mt="10px">
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
        alignItems={'center'}
      > 
        {
          isOutputSame
          ?
          <ReactMarkdown
            components={{
              p: ({ children }) => <CustomText whiteSpace="pre-line">{children}</CustomText>
            }}
          >
            {output ? output : ''}
          </ReactMarkdown>
          :
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <TypeAnimation
                  msg={Array.isArray(children) ? children.join('') : String(children)}
                  speed={30}
                />
              )
            }}
          >
            {output || ''}
          </ReactMarkdown>
        }
      </Flex>
    </Flex>
  );
}, (prevProps, nextProps) => prevProps.output === nextProps.output);

export default MessageBox;