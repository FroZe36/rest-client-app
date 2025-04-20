import { notFound } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import NotFoundCatchAll from '@/app/[locale]/[...notFound]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('NotFoundCatchAll', () => {
  it('should call notFound()', () => {
    NotFoundCatchAll();
    expect(notFound).toHaveBeenCalled();
  });
});
