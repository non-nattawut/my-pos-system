'use client';

import React from 'react';
import { ErrorCard } from '@/components/ui/error/ErrorCard';
import { ErrorProps } from '@/types';

export default function MetricsError({ error, reset }: ErrorProps) {
  return (
    <ErrorCard
      title="Metrics Core Offline"
      description={error.message || 'Failed to read telemetry data feed.'}
      reset={reset}
    />
  );
}
