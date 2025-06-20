import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

type CustomDefaultTextProps = TextProps & {
    children: React.ReactNode;
};
//import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
const CustomDefaultText = ({ children, ...rest }: CustomDefaultTextProps) => {
    return (
        <Text 
            fontSize={'17px'}
            fontWeight={'normal'}
            fontFamily={'body_notosans'}
            {...rest}
        >
            {children}
        </Text>
    );
};

type CustomTextBold700Props = TextProps & {
    children: React.ReactNode;
};
  
export const CustomTextBold700 = ({ children, ...rest }: CustomTextBold700Props) => {
    return (
        <Text 
            fontWeight={'body_medium_700'}
            fontFamily={'body_notosans'}
            {...rest}
        >
            {children}
        </Text>
    );
};

type CustomTextBold400Props = TextProps & {
    children: React.ReactNode;
};
  
export const CustomTextBold400 = ({ children, ...rest }: CustomTextBold400Props) => {
    return (
        <Text 
            fontWeight={'body_medium_400'}
            fontFamily={'body_notosans'}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default React.memo(CustomDefaultText);