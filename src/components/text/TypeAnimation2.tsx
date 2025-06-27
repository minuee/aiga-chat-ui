import React from 'react';
import { Text } from '@chakra-ui/react';

type TypeAnimationProps = {
  msg: string;
  speed : number;
  onComplete?: () => void;
};

const TypeAnimationScreen = ({ msg, onComplete , speed = 50}: TypeAnimationProps) => {
  const [displayHtml, setDisplayHtml] = React.useState('');

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const partial = msg.slice(0, i).replaceAll(/\n/g, '<br />').replaceAll(/\\n/g, '\n\n'); // 줄바꿈을 HTML 줄바꿈으로
      //const plainText = partial?.replace(/\\n/g, '\n\n')?? '';
      setDisplayHtml(partial);

      if (i >= msg.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed); // 🔸 타이핑 속도 더 빠르게 설정 (원하시면 조절 가능)
    return () => clearInterval(interval);
  }, [msg, onComplete]);

  return (
    <Text
      whiteSpace="normal" // <br />가 HTML에서 줄바꿈 역할을 하도록
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  );
};

export default React.memo(TypeAnimationScreen);
