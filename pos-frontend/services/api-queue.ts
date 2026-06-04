import api from '@/services/api';
import type { ApiResponse, OrderResponse, OrderStatus } from '@/types';

export async function fetchQueueOrders(): Promise<ApiResponse<OrderResponse[]>> {
  const { data } = await api.get<ApiResponse<OrderResponse[]>>('/api/v1/queue');
  return data;
}

export async function updateQueueStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<OrderResponse>> {
  const { data } = await api.put<ApiResponse<OrderResponse>>(`/api/v1/queue/${orderId}/status`, null, {
    params: { status }
  });
  return data;
}
