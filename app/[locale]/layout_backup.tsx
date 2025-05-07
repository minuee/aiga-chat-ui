import React, { ReactNode } from 'react';
import type { Metadata } from 'next'

import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import MainComponent from './mainPage';
import { Locale, routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { subMetadata } from '@/components/header/SubHeader';

export const metadata: Metadata = {
  ...subMetadata,
  title: {
    default: 'AIGA Chatbot',
    template: '%s | AIGA',
  },
  description: 'AIGA Chatbot',
  icons: {
    icon: '/img/push/512.png',
  },
}

export default async function MainLayout({ children,params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; // Next.js 15에서는 Promise로 params를 받아야 합니다.
}>) {
  const locale = (await params).locale;

  // Ensure that the incoming `locale` is valid
  console.log('locale',locale);
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
      <>
        <NextIntlClientProvider messages={messages}>
          <MainComponent>
            {children}
          </MainComponent>
        </NextIntlClientProvider>
      </>
  );
}
/*
export default function RootLayout({ children }: { children: ReactNode }) {

  /* useEffect(() => {

    if (!("serviceWorker" in navigator)) return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(async (registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          const subscription = await registration.pushManager.getSubscription();
          console.log('subscription',subscription);
          if (subscription) {
              console.log('Already subscribed',subscription);
          } else {
             console.log('Not subscribed');
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    if ('PushManager' in window) {
      // 푸시 알림 구독 요청
      async function subscribeToPush() {
        try {
          const registration = await navigator.serviceWorker.ready;
          const pushManager = registration.pushManager;
  
          if (pushManager) {
            const subscription = await pushManager.getSubscription();
  
            if (subscription) {
              // 이미 구독 중인 경우
              console.log('이미 구독 중');
              return subscription;
            } else {
              // 구독 신청
              const subscription = await pushManager.subscribe({
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, // 서버 키
                userVisibleOnly: true, // 사용자에게 보이는 알림만 허용
              });
              console.log('구독 완료', subscription);
              return subscription;
            }
          }
        } catch (error) {
          console.error('푸시 알림 구독 실패', error);
        }
      }
  
      // 웹 페이지 로드 시 푸시 알림 구독 요청
      window.addEventListener('load', () => {
        subscribeToPush();
      });
    } else {
      console.warn('브라우저에서 Push API를 지원하지 않습니다.');
    }
  }, []); 



  return (
    <html lang="en">
      <body id={'root'}>
        <MainComponent>
          {children}
        </MainComponent>
      </body>
    </html>
  );
}
*/
