import React, { Suspense } from 'react';
import CategoryShareComponent from './CategoryShareComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CategoryShareDefault() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="progress" />}>
      <CategoryShareComponent />
    </Suspense>
  );
}
