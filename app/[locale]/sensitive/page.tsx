'use client';

import React, { Children } from 'react';
import BrandLayout from '@/components/layout/BrandLayout';
import { Box} from '@chakra-ui/react';

import MingamContent from '@/components/modal/MingamContent';

export default function Index() {
  return (
    <BrandLayout title="민감정보 이용">
      <Box display={'flex'} justifyContent={'center'} padding="30px">
        <MingamContent />
      </Box>
    </BrandLayout>
  )
}