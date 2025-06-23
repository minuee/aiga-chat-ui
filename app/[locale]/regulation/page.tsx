'use client';

import React, { Children } from 'react';
import BrandLayout from '@/components/layout/BrandLayout';
import { Box} from '@chakra-ui/react';

import YakwanModal from '@/components/modal/YakwanContent';

export default function Index() {
  return (
    <BrandLayout title="이용약관">
      <Box display={'flex'} justifyContent={'center'} padding="30px">
        <YakwanModal 
        />
      </Box>
    </BrandLayout>
  )
}