import {ReactNode} from 'react';
import AppWrappers from '@/components/layout/AppWrappers';
import { SessionProvider } from "next-auth/react";
type Props = {
  children?: ReactNode;
  title: string;
};

export default function PageLayout({children, title}: Props) {
  return (
    <>
        <AppWrappers>
            <SessionProvider>
                {children}
            </SessionProvider>
        </AppWrappers>
    </>
  );
}