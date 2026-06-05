import api from '@/services/api';
import type { ApiResponse, Product, Page } from '@/types';

export interface FetchProductsParams {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  deleted?: boolean;
}

export interface StockUpdateItem {
  productId: string;
  stockQuantity: number;
}

export interface BulkUpdateProductStockRequest {
  updates: StockUpdateItem[];
}

export async function fetchProducts(params?: FetchProductsParams): Promise<ApiResponse<Page<Product>>> {
  const { data } = await api.get<ApiResponse<Page<Product>>>('/api/v1/products', { params });
  return data;
}

export async function fetchProductById(id: string): Promise<ApiResponse<Product>> {
  const { data } = await api.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
  return data;
}

export async function updateProductStock(id: string, stockQuantity: number): Promise<ApiResponse<Product>> {
  const { data } = await api.put<ApiResponse<Product>>(`/api/v1/products/${id}/stock`, {
    stockQuantity,
  });
  return data;
}

export async function bulkUpdateProductStock(request: BulkUpdateProductStockRequest): Promise<ApiResponse<Product[]>> {
  const { data } = await api.put<ApiResponse<Product[]>>('/api/v1/products/stock', request);
  return data;
}

export async function fetchCategories(): Promise<ApiResponse<string[]>> {
  const { data } = await api.get<ApiResponse<string[]>>('/api/v1/products/categories');
  return data;
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  const { data } = await api.delete<ApiResponse<null>>(`/api/v1/products/${id}`);
  return data;
}

export async function restoreProduct(id: string): Promise<ApiResponse<Product>> {
  const { data } = await api.post<ApiResponse<Product>>(`/api/v1/products/${id}/restore`);
  return data;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
  const { data } = await api.post<ApiResponse<Product>>('/api/v1/products', product);
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
  const { data } = await api.put<ApiResponse<Product>>(`/api/v1/products/${id}`, product);
  return data;
}
