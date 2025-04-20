import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { Toaster } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Variables from '@/components/Variables/Variables';

import { VariablesProvider, useVariables } from '@/context/VariablesContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: vi.fn((namespace) => {
      return (key: string) => {
        if (namespace === 'Main') {
          return key;
        }
        return `${namespace}.${key}`;
      };
    }),
    NextIntlClientProvider: actual.NextIntlClientProvider,
  };
});

const messages = {
  variables: {
    var: 'Variables',
    key: 'Key',
    value: 'Value',
    action: 'Action',
    varName: 'Variable name',
    varValue: 'Variable value',
    add: 'Add',
    remove: 'Remove',
    nameValueEmpty: 'Name and value cannot be empty.',
    duplicateName: 'Variable with name "{name}" already exists.',
  },
};
describe('Variables Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouterProvider>
        <NextIntlClientProvider
          locale='en'
          messages={messages}
        >
          <Toaster />
          <VariablesProvider>
            <Variables />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
  };

  const TestComponent = () => {
    useVariables();
    return <div />;
  };

  it('should throw an error when useVariables is used outside VariablesProvider', () => {
    expect(() =>
      render(
        <MemoryRouterProvider>
          <NextIntlClientProvider
            locale='en'
            messages={messages}
          >
            <TestComponent />
          </NextIntlClientProvider>
        </MemoryRouterProvider>
      )
    ).toThrowError('useVariables must be used within a VariablesProvider');
  });

  it('should render without errors', () => {
    renderComponent();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('should add a new variable', async () => {
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const tableRow = screen.getByRole('row', { name: /testName/i });
      expect(tableRow).toBeInTheDocument();
    });
  });

  it('should display an error when adding a duplicate variable', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText('Variable with name "testName" already exists.')
      ).toBeInTheDocument();
    });
  });

  it('should display an error when adding an empty variable name', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name and value cannot be empty.')
      ).toBeInTheDocument();
    });
  });

  it('should display an error when adding an empty variable value', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.click(addButton);
    await waitFor(() => {
      const error = screen.queryByText('Name and value cannot be empty.');
      expect(error).not.toBeNull();
    });
  });

  it('should edit a variable', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    const editNameInput = await screen.findByDisplayValue('testName');
    const editValueInput = await screen.findByDisplayValue('testValue');
    fireEvent.change(editNameInput, { target: { value: 'testNameEdit' } });
    fireEvent.change(editValueInput, { target: { value: 'testValueEdit' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('testNameEdit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('testValueEdit')).toBeInTheDocument();
    });
  });

  it('should remove a variable', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      screen.getByRole('row', { name: /testName/i });
    });
    const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
    const tableRow = removeButton.closest('tr');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(tableRow).not.toBeInTheDocument();
    });
  });
  it('should edit only name', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);
    await waitFor(() => {
      screen.getByRole('row', { name: /testName/i });
    });
    const editNameInput = screen.getByDisplayValue('testName');
    fireEvent.change(editNameInput, { target: { value: 'testNameEdit' } });
    await waitFor(() => {
      expect(screen.getByDisplayValue('testNameEdit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('testValue')).toBeInTheDocument();
    });
  });

  it('should edit only value', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });
    fireEvent.click(addButton);
    await waitFor(() => {
      screen.getByRole('row', { name: /testName/i });
    });
    const editValueInput = screen.getByDisplayValue('testValue');
    fireEvent.change(editValueInput, { target: { value: 'testValueEdit' } });
    await waitFor(() => {
      expect(screen.getByDisplayValue('testValueEdit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('testName')).toBeInTheDocument();
    });
  });
});
