import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import Error, { metadata } from '@/app/[locale]/error';

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
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

describe('Error', () => {
  it('should render error message and image', () => {
    render(
      <NextIntlClientProvider locale='en'>
        <Error />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/errorPageDescription/i)).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image).toHaveAttribute('alt', 'error');
    expect(image).toHaveAttribute('width', '340');
    expect(image).toHaveAttribute('height', '340');
  });
  it('should have correct metadata', () => {
    expect(metadata.title).toBe('Error Page');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
