import api from '@/services/api';
import type { ApiResponse, AuthUser, UserRole } from '@/types';

export interface CreateUserRequest {
  email?: string;
  name?: string;
  password?: string | null;
  role?: UserRole;
  emoji?: string;
  imageUrl?: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  emoji?: string;
  imageUrl?: string | null;
  password?: string | null;
  oldPassword?: string | null;
}

export async function fetchUsers(): Promise<ApiResponse<AuthUser[]>> {
  const { data } = await api.get<ApiResponse<AuthUser[]>>('/api/v1/users');
  return data;
}

export async function createUser(user: CreateUserRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.post<ApiResponse<AuthUser>>('/api/v1/users', user);
  return data;
}

export async function updateUserProfile(profile: UpdateProfileRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.put<ApiResponse<AuthUser>>('/api/v1/users/profile', profile);
  return data;
}

export async function updateUser(id: string, user: CreateUserRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.put<ApiResponse<AuthUser>>(`/api/v1/users/${id}`, user);
  return data;
}

export async function fetchUserRoles(): Promise<ApiResponse<string[]>> {
  const { data } = await api.get<ApiResponse<string[]>>('/api/v1/users/roles');
  return data;
}

export async function fetchUserProfile(): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.get<ApiResponse<AuthUser>>('/api/v1/users/profile');
  return data;
}
