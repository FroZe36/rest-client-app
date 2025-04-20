import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Loading from '@/app/[locale]/loading';

vi.mock('@/components/Spinner/Spinner', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mocked-spinner' />,
  };
});

describe('Loading', () => {
  it('should render Spinner', () => {
    render(<Loading />);
    expect(screen.getByTestId('mocked-spinner')).toBeInTheDocument();
  });
});
