import React from 'react';
import { HistoryClient } from '@/app/history/HistoryClient';
import { fetchOrders, OrderFilterParams } from '@/services/api-orders';
import { fetchProducts } from '@/services/api-products';
import { fetchMaids } from '@/services/api-auth';
import { verifyAuth } from '../../utils/auth';
import { OrderResponse, Product, AuthUser } from '@/types';

interface PageProps {
  searchParams: Promise<{
    maidName?: string;
    receiptNumber?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: PageProps) {
  await verifyAuth();
  const params = await searchParams;

  let initialOrders: OrderResponse[] = [];
  let products: Product[] = [];
  let maidsList: AuthUser[] = [];

  const filterParams: OrderFilterParams = {};
  if (params.maidName) filterParams.maidName = params.maidName;
  if (params.receiptNumber) filterParams.receiptNumber = params.receiptNumber;
  if (params.startDate) filterParams.startDate = `${params.startDate}T00:00:00`;
  if (params.endDate) filterParams.endDate = `${params.endDate}T23:59:59`;

  try {
    const [ordersRes, productsRes, maidsRes] = await Promise.all([
      fetchOrders(filterParams),
      fetchProducts({ size: 1000 }),
      fetchMaids()
    ]);
    
    if (ordersRes?.success) {
      initialOrders = ordersRes.data;
    }
    if (productsRes?.success && productsRes.data) {
      products = productsRes.data.content;
    }
    if (maidsRes?.success && maidsRes.data) {
      maidsList = maidsRes.data;
    }
  } catch (error) {
    console.error('Failed to fetch data for History page:', error);
  }

  return (
    <HistoryClient 
      initialOrders={initialOrders} 
      products={products} 
      maids={maidsList}
      currentFilters={{
        maidName: params.maidName || '',
        receiptNumber: params.receiptNumber || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
      }}
    />
  );
}
