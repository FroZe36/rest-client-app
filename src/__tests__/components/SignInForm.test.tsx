import {
  AuthError,
  AuthResponse,
  Session,
  SignInWithPasswordCredentials,
  SupabaseClient,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { createClient } from '@/utils/supabase/client';

import { server } from '@/__tests__/mocks/server';
import SignInPage from '@/app/[locale]/auth/signin/page';

vi.mock('@/utils/supabase/client');

const mockedUseRouter = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => mockedUseRouter(),
}));

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

describe('SignInForm', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
    vi.clearAllMocks();
    mockedUseRouter.mockReset();
    vi.unstubAllEnvs();
  });

  it('should successfully sign in', async () => {
    const routerMock: AppRouterInstance = {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
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

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <SignInPage />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Main.signIn' }));

    await new Promise((resolve) => setTimeout(resolve, 500));
    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(DASHBOARD_PAGES.HOME);
    });
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Qwe!23qwe',
    });
    expect(mockedCreateClient).toHaveBeenCalled();
  });

  it('should display error message on sign in failure', async () => {
    const mockSupabase: MockSupabaseClient = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'invalid credentials' },
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

    const routerMock: AppRouterInstance = {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    };
    mockedUseRouter.mockReturnValue(routerMock);

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');

    const locale = 'en';

    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <SignInPage />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'invalid_password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Main.signIn' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('invalid credentials')).toBeInTheDocument();
    });
  });
});
