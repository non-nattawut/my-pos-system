'use client';

import React from 'react';
import { History } from 'lucide-react';
import { OrderResponse, Product, AuthUser } from '@/types';
import { useRouter } from 'next/navigation';
import { VaultFilterPanel } from '@/components/vault/VaultFilterPanel';
import { VaultTable } from '@/components/vault/VaultTable';

interface HistoryClientProps {
  initialOrders: OrderResponse[];
  products: Product[];
  maids?: AuthUser[];
  currentFilters?: {
    maidName: string;
    receiptNumber: string;
    startDate: string;
    endDate: string;
  };
}

export function HistoryClient({
  initialOrders = [],
  products = [],
  maids = [],
  currentFilters = { maidName: '', receiptNumber: '', startDate: '', endDate: '' }
}: Readonly<HistoryClientProps>) {
  const router = useRouter();

  const handleApplyFilter = (filters: { maidName: string; receiptNumber: string; startDate: string; endDate: string }) => {
    const queryParts = [];
    if (filters.maidName) queryParts.push(`maidName=${encodeURIComponent(filters.maidName)}`);
    if (filters.receiptNumber) queryParts.push(`receiptNumber=${encodeURIComponent(filters.receiptNumber)}`);
    if (filters.startDate) queryParts.push(`startDate=${encodeURIComponent(filters.startDate)}`);
    if (filters.endDate) queryParts.push(`endDate=${encodeURIComponent(filters.endDate)}`);
    
    router.push(`/history${queryParts.length ? '?' + queryParts.join('&') : ''}`);
  };

  const handleClearFilter = () => {
    router.push('/history');
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <History className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Cafe Order Vault</h1>
        </div>
      </header>

      {/* Spacing adjustments */}
      <div className="pt-4"></div>

      {/* Filter panel */}
      <div className="px-6 mb-4">
        <VaultFilterPanel
          maids={maids}
          initialFilters={currentFilters}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
        />
      </div>

      <VaultTable
        items={initialOrders}
        products={products}
        emptyMessage="Order Vault is empty"
        emptySubMessage="Complete a checkout in the POS Menu to view receipts here!"
        emptyIcon="🔮"
        getItems={(order) => order.items || []}
      />
    </div>
  );
}
