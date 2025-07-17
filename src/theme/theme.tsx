import { extendTheme, HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import '@fontsource/noto-sans';
import '@fontsource/noto-sans/700.css';
import '@fontsource/noto-sans-kr'; // 기본 weight
import '@fontsource/noto-sans-kr/700.css'; // 굵은 weight
import { CardComponent } from './additions/card/card';
import { buttonStyles } from './components/button';
import { badgeStyles } from './components/badge';
import { inputStyles } from './components/input';
import { progressStyles } from './components/progress';
import { textareaStyles } from './components/textarea';
import { switchStyles } from './components/switch';
import { linkStyles } from './components/link';
import { globalStyles } from './styles';

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
  badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  inputStyles, // input styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  CardComponent, // card component
  {
    breakpoints,
    space : {
      basePadding: '16px',
      baseTopContainerPadding : '28px',
      baseTopContentPadding : '24px' 
    },
    fonts: {
      heading: `Noto Sans, sans-serif`,
      body: 'Noto Sans, sans-serif',
      body_notosans : "Noto Sans"
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
