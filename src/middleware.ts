import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { fallbackLng, locales } from '@i18n/settings';


export async function middleware(request:NextRequest) {
	// 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키
    const { nextUrl, cookies } = request;
    const { origin, pathname } = nextUrl;
    const accessToken = cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN as string);
    console.log('accessToken',process.env.NEXT_PUBLIC_AUTH_TOKEN,accessToken)

    // Check if the default locale is in the pathname
    if (pathname.startsWith(`/${fallbackLng}/`) || pathname === `/${fallbackLng}`) {
        // e.g. incoming request is /en/about
        // The new URL is now /about
        return NextResponse.redirect(
        new URL(
            pathname.replace(`/${fallbackLng}`, pathname === `/${fallbackLng}` ? '/' : ''),
            request.url
        )
        );
    }

    const pathnameIsMissingLocale = locales.every(
        (locale:string) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        // We are on the default locale
        // Rewrite so Next.js understands

        // e.g. incoming request is /about
        // Tell Next.js it should pretend it's /en/about
        return NextResponse.rewrite(new URL(`/${fallbackLng}${pathname}`, request.url));
    }
    
    /* if (accessToken !== undefined) {
        if ( pathname === "/auth/sign-in") {
            return NextResponse.redirect(new URL(`/admin/default`,request.url)
            )
        }else{
            return NextResponse.next();
        }
        
    }else{
         console.log('pathname',pathname)
        if ( pathname === "/auth/sign-in") {
            return NextResponse.next();
            
        }else{
            // 로그인이 필요 없는 페이지는 그냥 다음 요청으로 진행
            return NextResponse.rewrite(new URL("/auth/sign-in", request.url));
        }
    } */
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|.*\\.png$).*)'],
  };