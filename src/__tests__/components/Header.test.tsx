import { User } from '@supabase/supabase-js';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Header from '@/components/Header';

import { useUser } from '@/hooks/useUser';

import { usePathname } from '@/i18n/navigation';

vi.mock('@/hooks/useUser');
vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('next-intl');
  return {
    ...actual,
    useTranslations: vi.fn((namespace) => {
      return (key: string) => {
        if (namespace === 'Main') {
          return key;
        }
        return `${namespace}.${key}`;
      };
    }),
    useLocale: vi.fn(() => 'en'),
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('should render correctly for logged-in user', () => {
    const mockUser: Partial<User> = {
      id: '123',
    };
    const mockedUseUser = vi.mocked(useUser);
    mockedUseUser.mockReturnValue({
      user: mockUser as User,
      signOut: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale='en'>
          <Header />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    expect(screen.getByTestId('rest_client_logo')).toBeInTheDocument();

    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
    expect(screen.getByText('variables')).toBeInTheDocument();

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'signOut' })).toBeInTheDocument();
  });

  it('should render correctly for logged-out user', () => {
    const mockedUseUser = vi.mocked(useUser);
    mockedUseUser.mockReturnValue({
      user: null,
      signOut: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale='en'>
          <Header />
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    expect(screen.getByText('Rest Client')).toBeInTheDocument();

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
