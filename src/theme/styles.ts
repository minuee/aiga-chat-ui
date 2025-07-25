import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    brand: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#7551FF',
      300: '#7551FF',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    brandTabs: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#422AFB',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E2E8F0',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#718096',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E31A1A',
    },
    blue: {
      50: '#EFF4FB',
      500: '#3965FF',
      100: '#2B8FFF'
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },
    white: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },
    gray: {
      100: '#FAFCFE',
    },
  },
  styles: {
    global: (props: any) => {
      const baseBg = mode('#fdfeff', 'navy.800')(props);
  
      return {
        html: {
          height: '100%',
          width: '100%',
          fontFamily: 'Noto Sans',
        },
        body: {
          height: '100%',
          width: '100%',
          overflowX: 'hidden',
          fontFamily: 'Noto Sans',
  
          // ✅ breakpoint + color mode 동시 처리
          bg: {
            base: baseBg,                 // 모바일 기준 기본 배경
            md: '#fdfeff', // md 이상일 때만 transparent 적용 (다크모드 한정)
          },
        },
        '#__next': {
          height: '100%',
          width: '100%',
        },
        input: {
          color: 'gray.700',
        },
      };
    },
  },
  
};
