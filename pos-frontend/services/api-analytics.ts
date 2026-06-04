import api from '@/services/api';
import type { ApiResponse } from '@/types';

export interface MetricsData {
  grossRevenue: number;
  orderVolume: number;
  averageOrderValue: number;
  hottestCategory: string;
  netProfit: number;
  profitMargin: number;
}

export interface CategoryShareData {
  category: string;
  sales: number;
  sharePercentage: number;
}

export interface MaidLeaderboardEntry {
  maidName: string;
  sales: number;
  orderCount: number;
  emoji?: string;
  imageUrl?: string;
}

export interface AnalyticsFilterParams {
  startDate?: string;
  endDate?: string;
}

export async function fetchMetrics(params?: AnalyticsFilterParams): Promise<ApiResponse<MetricsData>> {
  const queryParams = formatDates(params);
  const { data } = await api.get<ApiResponse<MetricsData>>('/api/v1/analytics/metrics', { params: queryParams });
  return data;
}

export async function fetchCategoryShare(params?: AnalyticsFilterParams): Promise<ApiResponse<CategoryShareData[]>> {
  const queryParams = formatDates(params);
  const { data } = await api.get<ApiResponse<CategoryShareData[]>>('/api/v1/analytics/category-share', { params: queryParams });
  return data;
}

export async function fetchMaidLeaderboard(params?: AnalyticsFilterParams): Promise<ApiResponse<MaidLeaderboardEntry[]>> {
  const queryParams = formatDates(params);
  const { data } = await api.get<ApiResponse<MaidLeaderboardEntry[]>>('/api/v1/analytics/maid-leaderboard', { params: queryParams });
  return data;
}

function formatDates(params?: AnalyticsFilterParams) {
  if (!params) return undefined;
  const formatted: Record<string, string> = {};
  if (params.startDate) formatted.startDate = `${params.startDate}T00:00:00`;
  if (params.endDate) formatted.endDate = `${params.endDate}T23:59:59`;
  return formatted;
}

export function getAnalyticsDateRange(filter: string = 'all', startDate?: string, endDate?: string): AnalyticsFilterParams {
  const now = new Date();
  if (filter === 'today') {
    const todayStr = now.toISOString().split('T')[0];
    return { startDate: todayStr, endDate: todayStr };
  } else if (filter === 'month') {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const startStr = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const endStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    return { startDate: startStr, endDate: endStr };
  } else if (filter === 'custom') {
    return { startDate, endDate };
  } else {
    // all time
    return { startDate: '1970-01-01', endDate: '2099-12-31' };
  }
}
