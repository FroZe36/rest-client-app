import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DashboardPage from '@/app/[locale]/dashboard/page';

vi.mock('@/components/Dashboard/Dashboard', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mocked-dashboard' />,
  };
});

describe('DashboardPage', () => {
  it('should render Dashboard', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('mocked-dashboard')).toBeInTheDocument();
  });
});
