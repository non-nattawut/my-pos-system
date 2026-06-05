import React from 'react';
import { ReceiptsClient } from '@/app/receipts/ReceiptsClient';
import { fetchReceipts, ReceiptFilterParams } from '@/services/api-receipts';
import { fetchProducts } from '@/services/api-products';
import { fetchMaids } from '@/services/api-auth';
import { verifyAuth } from '../../utils/auth';
import { ReceiptResponse, Product, AuthUser } from '@/types';

interface PageProps {
  searchParams: Promise<{
    maidName?: string;
    receiptNumber?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function ReceiptsPage({ searchParams }: PageProps) {
  await verifyAuth();
  const params = await searchParams;

  let initialReceipts: ReceiptResponse[] = [];
  let products: Product[] = [];
  let maidsList: AuthUser[] = [];

  const filterParams: ReceiptFilterParams = {};
  if (params.maidName) filterParams.maidName = params.maidName;
  if (params.receiptNumber) filterParams.receiptNumber = params.receiptNumber;
  if (params.startDate) filterParams.startDate = `${params.startDate}T00:00:00`;
  if (params.endDate) filterParams.endDate = `${params.endDate}T23:59:59`;

  try {
    const [receiptsRes, productsRes, maidsRes] = await Promise.all([
      fetchReceipts(filterParams),
      fetchProducts({ size: 1000 }),
      fetchMaids()
    ]);
    
    if (receiptsRes?.success) {
      initialReceipts = receiptsRes.data;
    }
    if (productsRes?.success && productsRes.data) {
      products = productsRes.data.content;
    }
    if (maidsRes?.success && maidsRes.data) {
      maidsList = maidsRes.data;
    }
  } catch (error) {
    console.error('Failed to fetch data for Receipts page:', error);
  }

  return (
    <ReceiptsClient 
      initialReceipts={initialReceipts} 
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
