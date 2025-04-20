'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { useUser } from '@/hooks/useUser';

const AuthRedirectHandler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = new URLSearchParams(window.location.search).get('code');
      if (!code) return;
      if (!loading && user) {
        router.replace(DASHBOARD_PAGES.HOME);
      }
    }
  }, [loading, user, router, pathname]);

  return null;
};

export default AuthRedirectHandler;
