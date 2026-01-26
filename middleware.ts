import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { routing } from './src/i18n/routing';
import createMiddleware from "next-intl/middleware";

// next-intl 미들웨어는 URL에 로케일이 이미 있는 경우에만 사용합니다.
// (쿠키 설정, 로케일 컨텍스트 제공 등의 역할을 위해)
const handleI18nRouting = createMiddleware({
  ...routing,
  // localeDetection을 false로 설정하여, 이 미들웨어가 언어 감지를 시도하지 않도록 합니다.
  // 이 미들웨어는 경로에 로케일이 이미 존재할 때만 호출될 것이기 때문입니다.
  localeDetection: false,
});

// 요청 헤더를 기반으로 최적의 로케일을 찾아내는 함수
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @formatjs/intl-localematcher 와 negotiator를 사용하여 최적의 언어 찾기
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, routing.locales, routing.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // URL 경로에 이미 로케일이 포함되어 있는지 확인
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 1. 로케일이 없는 경우: 직접 감지하여 리디렉션
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request); // accept-language 헤더에서 언어 감지

    // 감지된 로케일을 포함한 URL로 리디렉션
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : ''}${pathname}`, request.url)
    );
  }

  // 2. 로케일이 이미 있는 경우: next-intl 미들웨어에 처리 위임
  const response = handleI18nRouting(request);

  // 필요한 경우 여기에 추가적인 헤더나 쿠키를 설정할 수 있습니다.
  response.headers.set('x-current-path', pathname);
  response.cookies.set('x-current-path', pathname);

  return response;
}

export const config = {
  // API, 정적 파일 등을 제외한 모든 경로에서 미들웨어가 실행되도록 설정
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|fonts|images|.*\\.png$).*)'],
};