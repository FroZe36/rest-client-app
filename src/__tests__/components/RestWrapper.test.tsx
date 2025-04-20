import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import RestLazyWrapper from '@/components/Rest/RestLazyWrapper';

const MockRestLazy = vi.fn(() => (
  <div data-testid='rest-lazy-wrapper'>RestLazyWrapper</div>
));
vi.mock('@/components/Rest/Rest', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    default: MockRestLazy,
  };
});

describe('RestLazyWrapper', () => {
  it('should render Spinner initially', () => {
    render(
      <MemoryRouterProvider>
        <RestLazyWrapper slugs={[]} />
      </MemoryRouterProvider>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render RestLazyWrapper section after loading', async () => {
    render(
      <MemoryRouterProvider>
        <RestLazyWrapper slugs={[]} />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rest-lazy-wrapper')).toBeInTheDocument();
    });

    expect(MockRestLazy).toHaveBeenCalled();
  });
});
