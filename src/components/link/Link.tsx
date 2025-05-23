'use client';
import { ButtonProps } from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import { Button } from '@chakra-ui/react';

interface AddLinkProps {
  target : string;
}

type LinkProps = ButtonProps & NextLinkProps & AddLinkProps;

function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink href={href} passHref legacyBehavior target={props?.target ? props.target : '_self'}>
      <Button as="a" variant="a" {...props} id="buttin_link">
        {children}
      </Button>
    </NextLink>
  );
}

export default Link;
