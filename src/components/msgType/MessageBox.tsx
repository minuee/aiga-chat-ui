import React from 'react';
import dynamic from 'next/dynamic';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import { useColorModeValue,Text,Flex,Box } from '@chakra-ui/react'
import Card from '@/components/card/Card';
import TypeAnimation  from'@/components/text/TypeAnimation2';
import LogoImage from "@/assets/images/logo.png";
import Image from "next/image";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

const MessageBox = React.memo(function MessageBox({ output }: { output: any }) {
  
  const textColor = useColorModeValue('navy.700', 'white');
  const bgMeColor = useColorModeValue('#2B8FFF', 'white');
  const textMeColor = useColorModeValue('white', 'navy.800');
  const bgSystemColor = useColorModeValue('#F4F6FA', 'white');
  const textSystemColor = useColorModeValue('#212127', 'navy.800');
  const bgSystemStopColor = useColorModeValue('#FFF0F0', 'white');
  const textSystemStopColor = useColorModeValue('#F94848', 'navy.800');
  const textSystemStopIconColor = useColorModeValue('#5E0018', 'navy.800');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장

  React.useEffect(() => {
    previousOutputRef.current = output; // output이 변경될 때마다 이전 값을 업데이트
  }, [output]);

  const isOutputSame = previousOutputRef.current === output; // 이전 output과 현재 output 비교

  return (
   <Flex w="100%" flexDirection={'column'} mt="10px">
      <Box my="5px">
        <Image 
          src={LogoImage}
          alt="Aiga Logo"
          style={{width:'45px',objectFit: 'contain'}}
        />
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
/*
export default function MessageBox(props: { output: any }) {
  const { output } = props
  const textColor = useColorModeValue('navy.700', 'white')

  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      color={textColor}
      minH="50px"
      height={'auto'}
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <Text whiteSpace="pre-line">{children}</Text>
        }}
      >
        {output ? output : ''}
      </ReactMarkdown>
      <ReactMarkdown
        components={{
          p: ({ children }) => <TypeAnimation msg={String(children)} />
        }}
      >
        {output ? output : ''}
      </ReactMarkdown>
      
    </Card>
  )
}
  */
