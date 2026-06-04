import api from '@/services/api';
import type { ApiResponse, LoginResponseData, UserResponse } from '@/types';

export async function loginApi(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
  const { data } = await api.post<ApiResponse<LoginResponseData>>('/api/v1/auth/login', {
    email,
    password,
  });
  return data;
}

export async function fetchMaids(): Promise<ApiResponse<UserResponse[]>> {
  const { data } = await api.get<ApiResponse<UserResponse[]>>('/api/v1/auth/maids');
  return data;
}
