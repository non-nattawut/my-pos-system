import api from '@/services/api';
import type { ApiResponse, ReceiptResponse } from '@/types';

export interface ReceiptFilterParams {
  maidName?: string;
  receiptNumber?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchReceipts(params?: ReceiptFilterParams): Promise<ApiResponse<ReceiptResponse[]>> {
  const { data } = await api.get<ApiResponse<ReceiptResponse[]>>('/api/v1/receipts', { params });
  return data;
}
