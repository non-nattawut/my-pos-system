import api from '@/services/api';
import type { ApiResponse, CreateOrderRequest, OrderResponse, ReceiptResponse } from '@/types';

export async function createOrder(order: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
  const { data } = await api.post<ApiResponse<OrderResponse>>('/api/v1/orders', order);
  return data;
}

export interface OrderFilterParams {
  maidName?: string;
  receiptNumber?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchOrders(params?: OrderFilterParams): Promise<ApiResponse<OrderResponse[]>> {
  const { data } = await api.get<ApiResponse<OrderResponse[]>>('/api/v1/orders', { params });
  return data;
}

export async function fetchTableOrders(tableNumber: string): Promise<ApiResponse<OrderResponse[]>> {
  const { data } = await api.get<ApiResponse<OrderResponse[]>>(`/api/v1/tables/${tableNumber}/orders`);
  return data;
}

export async function payTable(tableNumber: string, voucherCode?: string): Promise<ApiResponse<ReceiptResponse>> {
  const url = voucherCode ? `/api/v1/tables/${tableNumber}/pay?voucherCode=${encodeURIComponent(voucherCode)}` : `/api/v1/tables/${tableNumber}/pay`;
  const { data } = await api.post<ApiResponse<ReceiptResponse>>(url);
  return data;
}
