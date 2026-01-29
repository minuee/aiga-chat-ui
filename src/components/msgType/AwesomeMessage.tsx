'use client'

import React from 'react';
import { useColorModeValue,useColorMode,Flex,Box, ListItem, UnorderedList, OrderedList, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import TypeAnimation from '@/components/text/TypeAnimation2';
import { IconChatAiga, DefaultHeaderLogo } from '@/components/icons/svgIcons';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';

const KV_REGEX = /^[^:]+:\s?.+/;

interface ParsedResult {
  title: string | null;
  tableData: Record<string, string>;
  isTable: boolean;
}

function parseMessage(text: string): ParsedResult & { footerLines: string[] } {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return { title: null, tableData: {}, isTable: false, footerLines: [] };
  }

  let title: string | null = null;
  let contentLines = lines;
  if (!KV_REGEX.test(lines[0]) && lines.length > 1) {
    title = lines[0];
    contentLines = lines.slice(1);
  }

  if (contentLines.length === 0) {
    return { title, tableData: {}, isTable: false, footerLines: [] };
  }

  let lastKvIndex = -1;
  for (let i = contentLines.length - 1; i >= 0; i--) {
    if (KV_REGEX.test(contentLines[i])) {
      lastKvIndex = i;
      break;
    }
  }

  const potentialTableLines = lastKvIndex === -1 ? [] : contentLines.slice(0, lastKvIndex + 1);
  const footerLines = lastKvIndex === -1 ? contentLines : contentLines.slice(lastKvIndex + 1);

  const keyValueLines = potentialTableLines.filter(line => KV_REGEX.test(line));
  
  const isTable = (potentialTableLines.length > 0 && (keyValueLines.length / potentialTableLines.length) > 0.5 && keyValueLines.length >= 2);

  if (isTable) {
    const tableData: Record<string, string> = {};
    keyValueLines.forEach(line => {
      const [key, ...rest] = line.split(":");
      if (key && rest.length > 0) {
        tableData[key.trim().replace(/[*/_!-]/g, '')] = rest.join(":").trim();
      }
    });
    
    return { title, tableData, isTable: true, footerLines };
  }

  return { title: null, tableData: {}, isTable: false, footerLines: [] };
}

// ImagePopupHandler는 GeneralMessage.tsx에서 재활용된 것입니다.
const useImagePopupHandler = () => {
  React.useEffect(() => {
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
  
    document.addEventListener('click', onClick);
  
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);
};


const AwesomeMessage = React.memo(function AwesomeMessage({ output, isHistory, setIsTypingDone, isLiveChat
}: { 
  output: any, isLiveChat: boolean, isHistory: boolean, setIsTypingDone: () => void; 
}) {

  const [isLocalTypeDone, setLocalTypeDone] = React.useState(isHistory);
  const { colorMode } = useColorMode();
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // 이미지 팝업 핸들러
  useImagePopupHandler();

  React.useEffect(() => {
    if (isLiveChat && !output) {
      setIsTypingDone();
    }
  }, [output, isLiveChat]);

  React.useEffect(() => {
    if (!isHistory) {
      setLocalTypeDone(false);
    }
  }, [output, isHistory]);

  

  const renderers: Components = {
    // 이미지 렌더링 커스터마이징 (기존 convertLinksAndImagesToHTML의 이미지 스타일 적용)
    img: ({ node, ...props }) => (
      // `alt` prop이 없을 경우 기본값으로 "이미지"를 제공합니다.
      <img
        {...props}
        alt={props.alt || "이미지"}
        data-url={props.src}
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
      />
    ),
    // 링크 렌더링 커스터마이징 (기존 convertLinksAndImagesToHTML의 링크 스타일 적용)
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
    // 각 줄의 선행 공백을 제거 (ltrim 효과) 
    cleaned = cleaned.replace(/^[ \t]+/gm, '');
    return cleaned;
  };

  const processedOutput = cleanOutput(output);

  const { title, tableData, isTable, footerLines } = parseMessage(processedOutput);

  const MessageContent = () => {
    if (isTable) {
      return (
        <>
          {title && <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{title}</p>}
          <Table variant="simple" size="sm" whiteSpace="normal">
            <Tbody>
              {Object.entries(tableData).map(([key, value]) => (
                <Tr key={key}>
                  <Th w="30%">{key}</Th>
                  <Td w="70%">{value as string}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {footerLines.length > 0 && 
            <Box mt="10px">
              <ReactMarkdown components={renderers}>
                {footerLines.join('\n')}
              </ReactMarkdown>
            </Box>
          }
        </>
      );
    }

    return <ReactMarkdown components={renderers}>{processedOutput}</ReactMarkdown>;
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
      'table': {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
      },
      'th, td': {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'left',
      },
      'th': {
        fontWeight: 'bold',
      },
    },
  };

  return (
    <Flex w="100%" flexDirection={'column'} overflow={'hidden'}>
      <Box mb="5px">
        {colorMode === 'dark' ? <DefaultHeaderLogo width={'46px'} height={'12px'} /> : <IconChatAiga width={'46px'} height={'12px'} />}
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
        <Box {...BoxProps}>
          {isLiveChat && !isLocalTypeDone
            ? (
              isTable ? (
                <>
                <>
                  <TypeAnimation
                    msg={
                      (title ? `${title}\n\n` : '') +
                      Object.entries(tableData)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('\n') +
                      (footerLines.length > 0 ? `\n\n${footerLines.join('\n')}` : '')
                    }
                    speed={20}
                    onComplete={() => { setIsTypingDone(); setLocalTypeDone(true); }}
                  />
                </>
                </>
              ) : (
                <TypeAnimation
                  msg={processedOutput}
                  speed={30}
                  onComplete={() => { setIsTypingDone(); setLocalTypeDone(true); }}
                />
              )
            )
            : <MessageContent />
          }
        </Box>
      </Flex>
    </Flex>
  );
});

export default AwesomeMessage;