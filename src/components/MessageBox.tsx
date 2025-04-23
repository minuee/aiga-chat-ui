import React from 'react';
import dynamic from 'next/dynamic';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import { useColorModeValue,Text } from '@chakra-ui/react'
import Card from '@/components/card/Card';
import TypeAnimation  from'@/components/text/TypeAnimation';

const MessageBox = React.memo(function MessageBox({ output }: { output: any }) {
  const textColor = useColorModeValue('navy.700', 'white');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장

  React.useEffect(() => {
    previousOutputRef.current = output; // output이 변경될 때마다 이전 값을 업데이트
  }, [output]);

  const isOutputSame = previousOutputRef.current === output; // 이전 output과 현재 output 비교

  return (
    <Card
      display={output ? 'flex' : 'none'}
      color={textColor}
      px="22px !important"
      minH="50px"
      fontSize={{ base: 'sm', md: 'md' }}
    >
      {
        isOutputSame
        ?
        <ReactMarkdown
          components={{
            p: ({ children }) => <Text whiteSpace="pre-line">{children}</Text>
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
              />
            )
          }}
        >
          {output || ''}
        </ReactMarkdown>
      }
    </Card>
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
