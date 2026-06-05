import api from '@/services/api';
import type { ApiResponse, OrderResponse, ReceiptResponse, PaymentMethod, OrderStatus, ServiceType } from '@/types';

/** Request shape for a single item when submitting an order to the API */
export interface OrderItemRequest {
  productId: string;
  quantity: number;
  note?: string;
}

/** Request body for POST /api/v1/orders */
export interface CreateOrderRequest {
  items: OrderItemRequest[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  maidEmail: string | null;
  serviceType: ServiceType;
  tableNumber: string | null;
  voucherCode?: string;
}

export interface OrderFilterParams {
  maidName?: string;
  receiptNumber?: string;
  startDate?: string;
  endDate?: string;
}

export async function createOrder(order: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
  const { data } = await api.post<ApiResponse<OrderResponse>>('/api/v1/orders', order);
  return data;
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
