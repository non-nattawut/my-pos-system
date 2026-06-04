import api from '@/services/api';
import type { ApiResponse } from '@/types';

export interface Voucher {
  id: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
  usedCount: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface VoucherRequest {
  code: string;
  discountPercentage: number;
  maxUses: number;
}

export async function fetchVouchers(): Promise<ApiResponse<Voucher[]>> {
  const { data } = await api.get<ApiResponse<Voucher[]>>('/api/v1/vouchers');
  return data;
}

export async function fetchVoucherById(id: string): Promise<ApiResponse<Voucher>> {
  const { data } = await api.get<ApiResponse<Voucher>>(`/api/v1/vouchers/${id}`);
  return data;
}

export async function fetchVoucherByCode(code: string): Promise<ApiResponse<Voucher>> {
  const { data } = await api.get<ApiResponse<Voucher>>(`/api/v1/vouchers/code/${code}`);
  return data;
}

export async function createVoucher(voucher: VoucherRequest): Promise<ApiResponse<Voucher>> {
  const { data } = await api.post<ApiResponse<Voucher>>('/api/v1/vouchers', voucher);
  return data;
}

export async function updateVoucher(id: string, voucher: VoucherRequest): Promise<ApiResponse<Voucher>> {
  const { data } = await api.put<ApiResponse<Voucher>>(`/api/v1/vouchers/${id}`, voucher);
  return data;
}

export async function deleteVoucher(id: string): Promise<ApiResponse<null>> {
  const { data } = await api.delete<ApiResponse<null>>(`/api/v1/vouchers/${id}`);
  return data;
}
