import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VariablesPage from '@/app/[locale]/dashboard/variables/page';

vi.mock('@/components/Variables/VariablesWrapper', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mocked-variables-wrapper' />,
  };
});

describe('VariablesPage', () => {
  it('should render VariablesWrapper', () => {
    render(<VariablesPage />);
    expect(screen.getByTestId('mocked-variables-wrapper')).toBeInTheDocument();
  });
});
