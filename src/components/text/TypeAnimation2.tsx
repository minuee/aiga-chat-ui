import React from 'react';
import { Text } from '@chakra-ui/react';

type TypeAnimationProps = {
  msg: string;
  speed : number;
  onComplete?: () => void;
};

const TypeAnimationScreen = ({ msg, onComplete , speed = 30}: TypeAnimationProps) => {
  const [displayHtml, setDisplayHtml] = React.useState('');

  React.useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      i++;
      setDisplayHtml(msg.slice(0, i));
  
      if (i >= msg.length) {
        clearInterval(intervalId);
        if (onComplete) {
          setTimeout(() => onComplete(), 0); // 마지막 렌더 후 호출 보장
        }
      }
    }, speed ?? 30);
  
    return () => clearInterval(intervalId);
  }, [msg, speed]); // onComplete는 제거

  return (
    <Text
      style={{ whiteSpace: 'pre-line' }}
      whiteSpace="normal"
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  );
};

export default React.memo(TypeAnimationScreen);
