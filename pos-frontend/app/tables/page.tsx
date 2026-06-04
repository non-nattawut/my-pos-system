import React from 'react';
import TablesClient from '@/components/tables/TablesClient';
import { fetchTables } from '@/services/api-tables';
import { fetchProducts } from '@/services/api-products';
import { verifyAuth } from '../../utils/auth';

import { TableResponse, Product } from '@/types';

export default async function TablesPage() {
  const authUser = await verifyAuth();

  let initialTables: TableResponse[] = [];
  let products: Product[] = [];
  try {
    const [tablesRes, productsRes] = await Promise.all([
      fetchTables(),
      fetchProducts({ size: 1000 }),
    ]);
    if (tablesRes?.success) {
      initialTables = tablesRes.data;
    }
    if (productsRes?.success && productsRes.data) {
      products = productsRes.data.content;
    }
  } catch (error) {
    console.error('Failed to fetch data for Tables page:', error);
  }

  return <TablesClient authUser={authUser} initialTables={initialTables} products={products} />;
}

