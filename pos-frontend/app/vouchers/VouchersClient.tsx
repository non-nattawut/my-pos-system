'use client';

import React, { useState } from 'react';
import { Ticket, Plus } from 'lucide-react';
import { Voucher, deleteVoucher, fetchVouchers } from '@/services/api-vouchers';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { VoucherModal } from '@/components/vouchers/VoucherModal';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { VoucherCard } from '@/components/vouchers/VoucherCard';

interface VouchersClientProps {
  initialVouchers: Voucher[];
}

export default function VouchersClient({ initialVouchers }: Readonly<VouchersClientProps>) {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [voucherIdToDelete, setVoucherIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  const openAddModal = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const reloadVouchers = async () => {
    try {
      const res = await fetchVouchers();
      if (res.success && res.data) {
        setVouchers(res.data);
      }
    } catch (err) {
      console.error('Failed to reload vouchers:', err);
    }
  };

  const confirmDelete = (id: string) => {
    setVoucherIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!voucherIdToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteVoucher(voucherIdToDelete);
      if (res.success) {
        await reloadVouchers();
        setIsDeleteConfirmOpen(false);
        setVoucherIdToDelete(null);
      } else {
        showError(res.message || 'Failed to delete voucher.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete voucher.';
      showError(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none font-mono">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Ticket className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Voucher Dispatcher</h1>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-black uppercase rounded-2xl cursor-pointer active:scale-95 transition-all shadow-md shadow-pink-900/10"
        >
          <Plus size={13} />
          <span>New Voucher</span>
        </button>
      </header>

      {/* Main Content Area */}
      <ScrollArea className="flex-1 min-h-0 px-6 pb-6 pt-4" trackTransparent>
        {vouchers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl animate-bounce">🎟️</span>
            <h4 className="font-bold text-zinc-500 mt-4 text-xs">No active vouchers found, nya~</h4>
            <p className="text-[10px] text-zinc-655 mt-1 max-w-[240px] uppercase">Create one to offer lovely discounts to cafe masters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {vouchers.map(v => (
              <VoucherCard
                key={v.id}
                voucher={v}
                onEdit={openEditModal}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Add / Edit Modal */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingVoucher={editingVoucher}
        onSaveSuccess={reloadVouchers}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setVoucherIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Voucher"
        subTitle="Security Authorization"
        message="Are you sure you want to delete this voucher, master? 🐾 This action is irreversible!"
        confirmText="Delete, nya!"
        cancelText="No, wait!"
        isDanger={true}
        isLoading={isDeleting}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        message={errorModalMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </div>
  );
}
