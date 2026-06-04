import { PAYMENT_METHODS, ORDER_STATUSES, SERVICE_TYPES, USER_ROLES } from '@/constants';

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];
export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface Product {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  costPrice: number;
  description: string;
  imageUrl?: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  deleted?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

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



/** Standard API response envelope from the backend */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/** Login endpoint response data */
export interface LoginResponseData {
  token: string;
  email: string;
  displayName: string;
  role: UserRole;
  emoji?: string;
  imageUrl?: string;
}

/** Authenticated user session info stored in context */
export interface AuthUser {
  id?: string;
  token?: string;
  email: string;
  displayName: string;
  role: UserRole;
  emoji?: string;
  imageUrl?: string | null;
}

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

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

export interface CreateTableRequest {
  tableNumber: string;
  seatSize: number;
}

export interface UserResponse {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  emoji?: string;
  imageUrl?: string | null;
}

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

export interface OrderItemDbResponse {
  id: string;
  product?: {
    id: string;
    name: string;
    price: number;
  } | null;
  quantity?: number;
  note?: string;
}

export interface OrderResponse {
  id: string;
  receiptNumber: string;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  maidName: string;
  serviceType: ServiceType;
  tableNumber: string | null;
  items?: OrderItemDbResponse[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ReceiptResponse {
  id: string;
  receiptNumber: string;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  serviceType: ServiceType;
  tableNumber?: string | null;
  maidName: string;
  orders?: OrderResponse[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface TableResponse {
  id: string;
  tableNumber: string;
  seatSize: number;
  occupied: boolean;
  activeOrders: OrderResponse[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

