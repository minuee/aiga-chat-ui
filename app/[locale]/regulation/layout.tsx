import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import React, { ReactNode } from 'react';
import {routing} from '@/i18n/routing';
import { subMetadata } from '@/components/header/SubHeader';
import type { Metadata } from 'next';
type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export const metadata: Metadata = {
  ...subMetadata,
  title: {
    default: 'AIGA 의사추천',
    template: '%s',
  },
  description: 'AIGA 의사 추천 서비스',
  icons: {
    icon: '/img/fav/Icon-512.png',
  },
}

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </>
  );
}