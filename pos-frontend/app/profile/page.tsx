import React from 'react';
import { verifyAuth } from '../../utils/auth';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const authUser = await verifyAuth();
  return <ProfileClient authUser={authUser} />;
}
