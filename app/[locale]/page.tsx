'use client';
import React, { Children } from 'react';
import { useParams } from 'next/navigation'
import PageLayout from '@/components/layout/PageLayout';
//import MainPage from '@/components/view/Main';
import MainPage from '@/components/view/NewMain';
import * as mCookie from "@/utils/cookies";
import functions from '@/utils/functions';
import {routing} from '@/i18n/routing';

export default function Index(  ) {
  const params = useParams<{ tag: string; item: string, locale: string }>()

  React.useEffect(() => {
    if ( functions.isEmpty(params?.locale) ) {
      mCookie.setCookie("currentLocale",routing.defaultLocale);
    }else{
      mCookie.setCookie("currentLocale",params?.locale);
    }
  },[params?.locale]);

  return (
    <PageLayout title="AIGA 의사추천">
     <MainPage />
    </PageLayout>
  )
}

