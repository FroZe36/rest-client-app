import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import { describe, expect, it, vi } from 'vitest';

import messages from '@/../messages/en.json';
import NotFound from '@/app/[locale]/not-found';

vi.mock('next/link', () => ({
  default: vi.fn(({ href, children }) => (
    <a
      href={href}
      className='button button_colored'
    >
      {children}
    </a>
  )),
}));

describe('Test 404 page', () => {
  it('renders image and "return home" btn', () => {
    render(
      <NextIntlClientProvider
        locale='en'
        messages={messages}
      >
        <NotFound />
      </NextIntlClientProvider>
    );
    expect(screen.getByAltText('Error')).toBeInTheDocument();
    expect(screen.getByText('Return home')).toBeInTheDocument();
  });

  it('leads to home page when click a btn', () => {
    render(
      <NextIntlClientProvider
        locale='en'
        messages={messages}
      >
        <NotFound />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByRole('link'));
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        href: '/dashboard',
        className: 'button button_colored',
      }),
      undefined
    );
  });
});
