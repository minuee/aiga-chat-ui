import React, { ReactNode } from 'react';
import type { Metadata } from 'next'

import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import MainComponent from './chatPage';
import { subMetadata } from '@/components/header/SubHeader';

export const metadata: Metadata = {
  ...subMetadata,
  title: {
    default: 'AIGA Chatbot',
    template: '%s | AIGA',
  },
}
export default function PageLayout({ children }: { children: ReactNode }) {

 
  return (
    <html lang="en">
      <body id={'chat_root'}>
        <MainComponent>
          {children}
        </MainComponent>
      </body>
    </html>
  );
}
