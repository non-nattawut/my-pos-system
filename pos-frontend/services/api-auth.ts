import api from '@/services/api';
import type { ApiResponse, AuthUser, UserRole } from '@/types';

export interface LoginResponseData {
  token: string;
  email: string;
  name: string;
  role: UserRole;
  emoji?: string;
  imageUrl?: string;
}

export async function loginApi(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
  const { data } = await api.post<ApiResponse<LoginResponseData>>('/api/v1/auth/login', {
    email,
    password,
  });
  return data;
}

export async function fetchMaids(): Promise<ApiResponse<AuthUser[]>> {
  const { data } = await api.get<ApiResponse<AuthUser[]>>('/api/v1/auth/maids');
  return data;
}
