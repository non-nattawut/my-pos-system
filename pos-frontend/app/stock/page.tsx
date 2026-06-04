import React from 'react';
import { StockClient } from '@/components/stock/StockClient';
import { fetchProducts, fetchCategories } from '@/services/api-products';

export const metadata = {
  title: 'NekoBite POS 🐾 | Stock Manager',
  description: 'Manage Akihabara maid bistro food, drinks, and merchandise stock levels.',
};

import { Product } from '@/types';
import { verifyAuth } from '../../utils/auth';

import { isFulfilledSuccess } from '@/utils/promise';

export default async function StockPage() {
  const authUser = await verifyAuth();

  let products: Product[] = [];
  let categories: string[] = [];
  
  try {
    const [prodRes, catRes] = await Promise.allSettled([
      fetchProducts({ page: 0, size: 10 }),
      fetchCategories()
    ]);

    console.log('Products:', prodRes);

    if (isFulfilledSuccess(prodRes)) {
      products = prodRes.value.data.content;
    }
    if (isFulfilledSuccess(catRes)) {
      categories = catRes.value.data;
    }
  } catch (error) {
    console.error('Failed to fetch products for stock page:', error);
  }

  return <StockClient products={products} categories={categories} authUser={authUser} />;
}
