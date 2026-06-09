import React from 'react';
import { fetchProductById, fetchCategories } from '@/services/api-products';
import { ProductDetailClient } from '@/components/stock/detail/ProductDetailClient';
import { StockModalWrapper } from '@/components/stock/detail/StockModalWrapper';
import { verifyAuth } from '@/utils/auth';
import { Product } from '@/types';
import { notFound, unstable_rethrow } from 'next/navigation';

interface InterceptedProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterceptedProductDetailPage({ params }: Readonly<InterceptedProductDetailPageProps>) {
  const { id } = await params;
  await verifyAuth();

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
    console.error('Failed to load product page data in intercepted route:', error);
    if (!isNew) {
      notFound();
    }
  }

  return (
    <StockModalWrapper>
      <ProductDetailClient 
        product={product} 
        isNew={isNew} 
        categories={categories} 
        isModal={true}
      />
    </StockModalWrapper>
  );
}
