import api from '@/services/api';
import type { ApiResponse, AuthUser, UserResponse, CreateUserRequest, UpdateProfileRequest } from '@/types';

export async function fetchUsers(): Promise<ApiResponse<AuthUser[]>> {
  const { data } = await api.get<ApiResponse<UserResponse[]>>('/api/v1/users');
  if (data.success && data.data) {
    const mappedUsers = data.data.map(u => ({
      ...u,
      displayName: u.name
    }));
    return {
      ...data,
      data: mappedUsers
    };
  }
  return data as unknown as ApiResponse<AuthUser[]>;
}

export async function createUser(user: CreateUserRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.post<ApiResponse<UserResponse>>('/api/v1/users', user);
  if (data.success && data.data) {
    const mappedUser = {
      ...data.data,
      displayName: data.data.name
    };
    return {
      ...data,
      data: mappedUser
    };
  }
  return data as unknown as ApiResponse<AuthUser>;
}

export async function updateUserProfile(profile: UpdateProfileRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.put<ApiResponse<UserResponse>>('/api/v1/users/profile', profile);
  if (data.success && data.data) {
    const mappedUser = {
      ...data.data,
      displayName: data.data.name
    };
    return {
      ...data,
      data: mappedUser
    };
  }
  return data as unknown as ApiResponse<AuthUser>;
}

export async function updateUser(id: string, user: CreateUserRequest): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.put<ApiResponse<UserResponse>>(`/api/v1/users/${id}`, user);
  if (data.success && data.data) {
    const mappedUser = {
      ...data.data,
      displayName: data.data.name
    };
    return {
      ...data,
      data: mappedUser
    };
  }
  return data as unknown as ApiResponse<AuthUser>;
}

export async function fetchUserRoles(): Promise<ApiResponse<string[]>> {
  const { data } = await api.get<ApiResponse<string[]>>('/api/v1/users/roles');
  return data;
}

export async function fetchUserProfile(): Promise<ApiResponse<AuthUser>> {
  const { data } = await api.get<ApiResponse<UserResponse>>('/api/v1/users/profile');
  if (data.success && data.data) {
    const mappedUser = {
      ...data.data,
      displayName: data.data.name
    };
    return {
      ...data,
      data: mappedUser
    };
  }
  return data as unknown as ApiResponse<AuthUser>;
}
