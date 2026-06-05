import api from '@/services/api';
import type { ApiResponse } from '@/types';

export interface ConfigResponse {
  taxRate: number;
  serviceChargeRate: number;
}

export async function fetchConfig(): Promise<ApiResponse<ConfigResponse>> {
  const { data } = await api.get<ApiResponse<ConfigResponse>>('/api/v1/config');
  return data;
}
