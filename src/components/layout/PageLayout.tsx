import {ReactNode} from 'react';
import AppWrappers from '@/components/layout/AppWrappers';

type Props = {
  children?: ReactNode;
  title: string;
};

export default function PageLayout({children, title}: Props) {
  return (
    <>
      <AppWrappers>
        {children}
      </AppWrappers>
    </>
  );
}