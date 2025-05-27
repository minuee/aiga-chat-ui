import { NextResponse,userAgent } from 'next/server'
import type { NextRequest } from 'next/server'

import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  
  const { device,isBot } = userAgent(request);
  const pathname = request.nextUrl.pathname;
  const viewport = device.type || 'desktop';
	const accessToken = request.cookies.get('accessToken');
  const response = handleI18nRouting(request); // NextResponse 객체 반환됨

  // 기존 응답 객체의 헤더에 추가 정보 설정
  response.headers.set('x-current-path', request.nextUrl.pathname);
  response.cookies.set('x-current-path', request.nextUrl.pathname);

  /* 봇일경우는 채팅페이지 접속을 막는다 */
  if ( isBot && pathname.includes('/chat') ) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  return response; // 여기서 response 그대로 반환
}


export const config = {
    //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|.*\\.png$).*)']
    matcher: [ "/", "/(ko|ja)/:path*"]
    //matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};