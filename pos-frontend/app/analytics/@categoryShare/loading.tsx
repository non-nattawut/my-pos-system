import React from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CategoryShareLoading() {
  return <LoadingSkeleton rows={4} type="progress" />;
}
