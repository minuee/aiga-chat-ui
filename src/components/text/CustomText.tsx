import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

type CustomTextProps = TextProps & {
    children: React.ReactNode;
};

const CustomDefaultText = ({ children, ...rest }: CustomTextProps) => {
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

export const CustomTextBold700 = React.memo(({ children, ...rest }: CustomTextProps) => {
    return (
        <Text 
            fontWeight={'body_medium_700'}
            fontFamily={'body_notosans'}
            {...rest}
        >
            {children}
        </Text>
    );
});


export const CustomTextBold400 = React.memo(({ children, ...rest }: CustomTextProps) => {
    return (
        <Text 
            fontWeight={'body_medium_400'}
            fontFamily={'body_notosans'}
            {...rest}
        >
            {children}
        </Text>
    );
});

export default React.memo(CustomDefaultText);