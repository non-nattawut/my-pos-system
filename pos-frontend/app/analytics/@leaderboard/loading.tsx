import React from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function LeaderboardLoading() {
  return <LoadingSkeleton rows={4} type="list" />;
}
