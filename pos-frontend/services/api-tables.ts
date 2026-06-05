import api from '@/services/api';
import type { ApiResponse, TableResponse } from '@/types';

export interface CreateTableRequest {
  tableNumber: string;
  seatSize: number;
}

export async function fetchTables(): Promise<ApiResponse<TableResponse[]>> {
  const { data } = await api.get<ApiResponse<TableResponse[]>>('/api/v1/tables');
  return data;
}

export async function fetchTableDetail(tableNumber: string): Promise<ApiResponse<TableResponse>> {
  const { data } = await api.get<ApiResponse<TableResponse>>(`/api/v1/tables/${tableNumber}`);
  return data;
}

export async function createTable(table: CreateTableRequest): Promise<ApiResponse<TableResponse>> {
  const { data } = await api.post<ApiResponse<TableResponse>>('/api/v1/tables', table);
  return data;
}

export async function deleteTable(id: string): Promise<ApiResponse<null>> {
  const { data } = await api.delete<ApiResponse<null>>(`/api/v1/tables/${id}`);
  return data;
}
