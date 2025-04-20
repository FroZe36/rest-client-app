import {
  AuthError,
  AuthResponse,
  Session,
  SignInWithPasswordCredentials,
  SupabaseClient,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { render } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SessionChecker from '@/utils/SessionChecker';
import { createClient } from '@/utils/supabase/client';

interface MockSupabaseClient {
  auth: {
    signInWithPassword: (
      params: SignInWithPasswordCredentials
    ) => Promise<AuthResponse>;
    getSession: () => Promise<{
      data: { session: Session | null };
      error: AuthError | null;
    }>;
    getUser: () => Promise<{
      data: { user: SupabaseUser | null };
      error: AuthError | null;
    }>;
    signOut: () => Promise<{ error: AuthError | null }>;
  };
}

vi.mock('@/utils/supabase/client');

const mockedUseRouter = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => mockedUseRouter(),
}));

describe('SessionChecker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should sign out and redirect when session expires', async () => {
    const routerMock = {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    };
    mockedUseRouter.mockReturnValue(routerMock);

    const mockSupabase: MockSupabaseClient = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: { access_token: 'token' } },
          error: null,
        }),
        getSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: 'token' } },
          error: null,
        }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    const mockedCreateClient = vi.mocked(createClient);
    mockedCreateClient.mockReturnValue(mockSupabase as SupabaseClient);
    const expiresAt = Math.floor(Date.now() / 1000) - 1;
    localStorage.setItem('session_expires_at', String(expiresAt));
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');

    render(
      <MemoryRouterProvider>
        <SessionChecker />
      </MemoryRouterProvider>
    );

    vi.advanceTimersByTime(3100);
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });
});
