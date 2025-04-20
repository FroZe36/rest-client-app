import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HistoryPage from '@/app/[locale]/dashboard/history/page';

vi.mock('@/components/History/HistoryWrapper', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mocked-history' />,
  };
});

describe('HistoryPage', () => {
  it('should render history section', () => {
    render(<HistoryPage />);
    expect(screen.getByTestId('mocked-history')).toBeInTheDocument();
  });
});
