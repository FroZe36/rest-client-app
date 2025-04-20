import { User } from '@supabase/supabase-js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import React from 'react';
import { Toaster } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Dashboard from '@/components/Dashboard/Dashboard';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { useUser } from '@/hooks/useUser';

export interface IdentityData {
  first_name: string;
}

export interface Identity {
  identity_data: IdentityData;
  id: string;
  user_id: string;
  identity_id: string;
  provider: string;
}

vi.mock('@/hooks/useUser');

const mockedUseRouter = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => mockedUseRouter(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn((namespace) => {
    return (key: string) => {
      if (namespace === 'Main') {
        return key;
      }
      return `${namespace}.${key}`;
    };
  }),
  NextIntlClientProvider: ({
    children,
  }: {
    children: React.ReactNode;
    locale: string;
  }) => {
    return <>{children}</>;
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render greeting and user name', () => {
    const mockUser: Partial<User> = {
      identities: [
        {
          identity_data: {
            first_name: 'Test',
          },
        } as Identity,
      ],
    };
    const mockedUseUser = vi.mocked(useUser);
    mockedUseUser.mockReturnValue({
      user: mockUser as User | null,
      signOut: vi.fn(),
      loading: false,
    });

    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <Dashboard />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('should call signOut and redirect to root on logout', async () => {
    const routerMock = {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    };
    mockedUseRouter.mockReturnValue(routerMock);

    const mockSignOut = vi.fn();
    const mockedUseUser = vi.mocked(useUser);
    const mockUser: Partial<User> = {
      identities: [
        {
          identity_data: {
            first_name: 'Test',
          },
        } as Identity,
      ],
    };
    mockedUseUser.mockReturnValue({
      user: mockUser as User | null,
      signOut: mockSignOut,
      loading: false,
    });

    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <Toaster />
          <Dashboard />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    const logoutButton = screen.getByRole('button', { name: 'signOut' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Successfully signed out!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(DASHBOARD_PAGES.ROOT);
    });
  });

  it('should render About component', () => {
    const mockUser: Partial<User> = {
      identities: [
        {
          identity_data: {
            first_name: 'Test',
          },
        } as Identity,
      ],
    };
    const mockedUseUser = vi.mocked(useUser);
    mockedUseUser.mockReturnValue({
      user: mockUser as User | null,
      signOut: vi.fn(),
      loading: false,
    });
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <Dashboard />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    expect(screen.getByText('about.title')).toBeInTheDocument();
  });
});
