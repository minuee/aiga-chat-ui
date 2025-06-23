'use client';

import React, { Children } from 'react';
import BrandLayout from '@/components/layout/BrandLayout';
import { Box} from '@chakra-ui/react';

import PolicyContent from '@/components/modal/PolicyContent';

export default function Index() {
  return (
    <BrandLayout title="개인정보처리방침">
      <Box display={'flex'} justifyContent={'center'} padding="30px">
        <PolicyContent />
      </Box>
    </BrandLayout>
  )
}