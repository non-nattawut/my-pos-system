// Storage and Cookie Keys
export const AUTH_COOKIE_KEY = 'nekobite_auth';
export const AUTH_TOKEN_KEY = 'nekobite_token';
export const AUTH_ROLE_KEY = 'nekobite_role';
export const AUTH_MAID_KEY = 'nekobite_maid';
export const AUTH_MAID_EMAIL_KEY = 'nekobite_maid_email';

// Product Category Constants
export const CATEGORY_ALL = 'ALL';
export const CATEGORY_MAINS = 'MAINS';
export const CATEGORY_DRINKS = 'DRINKS';
export const CATEGORY_DESSERTS = 'DESSERTS';
export const CATEGORY_MERCH = 'MERCH';

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  QR: 'QR',
} as const;

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
} as const;

// Service Types
export const SERVICE_TYPES = {
  DINE_IN: 'DINE_IN',
  TAKEAWAY: 'TAKEAWAY',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MAID: 'MAID',
  CHEF: 'CHEF',
} as const;
