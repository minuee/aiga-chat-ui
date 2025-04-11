import dynamic from 'next/dynamic';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import { useColorModeValue,Text } from '@chakra-ui/react'
import Card from '@/components/card/Card'

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
    </Card>
  )
}
