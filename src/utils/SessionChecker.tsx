'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { createClient } from '@/utils/supabase/client';

const SessionChecker = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const expiresAt = Number(localStorage.getItem('session_expires_at'));
      const now = Math.floor(Date.now() / 1000);

      if (expiresAt && now >= expiresAt) {
        await supabase.auth.signOut();
        localStorage.removeItem('session_expires_at');
        router.push(DASHBOARD_PAGES.ROOT);
      }
    };

    const interval = setInterval(checkSession, 3000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
};

export default SessionChecker;
