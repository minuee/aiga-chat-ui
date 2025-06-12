import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

type CustomDefaultTextProps = TextProps & {
    children: React.ReactNode;
};

const CustomDefaultText = ({ children, ...rest }: CustomDefaultTextProps) => {
    return (
        <Text 
            fontWeight={'normal'}
            {...rest}
        >
            {children}
        </Text>
    );
};

type CustomBoldTextProps = TextProps & {
    children: React.ReactNode;
};
  
export const CustomBoldText = ({ children, ...rest }: CustomBoldTextProps) => {
    return (
        <Text 
            fontWeight={'bold'}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default React.memo(CustomDefaultText);