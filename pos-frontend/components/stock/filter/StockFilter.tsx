import React from 'react';
import { StockFilters } from './StockFilters';
import { CategoryBar } from '@/components/ui/CategoryBar';

interface StockFilterProps {
  // Search & range inputs
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  minStock: string;
  setMinStock: (v: string) => void;
  maxStock: string;
  setMaxStock: (v: string) => void;
  onApplyFilters: (e: React.FormEvent) => void;
  onResetFilters: () => void;

  // Category selector
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

/** Accumulator that composes the filter inputs panel and the category pill bar. */
export function StockFilter({
  searchQuery, setSearchQuery,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  minStock, setMinStock,
  maxStock, setMaxStock,
  onApplyFilters, onResetFilters,
  selectedCategory, onSelectCategory,
  categories,
}: Readonly<StockFilterProps>) {
  return (
    <>
      <StockFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minStock={minStock}
        setMinStock={setMinStock}
        maxStock={maxStock}
        setMaxStock={setMaxStock}
        onApply={onApplyFilters}
        onReset={onResetFilters}
      />
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        categories={categories}
        mode="stock"
      />
    </>
  );
}
