// 예시: components/TypeAnimation.jsx
import { useEffect, useState } from 'react';

const TypeAnimation = (msg:any, speed:number = 50) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + msg[index]);
      index++;
      if (index >= msg.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [msg, speed]);

  return <p>{displayed}</p>;
};

export default TypeAnimation;
