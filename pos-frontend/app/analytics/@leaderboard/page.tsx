import React, { Suspense } from 'react';
import LeaderboardComponent from './LeaderboardComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { fetchMaidLeaderboard, MaidLeaderboardEntry, getAnalyticsDateRange } from '@/services/api-analytics';

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let entries: MaidLeaderboardEntry[] = [];

  const queryParams = getAnalyticsDateRange(params.filter, params.startDate, params.endDate);

  try {
    const res = await fetchMaidLeaderboard(queryParams);
    if (res?.success && res.data) {
      entries = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch data for @leaderboard slot:', error);
  }

  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="list" />}>
      <LeaderboardComponent entries={entries} />
    </Suspense>
  );
}
