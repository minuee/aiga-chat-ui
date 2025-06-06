import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

//import createMiddleware from "next-intl/middleware";
//import { routing } from "./i18n/routing";
//const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키
  const requestHeaders = new Headers(request.headers);
  const accessToken = request.cookies.get('accessToken');
  console.log('accessToken',accessToken)
  requestHeaders.set('x-current-path"', request.nextUrl.pathname);
  console.log('requestHeaders')
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
  //return handleI18nRouting(request)  
}
export const config = {
  matcher: [
    '/',
    '/(ko|ja)',
    '/(ko|ja)/((?!_next|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(png|jpg|jpeg|webp|svg|ico|woff2?)$).*)',
  ],
};

/* export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images|.*\\.png$).*)']
    matcher: [ "/", "/(ko|ja)/:path*"]
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}; */