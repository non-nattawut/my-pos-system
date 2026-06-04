import React from 'react';
import { fetchProductById, fetchCategories } from '@/services/api-products';
import { ProductDetailClient } from '@/components/stock/detail/ProductDetailClient';
import { verifyAuth } from '../../../utils/auth';
import { Product } from '@/types';
import { notFound, unstable_rethrow } from 'next/navigation';

export const metadata = {
  title: 'NekoBite POS 🐾 | Product Catalog details',
  description: 'View or edit product information in NekoBite Bistro POS.',
};

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const authUser = await verifyAuth();

  const isNew = id === 'new';
  let product: Product | null = null;
  let categories: string[] = [];

  try {
    const catRes = await fetchCategories();
    if (catRes?.success && catRes.data) {
      categories = catRes.data;
    }

    if (!isNew) {
      const prodRes = await fetchProductById(id);
      if (prodRes?.success && prodRes.data) {
        product = prodRes.data;
      } else {
        notFound();
      }
    }
  } catch (error) {
    unstable_rethrow(error);
    console.error('Failed to load product page data:', error);
    if (!isNew) {
      notFound();
    }
  }

  return (
    <ProductDetailClient 
      product={product} 
      isNew={isNew} 
      categories={categories} 
    />
  );
}
