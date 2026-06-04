import React from 'react';
import { Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { StockTableHeader } from './StockTableHeader';
import { StockTableRow } from './StockTableRow';
import { StockTablePagination } from './StockTablePagination';

interface StockTableProps {
  productsList: Product[];
  pendingStockUpdates: Record<string, number>;
  onStockUpdate: (productId: string, quantity: number) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  setPageSize: (v: number) => void;
  setCurrentPage: (v: number) => void;
  isAdmin?: boolean;
  showDeleted?: boolean;
  onDeleteProduct?: (id: string) => void;
  onRestoreProduct?: (id: string) => void;
}

export function StockTable({
  productsList,
  pendingStockUpdates,
  onStockUpdate,
  isLoading,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  setPageSize,
  setCurrentPage,
  isAdmin,
  showDeleted,
  onDeleteProduct,
  onRestoreProduct,
}: StockTableProps) {
  return (
    <div className="px-6 pb-6 flex-1 min-h-0 relative flex flex-col">
      <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-xl relative flex flex-col flex-1 min-h-0">
        
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px] flex items-center justify-center z-20">
            <Loader2 className="animate-spin text-theme-accent" size={32} />
          </div>
        )}

        {productsList.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <span className="text-4xl animate-float">😿</span>
            <h4 className="font-bold text-zinc-400 mt-3 text-xs">No products matched query</h4>
          </div>
        ) : (
          /* Scrollable table container — flex-1 pushes pagination to the bottom */
          <ScrollArea className="flex-1 min-h-0">
            <table className="min-w-full divide-y divide-zinc-800/50">
              <StockTableHeader isAdmin={isAdmin} showDeleted={showDeleted} />
              <tbody className="divide-y divide-zinc-800/40">
                {productsList.map(product => (
                  <StockTableRow
                    key={product.id}
                    product={product}
                    pendingQty={pendingStockUpdates[product.id]}
                    onStockUpdate={onStockUpdate}
                    isAdmin={isAdmin}
                    showDeleted={showDeleted}
                    onDelete={onDeleteProduct}
                    onRestore={onRestoreProduct}
                  />
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}

        {/* Pagination Footer Controls */}
        <StockTablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          isLoading={isLoading}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </div>
  );
}
