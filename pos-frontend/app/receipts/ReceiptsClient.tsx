'use client';

import React, { useState } from 'react';
import { Receipt as ReceiptIcon, Printer } from 'lucide-react';
import { ReceiptResponse, Product, AuthUser } from '@/types';
import { ReceiptModal } from '@/components/ui/modal/ReceiptModal';
import { useRouter } from 'next/navigation';
import { VaultFilterPanel } from '@/components/vault/VaultFilterPanel';
import { VaultTable } from '@/components/vault/VaultTable';

interface ReceiptsClientProps {
  initialReceipts: ReceiptResponse[];
  products: Product[];
  maids?: AuthUser[];
  currentFilters?: {
    maidName: string;
    receiptNumber: string;
    startDate: string;
    endDate: string;
  };
}

export function ReceiptsClient({
  initialReceipts = [],
  products = [],
  maids = [],
  currentFilters = { maidName: '', receiptNumber: '', startDate: '', endDate: '' }
}: Readonly<ReceiptsClientProps>) {
  const router = useRouter();

  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleApplyFilter = (filters: { maidName: string; receiptNumber: string; startDate: string; endDate: string }) => {
    const queryParts = [];
    if (filters.maidName) queryParts.push(`maidName=${encodeURIComponent(filters.maidName)}`);
    if (filters.receiptNumber) queryParts.push(`receiptNumber=${encodeURIComponent(filters.receiptNumber)}`);
    if (filters.startDate) queryParts.push(`startDate=${encodeURIComponent(filters.startDate)}`);
    if (filters.endDate) queryParts.push(`endDate=${encodeURIComponent(filters.endDate)}`);
    
    router.push(`/receipts${queryParts.length ? '?' + queryParts.join('&') : ''}`);
  };

  const handleClearFilter = () => {
    router.push('/receipts');
  };

  const handleOpenReceipt = (receipt: ReceiptResponse) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <ReceiptIcon className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Receipt Vault</h1>
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
        items={initialReceipts}
        products={products}
        emptyMessage="Receipt Vault is empty"
        emptySubMessage="Complete a check-out / sale to generate receipts here!"
        emptyIcon="🎟"
        getItems={(receipt) => (receipt.orders || []).flatMap(o => o.items || [])}
        onActionClick={handleOpenReceipt}
        actionLabel="Receipt"
        actionIcon={<Printer size={13} />}
      />

      {/* MODAL: THERMAL RECEIPT DRAWER */}
      <ReceiptModal
        isOpen={showReceiptModal}
        receipt={selectedReceipt}
        onClose={() => {
          setShowReceiptModal(false);
          setSelectedReceipt(null);
        }}
      />
    </div>
  );
}
