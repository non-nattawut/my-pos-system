'use client';

import React, { useState, useMemo } from 'react';
import { Utensils, Plus, Settings, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReceiptModal } from '@/components/ui/modal/ReceiptModal';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import TableCard from '@/components/tables/TableCard';
import TableDetailsDrawer from '@/components/tables/TableDetailsDrawer';
import TableConfigPanel from '@/components/tables/TableConfigPanel';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { OrderResponse, OrderItemDbResponse, Product, TableResponse, AuthUser, ReceiptResponse } from '@/types';
import { payTable } from '@/services/api-orders';
import { fetchTables, createTable, deleteTable } from '@/services/api-tables';

interface TablesClientProps {
  authUser: AuthUser;
  initialTables: TableResponse[];
  products: Product[];
}

export default function TablesClient({ authUser, initialTables = [], products = [] }: Readonly<TablesClientProps>) {
  const [tablesList, setTablesList] = useState<TableResponse[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptForReceiptModal, setReceiptForReceiptModal] = useState<ReceiptResponse | null>(null);
  
  // Admin Mode Controls
  const [showConfig, setShowConfig] = useState(false);

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  const isAdmin = authUser?.role === 'ADMIN';

  const handlePayTable = async (tableNum: string, voucherCode?: string) => {
    const tableObj = tablesList.find(t => t.tableNumber === tableNum);
    if (tableObj?.activeOrders) {
      const hasUncompletedOrders = tableObj.activeOrders.some(order => order.status !== 'COMPLETED');
      if (hasUncompletedOrders) {
        showError("Cannot checkout! There are still active orders that are not completed (PENDING, PREPARING, or READY), nya~!");
        return;
      }
    }

    try {
      const resPay = await payTable(tableNum, voucherCode);
      if (resPay.success && resPay.data) {
        setReceiptForReceiptModal(resPay.data);
        setIsReceiptOpen(true);
      }

      // Reload current table status from server
      const res = await fetchTables();
      if (res.success) {
        setTablesList(res.data);
      }
      setSelectedTable(null);
    } catch (err: any) {
      console.error('Failed to pay for table:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to pay for table';
      showError(errMsg);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      const res = await deleteTable(tableId);
      if (res.success) {
        const tablesRes = await fetchTables();
        if (tablesRes.success) {
          setTablesList(tablesRes.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to delete table:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete table';
      showError(errMsg);
    }
  };

  const selectedTableObj = useMemo(() => {
    return tablesList.find(t => t.tableNumber === selectedTable) || null;
  }, [tablesList, selectedTable]);

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none font-mono">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Utensils className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Maid Cafe Table Dispatcher</h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => {
                setShowConfig(!showConfig);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                showConfig
                  ? 'bg-theme-tab-active border-theme-tab-active-border text-theme-tab-active-text'
                  : 'border-theme-border bg-theme-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Settings size={12} />
              <span>Configure Tables</span>
            </button>
          )}
        </div>
      </header>

      {/* Admin table configuration panel */}
      {isAdmin && (
        <TableConfigPanel
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
          tablesList={tablesList}
          onSaveSuccess={(updated) => setTablesList(updated)}
          showError={showError}
        />
      )}

      {/* Grid of Tables */}
      <ScrollArea className="flex-1 min-h-0 px-6 pb-6 pt-4" trackTransparent>
        {tablesList.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl animate-bounce">🪑</span>
            <h4 className="font-bold text-zinc-500 mt-4 text-xs">No tables configured in the cafe, nya~</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {tablesList.map(table => (
              <TableCard
                key={table.id}
                table={table}
                isAdmin={isAdmin}
                onClick={() => {
                  setSelectedTable(table.tableNumber);
                }}
                onDelete={() => handleDeleteTable(table.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Details Side-Drawer/Modal */}
      {selectedTable && selectedTableObj && (
        <TableDetailsDrawer
          table={selectedTableObj}
          onClose={() => setSelectedTable(null)}
          onPay={(voucherCode?: string) => handlePayTable(selectedTable, voucherCode)}
          products={products}
        />
      )}

      {/* Shared Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receiptForReceiptModal}
        onClose={() => {
          setIsReceiptOpen(false);
          setReceiptForReceiptModal(null);
        }}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        message={errorModalMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </div>
  );
}
