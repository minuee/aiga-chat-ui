import { useEffect, useState } from 'react';

export default function useKeyboardStatus() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialHeight, setInitialHeight] = useState<number | null>(null);

  useEffect(() => {
    let initial = window.innerHeight;
    setInitialHeight(initial);

    const checkInterval = setInterval(() => {
      const currentHeight = window.innerHeight;
      const heightDiff = initial - currentHeight;

      if (heightDiff > 150) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    }, 250); // 너무 짧게 두면 성능 문제 있으니 250~300ms 추천

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

return isKeyboardOpen;
}