// components/RegisterSW.tsx
'use client'

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('✅ ServiceWorker registered: ', registration);
          })
          .catch((error) => {
            console.error('❌ ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  return null;
}
