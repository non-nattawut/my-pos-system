import React from 'react';
import { verifyAdmin } from '@/utils/auth';
import VouchersClient from './VouchersClient';
import { fetchVouchers, type Voucher } from '@/services/api-vouchers';

export default async function VouchersPage() {
  const authUser = await verifyAdmin();

  let vouchers: Voucher[] = [];
  try {
    const res = await fetchVouchers();
    if (res.success && res.data) {
      vouchers = res.data;
    }
  } catch (err) {
    console.error('Failed to load vouchers:', err);
  }

  return <VouchersClient initialVouchers={vouchers} />;
}
