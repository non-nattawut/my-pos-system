'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, AuthUser } from '@/types';
import { fetchProducts, bulkUpdateProductStock, deleteProduct, restoreProduct } from '@/services/api-products';
import { CATEGORY_ALL } from '@/constants';
import { StockHeader } from './header/StockHeader';
import { StockFilter } from './filter/StockFilter';
import { StockTable } from './table/StockTable';
import { DeleteProductConfirmModal } from '@/components/ui/modal/DeleteProductConfirmModal';
import { ValuationModal } from './valuation/ValuationModal';

interface StockClientProps {
  products: Product[];
  categories?: string[];
  authUser?: AuthUser;
}

export function StockClient({ products: initialProducts = [], categories = [] , authUser }: StockClientProps) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);

  // Pending stock changes
  const [pendingStockUpdates, setPendingStockUpdates] = useState<Record<string, number>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValuationModal, setShowValuationModal] = useState(false);

  // Filter state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);

  const isAdmin = authUser?.role === 'ADMIN';

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(initialProducts.length);
  const [isLoading, setIsLoading] = useState(false);

  // Load products from API
  const loadProducts = useCallback(async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const response = await fetchProducts({
        page: pageToLoad,
        size: pageSize,
        name: searchQuery.trim() || undefined,
        category: selectedCategory === CATEGORY_ALL ? undefined : selectedCategory,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minStock: minStock ? parseInt(minStock, 10) : undefined,
        maxStock: maxStock ? parseInt(maxStock, 10) : undefined,
        deleted: showDeleted,
      });
      if (response?.success && response.data) {
        setProductsList(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.pageNumber);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, searchQuery, selectedCategory, minPrice, maxPrice, minStock, maxStock, showDeleted]);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, selectedCategory, pageSize, showDeleted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadProducts(0)
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinStock('');
    setMaxStock('');
    setSearchQuery('');
    setSelectedCategory(CATEGORY_ALL);
    setCurrentPage(0);
  };

  const handleStockUpdate = (productId: string, quantity: number) => {
    const originalProd =
      productsList.find(p => p.id === productId) || initialProducts.find(p => p.id === productId);
    if (!originalProd) return;

    setPendingStockUpdates(prev => {
      const next = { ...prev };
      if (originalProd.stockQuantity === quantity) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const handleBulkSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(pendingStockUpdates).map(([productId, stockQuantity]) => ({
        productId,
        stockQuantity,
      }));
      const response = await bulkUpdateProductStock({ updates });
      if (response?.success) {
        setPendingStockUpdates({});
        setShowConfirmModal(false);
        loadProducts(currentPage);
      }
    } catch (error) {
      console.error('Failed to perform bulk stock update:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProductClick = (id: string) => {
    const prod = productsList.find(p => p.id === id);
    if (prod) {
      setProductToDelete(prod);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteProduct(productToDelete.id);
      if (res.success) {
        // Clear any pending updates for this product
        setPendingStockUpdates(prev => {
          const next = { ...prev };
          delete next[productToDelete.id];
          return next;
        });
        setProductToDelete(null);
        loadProducts(currentPage);
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreProduct = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await restoreProduct(id);
      if (res.success) {
        loadProducts(currentPage);
      }
    } catch (err) {
      console.error('Failed to restore product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none">
      {/* Title bar, stats, changes bar, confirm modal */}
      <StockHeader
        totalItems={totalElements}
        lowStockCount={productsList.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold !== undefined ? p.lowStockThreshold : 5)).length}
        outOfStockCount={productsList.filter(p => p.stockQuantity === 0).length}
        pendingCount={Object.keys(pendingStockUpdates).length}
        onDiscard={() => setPendingStockUpdates({})}
        onSaveClick={() => setShowConfirmModal(true)}
        showConfirmModal={showConfirmModal}
        pendingStockUpdates={pendingStockUpdates}
        productsList={productsList}
        initialProducts={initialProducts}
        onCloseModal={() => setShowConfirmModal(false)}
        onConfirmSave={handleBulkSave}
        isSaving={isSaving}
        showDeleted={showDeleted}
        setShowDeleted={(v) => {
          setShowDeleted(v);
          setCurrentPage(0);
        }}
        isAdmin={isAdmin}
        onOpenValuation={() => setShowValuationModal(true)}
      />

      {/* Filter inputs + category pill bar */}
      <StockFilter
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
        onApplyFilters={handleSearchSubmit}
        onResetFilters={handleClearFilters}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setCurrentPage(0);
        }}
        categories={categories}
      />

      {/* Products table */}
      <StockTable
        productsList={productsList}
        pendingStockUpdates={pendingStockUpdates}
        onStockUpdate={handleStockUpdate}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        showDeleted={showDeleted}
        onDeleteProduct={handleDeleteProductClick}
        onRestoreProduct={handleRestoreProduct}
      />

      {/* Delete product confirmation modal */}
      <DeleteProductConfirmModal
        isOpen={!!productToDelete}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        isLoading={isDeleting}
      />

      {/* Stock valuation report modal */}
      <ValuationModal
        isOpen={showValuationModal}
        onClose={() => setShowValuationModal(false)}
      />
    </div>
  );
}
