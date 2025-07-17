'use client';

import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import CahtPageView from "@/components/view/ChatPage"

export default function Index() {

  return (
    <PageLayout title="AIGA 의사추천">
      <CahtPageView />
    </PageLayout>
  )
}