import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VariablesWrapper from '@/components/Variables/VariablesWrapper';

const MockVariables = vi.fn(() => <div data-testid='variables'>Variables</div>);
vi.mock('@/components/Variables/Variables', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    default: MockVariables,
  };
});

describe('VariablesWrapper', () => {
  it('should render Spinner initially', () => {
    render(
      <MemoryRouterProvider>
        <VariablesWrapper />
      </MemoryRouterProvider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render Variables after loading', async () => {
    render(
      <MemoryRouterProvider>
        <VariablesWrapper />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('variables')).toBeInTheDocument();
    });

    expect(MockVariables).toHaveBeenCalled();
  });
});
