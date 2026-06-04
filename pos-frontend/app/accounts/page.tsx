import React from 'react';
import { verifyAuth } from '../../utils/auth';
import { redirect } from 'next/navigation';
import AccountsClient from './AccountsClient';
import { fetchUsers } from '@/services/api-users';
import type { AuthUser } from '@/types';

export default async function AccountsPage() {
  const authUser = await verifyAuth();
  if (authUser.role !== 'ADMIN') {
    redirect('/');
  }

  let users: AuthUser[] = [];
  try {
    const res = await fetchUsers();
    if (res.success && res.data) {
      users = res.data;
    }
  } catch (err) {
    console.error('Failed to load users:', err);
  }

  return <AccountsClient initialUsers={users} authUser={authUser} />;
}
