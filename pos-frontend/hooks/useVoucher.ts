import { useState, useEffect } from 'react';
import { fetchVoucherByCode, Voucher } from '@/services/api-vouchers';

interface UseVoucherOptions {
  isOpen?: boolean;
  serviceType?: string;
  onError?: (message: string) => void;
}

export function useVoucher(options?: UseVoucherOptions) {
  const { isOpen, serviceType, onError } = options || {};
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Reset voucher on close
  useEffect(() => {
    if (isOpen !== undefined && !isOpen) {
      setAppliedVoucher(null);
      setVoucherCodeInput('');
    }
  }, [isOpen]);

  // Reset voucher on service type change
  useEffect(() => {
    if (serviceType !== undefined) {
      setAppliedVoucher(null);
      setVoucherCodeInput('');
    }
  }, [serviceType]);

  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) {
      onError?.('Enter code, nya!');
      return;
    }
    setIsApplying(true);
    try {
      const res = await fetchVoucherByCode(voucherCodeInput.trim().toUpperCase());
      if (res.success && res.data) {
        setAppliedVoucher(res.data);
        setVoucherCodeInput('');
      } else {
        onError?.(res.message || 'voucher not found or out of used');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'voucher not found or out of used';
      onError?.(errMsg);
    } finally {
      setIsApplying(false);
    }
  };

  return {
    voucherCodeInput,
    setVoucherCodeInput,
    appliedVoucher,
    setAppliedVoucher,
    isApplying,
    handleApplyVoucher,
  };
}
