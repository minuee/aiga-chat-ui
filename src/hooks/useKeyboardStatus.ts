import { useEffect, useState } from 'react';

export default function useKeyboardStatus() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialHeight, setInitialHeight] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (initialHeight === null) {
        setInitialHeight(window.innerHeight);
        return;
      }

      const heightDiff = initialHeight - window.innerHeight;

      // 모바일 키보드가 올라오면 150~300px 정도 줄어듦
      if (heightDiff > 150) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // 초기 체크
    setInitialHeight(window.innerHeight);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialHeight]);

  return isKeyboardOpen;
}
