import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CodeSnippet from '@/components/CodeSnippet/CodeSnippet';

vi.mock('next/navigation', () => ({
  usePathname: vi
    .fn()
    .mockReturnValue('/rest/GET/aHR0cHM6Ly9leGFtcGxlLmNvbQ==/'),
  useSearchParams: vi
    .fn()
    .mockReturnValue(
      new URLSearchParams([['Content-Type', 'application/json']])
    ),
}));

vi.mock('next-intl', () => ({
  useLocale: vi.fn().mockReturnValue('en'),
}));

vi.mock('postman-code-generators', () => ({
  default: {
    convert: vi.fn((targetKey, targetVar, request, options, callback) => {
      callback(null, `Mocked snippet for ${targetKey} with ${targetVar}`);
    }),
  },
}));

vi.mock('postman-collection', () => ({
  default: {
    Request: vi.fn().mockImplementation(() => ({})),
  },
}));

vi.mock('@/context/VariablesContext', () => ({
  useVariables: vi.fn().mockReturnValue({
    variables: [],
  }),
}));

vi.mock('@/utils/applyVariables', () => ({
  applyVariables: vi.fn().mockImplementation((value) => ({ replaced: value })),
}));

describe('CodeSnippet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default target and variant', () => {
    render(<CodeSnippet />);

    expect(screen.getByDisplayValue('curl')).toBeInTheDocument();
    expect(screen.getByDisplayValue('cURL')).toBeInTheDocument();
  });

  it('changes target when dropdown is changed', () => {
    render(<CodeSnippet />);

    const targetDropdown = screen.getByDisplayValue('curl');
    fireEvent.change(targetDropdown, { target: { value: 'javascript' } });

    expect(screen.getByDisplayValue('javascript')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fetch')).toBeInTheDocument();
  });

  it('changes variant when dropdown is changed', () => {
    render(<CodeSnippet />);

    const targetDropdown = screen.getByDisplayValue('curl');
    fireEvent.change(targetDropdown, { target: { value: 'javascript' } });

    const variantDropdown = screen.getByDisplayValue('Fetch');
    fireEvent.change(variantDropdown, { target: { value: 'XHR' } });

    expect(screen.getByDisplayValue('XHR')).toBeInTheDocument();
  });

  it('shows message when there is not enough data to generate code', () => {
    render(<CodeSnippet />);

    expect(
      screen.getByText('Please add request URL for the code to be generated')
    ).toBeInTheDocument();
  });
});
