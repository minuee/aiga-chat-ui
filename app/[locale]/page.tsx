'use client';
import React, { Children } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MainPage from '@/components/view/Main';


export default function Index() {

  return (
    <PageLayout title="AIGA Chatbot">
      <MainPage />
    </PageLayout>
  )
}

