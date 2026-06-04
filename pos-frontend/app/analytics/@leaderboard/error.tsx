'use client';

import React from 'react';
import { ErrorCard } from '@/components/ui/error/ErrorCard';
import { ErrorProps } from '@/types';

export default function LeaderboardError({ error, reset }: ErrorProps) {
  return (
    <ErrorCard
      title="Leaderboard Offline"
      description={error.message || 'Failed to read database performance logs.'}
      reset={reset}
    />
  );
}
