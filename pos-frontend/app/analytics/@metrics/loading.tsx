import React from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function MetricsLoading() {
  return <LoadingSkeleton rows={4} type="card" />;
}
