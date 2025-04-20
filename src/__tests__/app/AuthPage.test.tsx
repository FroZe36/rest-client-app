import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { SIGNIN_PATH } from '@/config/pages-url.config';

import AuthPage from '@/app/[locale]/auth/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('AuthPage', () => {
  it('should redirect to SIGNIN_PATH', () => {
    AuthPage();
    expect(redirect).toHaveBeenCalledWith(SIGNIN_PATH);
  });
});
