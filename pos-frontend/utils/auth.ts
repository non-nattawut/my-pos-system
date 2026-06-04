import { cookies } from 'next/headers';
import { redirect, unstable_rethrow } from 'next/navigation';
import { AUTH_COOKIE_KEY } from '@/constants';
import type { AuthUser } from '@/types';

/**
 * Server-side helper to verify user authentication from cookies.
 * Redirects to the homepage if unauthorized.
 */
export async function verifyAuth(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_KEY);
  if (!authCookie) {
    redirect('/');
  }

  try {
    const authUser: AuthUser = JSON.parse(decodeURIComponent(authCookie.value));
    if (!authUser || !authUser.token) {
      redirect('/');
    }

    // Inspect JWT expiration claim
    const tokenParts = authUser.token.split('.');
    if (tokenParts.length === 3) {
      try {
        const payloadDecoded = Buffer.from(tokenParts[1], 'base64').toString('ascii');
        const payload = JSON.parse(payloadDecoded);
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          redirect('/');
        }
      } catch (e) {
        redirect('/');
      }
    }

    return authUser;
  } catch (error) {
    unstable_rethrow(error);
    redirect('/');
  }
}
