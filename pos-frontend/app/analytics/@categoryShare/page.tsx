import React, { Suspense } from 'react';
import CategoryShareComponent from './CategoryShareComponent';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { fetchCategoryShare, CategoryShareData, getAnalyticsDateRange } from '@/services/api-analytics';

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function CategorySharePage({ searchParams }: PageProps) {
  const params = await searchParams;
  let shares: CategoryShareData[] = [];

  const queryParams = getAnalyticsDateRange(params.filter, params.startDate, params.endDate);

  try {
    const res = await fetchCategoryShare(queryParams);
    if (res?.success && res.data) {
      shares = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch data for @categoryShare slot:', error);
  }

  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="progress" />}>
      <CategoryShareComponent shares={shares} />
    </Suspense>
  );
}
