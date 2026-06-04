import React, { Suspense } from 'react';
import LeaderboardComponent from './LeaderboardComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function LeaderboardDefault() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="list" />}>
      <LeaderboardComponent />
    </Suspense>
  );
}
