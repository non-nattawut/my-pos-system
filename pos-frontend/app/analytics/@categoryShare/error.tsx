'use client';

import React from 'react';
import { ErrorCard } from '@/components/ui/error/ErrorCard';
import { ErrorProps } from '@/types';

export default function CategoryShareError({ error, reset }: ErrorProps) {
  return (
    <ErrorCard
      title="Share Analysis Error"
      description={error.message || 'Failed to structure category matrices.'}
      actionText="Reinitialize Matrix"
      reset={reset}
    />
  );
}
