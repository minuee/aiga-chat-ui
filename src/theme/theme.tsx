//'use client'; // 가장 중요!
import { extendTheme, HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
//import '@fontsource/noto-sans';
//import '@fontsource/noto-sans/700.css';
//import '@fontsource/noto-sans-kr'; // 기본 weight
//import '@fontsource/noto-sans-kr/700.css'; // 굵은 weight
import { Noto_Sans } from 'next/font/google';
import { CardComponent } from './additions/card/card';
import { buttonStyles } from './components/button';
import { badgeStyles } from './components/badge';
import { inputStyles } from './components/input';
import { progressStyles } from './components/progress';
import { textareaStyles } from './components/textarea';
import { switchStyles } from './components/switch';
import { linkStyles } from './components/link';
import { globalStyles } from './styles';

const notoSans = Noto_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const breakpoints = {
  base: '0em',
  'xsm': '300px',
  sm: '350px',
  sm2 : '530px',
  md: '640px',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
}


export default extendTheme(
  globalStyles,
  badgeStyles,
  buttonStyles,
  linkStyles, 
  progressStyles,
  inputStyles,
  textareaStyles,
  switchStyles,
  CardComponent, // card component
  {
    /* config: {
      initialColorMode: 'light',
      useSystemColorMode: true,
    }, */
    breakpoints,
    space : {
      basePadding: '16px',
      baseTopContainerPadding : '28px',
      baseTopContentPadding : '24px' 
    },
    fonts: {
      heading: `${notoSans.style.fontFamily}, sans-serif`,
      body: `${notoSans.style.fontFamily}, sans-serif`,
      body_notosans: `${notoSans.style.fontFamily}`,
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700,
      body_medium_400: 400, // 이렇게 정의는 가능
      body_medium_700: 700, // 이렇게 정의는 가능
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: '#cccccc',
          borderRadius: '0px',
        }
      }
    }
  },
);

export interface CustomCardProps extends HTMLChakraProps<'div'>, ThemingProps {}
