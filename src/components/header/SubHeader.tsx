'use client';

import { Metadata } from 'next';
import { BrowserView,isMobileOnly,isBrowser,isDesktop,isMobile} from "react-device-detect";
import Head from 'next/head';
export interface SubHeaderProps {
  addOption : any;
}

export const subMetadata:Metadata  = {
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    generator: 'Next.js',
    applicationName: 'Next.js',
    referrer: 'no-referrer',
    keywords: ['doctor', 'kormedi', 'aiga'],
    authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://aigadev.kormedi.com' }],
    creator: 'kormedi',
    publisher: 'kormedi',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        interactiveWidget:'resizes-content',
        userScalable: false
    },
    openGraph: {
        title: 'Next.js',
        description: 'The React Framework for the Web',
        url: 'https://localhost:3000',
        siteName: 'AIGA',
        images: [
        {
            url: 'http://localhost:3000/img/push/512.png', // Must be an absolute URL
            width: 512,
            height: 512,
        },
        {
            url: 'http://localhost:3000/img/push/1024.png', // Must be an absolute URL
            width: 1024,
            height: 1024,
            alt: 'My custom alt',
        },
        ],
        locale: 'ko',
        type: 'website',
    }
  }

function SubHeader(props: SubHeaderProps) {
  const { addOption } = props;


  return (
    <Head>
        <title>의사 추천 서비스 AIGA</title>
        
        <meta name='description' content='의사 추천 서비스 AIGA' />
        <meta name='keywords' content='중증, 의사' />
        <meta name='robots' content='index, follow' />
        {/* <meta name='viewport' content='width=device-width, initial-scale=1.0' /> */}
        {
          isMobileOnly
          ?  
          <meta name="viewport" content="width=device-width, maximum-scale=1.0,user-scalable=no, initial-scale=1.0, interactive-widget=resizes-content" />
          :
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no shrink-to-fit=no" /> 
        }
        <meta charSet='utf-8' />
        <meta property='og:site_name' content='AIGA 의사추천 서비스' />
        <meta property='og:locale' content='ko_KR' />
        <meta property='og:title' content='맞춤형 의사추천 서비스' />
        <meta property='og:description' content='맞춤형 의사추천 서비스' />
        <meta property='og:type' content='website' />
        <meta
          property='og:url'
          content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo'
        />
        <meta
          property='og:image'
          content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png'
        />
        <meta property='og:image:alt' content='의사추천 서비스' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta
          property='article:published_time'
          content='2024-01-14T11:35:00+07:00'
        />
        <meta
          property='article:modified_time'
          content='2024-01-14T11:35:00+07:00'
        />
        <meta
          property='article:author'
          content='https://www.kormedi.com'
        />
        <meta name='twitter:card' content='의사추천서비스' />
        <meta name='twitter:site' content='@mycodings' />
        <meta name='twitter:creator' content='@mycodings' />
        <meta name='twitter:title' content='의사추천서비스' />
        <meta name='twitter:description' content='의사추천서비스' />
        <meta
          name='twitter:image'
          content='https://mycodings.fly.dev/blog/2024-01-14-all-about-nextjs-seo/thumbnail.png'
        />
      </Head>
  );
}


export default SubHeader;
