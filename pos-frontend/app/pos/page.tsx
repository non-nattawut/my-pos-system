import React from 'react';
import { PosClient } from '@/app/pos/PosClient';
import { fetchProducts, fetchCategories } from '@/services/api-products';
import { fetchTables } from '@/services/api-tables';
import { verifyAuth } from '../../utils/auth';
import { AuthUser, Product, TableResponse } from '@/types';

import { isFulfilledSuccess } from '@/utils/promise';

export default async function PosPage() {
  const authUser = await verifyAuth();

  let products: Product[] = [];
  let categories: string[] = [];
  let tables: TableResponse[] = [];
  
  try {
    const [prodRes, catRes, tablesRes] = await Promise.allSettled([
      fetchProducts({ size: 1000 }),
      fetchCategories(),
      fetchTables()
    ]);

    if (isFulfilledSuccess(prodRes)) {
      products = prodRes.value.data.content;
    }
    if (isFulfilledSuccess(catRes)) {
      categories = catRes.value.data;
    }
    if (isFulfilledSuccess(tablesRes)) {
      tables = tablesRes.value.data;
    }
  } catch (error) {
    console.error('Failed to fetch POS initial data on server:', error);
  }

  return <PosClient products={products} categories={categories} tables={tables} authUser={authUser} />;
}
