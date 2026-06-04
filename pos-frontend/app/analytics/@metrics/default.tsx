import React, { Suspense } from 'react';
import MetricsComponent from './MetricsComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function MetricsDefault() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="card" />}>
      <MetricsComponent />
    </Suspense>
  );
}
