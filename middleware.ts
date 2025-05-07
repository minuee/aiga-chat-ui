import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get('accessToken');
  const response = handleI18nRouting(request); // NextResponse 객체 반환됨

  console.log('accessToken', accessToken)
  console.log('requestHeaders', request.nextUrl.pathname)

  // 기존 응답 객체의 헤더에 추가 정보 설정
  response.headers.set('x-current-path', request.nextUrl.pathname);
  response.cookies.set('x-current-path', request.nextUrl.pathname);
  return response; // 여기서 response 그대로 반환
}


export const config = {
    //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|.*\\.png$).*)']
    matcher: [ "/", "/(ko|ja)/:path*"]
    //matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};