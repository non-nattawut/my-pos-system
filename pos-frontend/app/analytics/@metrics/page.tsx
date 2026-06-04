import React, { Suspense } from 'react';
import MetricsComponent from './MetricsComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { fetchMetrics, MetricsData, getAnalyticsDateRange } from '@/services/api-analytics';

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function MetricsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  let metrics: MetricsData = {
    grossRevenue: 0,
    orderVolume: 0,
    averageOrderValue: 0,
    hottestCategory: 'None',
    netProfit: 0,
    profitMargin: 0
  };

  const queryParams = getAnalyticsDateRange(params.filter, params.startDate, params.endDate);

  try {
    const res = await fetchMetrics(queryParams);
    if (res?.success && res.data) {
      metrics = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch data for @metrics slot:', error);
  }

  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="card" />}>
      <MetricsComponent metrics={metrics} />
    </Suspense>
  );
}
