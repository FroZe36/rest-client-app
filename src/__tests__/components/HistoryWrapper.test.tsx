import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import HistoryWrapper from '@/components/History/HistoryWrapper';

const MockHistory = vi.fn(() => <div data-testid='history'>History</div>);
vi.mock('@/components/History/History', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    default: MockHistory,
  };
});

describe('HistoryWrapper', () => {
  it('should render Spinner initially', () => {
    render(
      <MemoryRouterProvider>
        <HistoryWrapper />
      </MemoryRouterProvider>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render history section after loading', async () => {
    render(
      <MemoryRouterProvider>
        <HistoryWrapper />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('history')).toBeInTheDocument();
    });

    expect(MockHistory).toHaveBeenCalled();
  });
});
