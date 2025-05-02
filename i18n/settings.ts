import { InitOptions } from 'i18next';
 
export const fallbackLng = 'en';
export const locales = [fallbackLng, 'ko'] as const;
export type LocaleTypes = (typeof locales)[number];
export const defaultNS = 'common';
 
export function getOptions(lang = fallbackLng, ns = defaultNS): InitOptions {
  return {
    // debug: true, // Set to true to see console logs
    supportedLngs: locales, // 지원하는 언어 목록 설정
    fallbackLng, // 기본 언어(대체 언어) 설정
    lng: lang, // 현재 사용할 언어
    fallbackNS: defaultNS, // 기본 네임스페이스 설정
    defaultNS, // 네임스페이스 기본 값 설정
    ns, // 사용할 네임스페이스
  };
}