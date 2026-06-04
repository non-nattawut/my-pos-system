'use client';

import React, { useState, useMemo } from 'react';
import { Utensils, Receipt, Plus, Settings, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReceiptModal } from '@/components/ui/modal/ReceiptModal';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import TableCard from '@/components/tables/TableCard';
import TableDetailsDrawer from '@/components/tables/TableDetailsDrawer';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { OrderResponse, OrderItemDbResponse, Product, TableResponse, AuthUser } from '@/types';
import { payTable } from '@/services/api-orders';
import { fetchTables, createTable, deleteTable } from '@/services/api-tables';

interface TablesClientProps {
  authUser: AuthUser;
  initialTables: TableResponse[];
  products: Product[];
}

export default function TablesClient({ authUser, initialTables = [], products = [] }: TablesClientProps) {
  const router = useRouter();
  const [tablesList, setTablesList] = useState<TableResponse[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [accumulatedOrderForReceipt, setAccumulatedOrderForReceipt] = useState<OrderResponse | null>(null);
  
  // Admin Mode Controls
  const [showConfig, setShowConfig] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');
  const [newSeatSize, setNewSeatSize] = useState('4');
  const [isCreating, setIsCreating] = useState(false);

  const isFormInvalid = !newTableNum.trim() || !newSeatSize.trim();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    showError,
  } = useErrorState();

  const isAdmin = authUser?.role === 'ADMIN';

  // Sort tables numerically
  const sortedTables = useMemo(() => {
    return [...tablesList].sort((a, b) => {
      const numA = parseInt(a.tableNumber, 10);
      const numB = parseInt(b.tableNumber, 10);
      if (isNaN(numA) || isNaN(numB)) {
        return a.tableNumber.localeCompare(b.tableNumber);
      }
      return numA - numB;
    });
  }, [tablesList]);

  // Helper to accumulate orders for a table into a single virtual order
  const getAccumulatedOrder = (tableNum: string): OrderResponse | null => {
    const tableObj = tablesList.find(t => t.tableNumber === tableNum);
    const orders = tableObj?.activeOrders || [];
    if (orders.length === 0) return null;

    // Accumulate items
    const itemMap: Record<string, OrderItemDbResponse> = {};
    let subtotal = 0;
    let tax = 0;
    let serviceCharge = 0;
    let discount = 0;
    let total = 0;

    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.product?.id || '';
        if (!key) return;
        if (itemMap[key]) {
          itemMap[key].quantity = (itemMap[key].quantity || 0) + (item.quantity || 0);
        } else {
          itemMap[key] = { ...item };
        }
      });
      subtotal += order.subtotal;
      tax += order.tax;
      serviceCharge += order.serviceCharge;
      discount += order.discount;
      total += order.total;
    });

    return {
      id: `accumulated-table-${tableNum}`,
      items: Object.values(itemMap),
      subtotal,
      tax,
      serviceCharge,
      discount,
      total,
      createdAt: new Date().toISOString(),
      paymentMethod: orders[0]?.paymentMethod || 'CASH',
      status: 'COMPLETED',
      receiptNumber: `TBL-${tableNum}-ACCUM`,
      maidName: orders[0]?.maidName || 'Maid Staff',
      serviceType: 'DINE_IN',
      tableNumber: tableNum,
    };
  };

  const handleOpenReceipt = (tableNum: string) => {
    const accOrder = getAccumulatedOrder(tableNum);
    if (accOrder) {
      setAccumulatedOrderForReceipt(accOrder);
      setIsReceiptOpen(true);
    }
  };

  const handlePayTable = async (tableNum: string, voucherCode?: string) => {
    const tableObj = tablesList.find(t => t.tableNumber === tableNum);
    if (tableObj && tableObj.activeOrders) {
      const hasUncompletedOrders = tableObj.activeOrders.some(order => order.status !== 'COMPLETED');
      if (hasUncompletedOrders) {
        showError("Cannot checkout! There are still active orders that are not completed (PENDING, PREPARING, or READY), nya~!");
        return;
      }
    }

    try {
      const resPay = await payTable(tableNum, voucherCode);
      if (resPay.success && resPay.data) {
        // Construct a virtual accumulated Order from Receipt details for legacy ReceiptModal
        const receipt = resPay.data;
        const virtualOrder: OrderResponse = {
          id: receipt.id,
          receiptNumber: receipt.receiptNumber,
          items: (receipt.orders || []).flatMap(o => o.items || []),
          subtotal: receipt.subtotal,
          tax: receipt.tax,
          serviceCharge: receipt.serviceCharge,
          discount: receipt.discount,
          total: receipt.total,
          paymentMethod: receipt.paymentMethod,
          status: 'COMPLETED',
          maidName: receipt.maidName,
          serviceType: receipt.serviceType,
          tableNumber: receipt.tableNumber || null,
          createdAt: receipt.createdAt,
        };
        setAccumulatedOrderForReceipt(virtualOrder);
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

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedNum = newTableNum.trim();
    if (!trimmedNum) {
      setErrorMessage('Enter a table number, nya!');
      return;
    }

    const seats = parseInt(newSeatSize, 10);
    if (isNaN(seats) || seats <= 0) {
      setErrorMessage('Seats must be a positive number!');
      return;
    }

    // Check if table already exists
    if (tablesList.some(t => t.tableNumber.toLowerCase() === trimmedNum.toLowerCase())) {
      setErrorMessage(`Table ${trimmedNum} already exists!`);
      return;
    }

    setIsCreating(true);
    try {
      const res = await createTable({ tableNumber: trimmedNum, seatSize: seats });
      if (res.success) {
        // reload list
        const tablesRes = await fetchTables();
        if (tablesRes.success) {
          setTablesList(tablesRes.data);
        }
        setNewTableNum('');
        setNewSeatSize('4');
        setShowConfig(false);
      } else {
        setErrorMessage(res.message || 'Failed to create table');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to add table configuration.';
      setErrorMessage(errMsg);
      showError(errMsg);
    } finally {
      setIsCreating(false);
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
                setErrorMessage('');
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
      {isAdmin && showConfig && (
        <div className="p-4 rounded-3xl bg-zinc-950/80 border border-theme-border/60 shrink-0 flex flex-col gap-3 font-mono">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Configure Tables</span>
            <button
              onClick={() => setShowConfig(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X size={14} />
            </button>
          </div>

           <form onSubmit={handleAddTable} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Table Number <span className="text-pink-500 font-bold ml-0.5">*</span></span>
              <input
                type="text"
                value={newTableNum}
                onChange={e => setNewTableNum(e.target.value)}
                placeholder="e.g. 09"
                disabled={isCreating}
                className="bg-zinc-900 border border-zinc-855 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Seat Capacity <span className="text-pink-500 font-bold ml-0.5">*</span></span>
              <input
                type="number"
                min="1"
                value={newSeatSize}
                onChange={e => setNewSeatSize(e.target.value)}
                placeholder="4"
                disabled={isCreating}
                className="bg-zinc-900 border border-zinc-855 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating || isFormInvalid}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-theme-tab-active border border-theme-tab-active-border text-theme-tab-active-text text-xs font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {isCreating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              <span>Add Table</span>
            </button>
          </form>

          {errorMessage && (
            <div className="text-[9px] font-black text-rose-500 uppercase tracking-wider pl-1 pt-1">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Grid of Tables */}
      <ScrollArea className="flex-1 min-h-0 px-6 pb-6 pt-4" trackTransparent>
        {sortedTables.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl animate-bounce">🪑</span>
            <h4 className="font-bold text-zinc-500 mt-4 text-xs">No tables configured in the cafe, nya~</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {sortedTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                isAdmin={isAdmin}
                onClick={() => {
                  setSelectedTable(table.tableNumber);
                }}
                onPrintReceipt={() => handleOpenReceipt(table.tableNumber)}
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
          onPrintCombined={() => handleOpenReceipt(selectedTable)}
          onPay={(voucherCode?: string) => handlePayTable(selectedTable, voucherCode)}
          products={products}
        />
      )}

      {/* Shared Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        order={accumulatedOrderForReceipt}
        onClose={() => {
          setIsReceiptOpen(false);
          setAccumulatedOrderForReceipt(null);
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
