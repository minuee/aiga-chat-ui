import React, { ReactNode } from 'react';
import type { Metadata } from 'next'
import { Locale, routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import MainComponent from './chatPage';
import { subMetadata } from '@/components/header/SubHeader';

export const metadata: Metadata = {
  ...subMetadata,
  title: {
    default: 'AIGA Chatbot',
    template: '%s | AIGA',
  },
}
export default async function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; // Next.js 15에서는 Promise로 params를 받아야 합니다.
}>) {
  const locale = (await params).locale;
  const messages = await getMessages();
  return (
    <>
      <MainComponent>
        {children}
      </MainComponent>
    </>
  );
}