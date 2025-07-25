'use client'

import React from 'react';
import { useColorModeValue,useColorMode,Flex,Box } from '@chakra-ui/react'
import TypeAnimation  from'@/components/text/TypeAnimation2';
import { IconChatAiga,DefaultHeaderLogo} from '@/components/icons/svgIcons';

function convertLinksAndImagesToHTML(text: string): string {
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const imageRegex = /\.(jpeg|jpg|png|gif|bmp|webp)(\?.*)?$/i;

  const imageUrls: string[] = [];

  // 1. Markdown 이미지 처리
  let convertedText = text.replace(markdownImageRegex, (_, alt, url) => {
    const cleanUrl = url.trim();
    imageUrls.push(cleanUrl);
    return `
      <img
        src="${cleanUrl}"
        alt="이미지"
        data-url="${cleanUrl}"
        style="max-width: 100%; height: auto; max-height: 100px; min-width: 100px; object-fit: contain; margin: 10px 0; border-radius: 8px; display: block; cursor: pointer;"
      />
    `;
  });

  // 2. 일반 URL 처리 (단, HTML 태그 내부는 제외)
  const urls = convertedText.match(urlRegex);
  const uniqueUrls = Array.from(new Set(urls ?? []));

  convertedText = convertedText.replace(urlRegex, function (rawUrl, _1, offset, fullText) {
    const cleanUrl = rawUrl.trim();
  
    // HTML 태그 내부에 있으면 무시
    const before = fullText.lastIndexOf('<', offset);
    const after = fullText.indexOf('>', offset);
    const isInsideTag = before !== -1 && after !== -1 && before < offset && offset < after;
  
    if (isInsideTag) return rawUrl;
  
    if (imageUrls.includes(cleanUrl)) return rawUrl;
  
    if (imageRegex.test(cleanUrl)) {
      return `
        <img
          src="${cleanUrl}"
          alt="이미지"
          data-url="${cleanUrl}"
          style="max-width: 100%; height: auto; max-height: 100px; min-width: 100px; object-fit: contain; margin: 10px 0; border-radius: 8px; display: block; cursor: pointer;"
        />
      `;
    } else {
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">${cleanUrl}</a>`;
    }
  });

  // 3. 사이트 바로가기 링크 (이미지가 하나도 없을 경우에만)
  const hasImage = imageUrls.length > 0;

  const firstTextLink = uniqueUrls.find((url) => {
    const cleanUrl = url.trim();
    return !imageRegex.test(cleanUrl) && !imageUrls.includes(cleanUrl);
  });

  const shortcut = !hasImage && firstTextLink
    ? `<br><a href="${firstTextLink.trim()}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff;">☞ 사이트 바로가기</a>`
    : '';

  return convertedText + shortcut;
}


const GeneralMessage = React.memo(function GeneralMessage({ output,isHistory,setIsTypingDone,isLiveChat
}: { 
  output: any,isLiveChat:boolean ,isHistory:boolean,setIsTypingDone: () => void;
}) {
  const [isLocalTypeDone, setLocalTypeDone] = React.useState(false)
  console.log("GeneralMessage 렌더링"); // ← 디버깅용
  const { colorMode, toggleColorMode } = useColorMode();
  const bgSystemColor = useColorModeValue('#F4F6FA', 'navy.600');
  const previousOutputRef = React.useRef<string | null>(null); // 이전 output 값을 저장
  const containerRef = React.useRef<HTMLDivElement | null>(null);


  React.useEffect(() => {
    previousOutputRef.current =  output; // output이 변경될 때마다 이전 값을 업데이트
    if ( previousOutputRef.current == null) {
      setLocalTypeDone(false)
    }
  }, [output]);

  const isOutputSame = previousOutputRef.current === output && previousOutputRef.current !== null;
  
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
                    button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 10px 15px;
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                  }
                  button:hover {
                    background: rgba(255,255,255,0.4);
                  }
                </style>
              </head>
              <body>
                <button onclick="window.close()">닫기 ✕</button>
                <img src="${url}" alt="이미지" />
              </body>
            </html>
          `);
          popup.document.close();
        }
      }
    };
  
    // 전역 등록
    document.addEventListener('click', onClick);
  
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

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
          (
            isLocalTypeDone
            ?
            <div
              ref={containerRef}
              style={{ fontSize: '17px', whiteSpace: 'pre-line',fontFamily:'Noto Sans' }}
              dangerouslySetInnerHTML={{
                __html: convertLinksAndImagesToHTML(output.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'))
              }}
            />
            :
            (
            <TypeAnimation
              msg={ output.replace(/^"(.*)"$/, '$1')}
              speed={30}
              onComplete={() => {setIsTypingDone();setLocalTypeDone(true)}}
            />
            )
          )
         
          :
          <div
            ref={containerRef}
            style={{ fontSize: '17px', whiteSpace: 'pre-line',fontFamily:'Noto Sans' }}
            dangerouslySetInnerHTML={{
              __html: convertLinksAndImagesToHTML(output.replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')),
            }}
          />
        }
      </Flex>
    </Flex>
  );
}, (prevProps, nextProps) => prevProps.output === nextProps.output);

export default GeneralMessage;
