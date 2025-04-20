import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';

import { SignInFormData, SignUpFormData } from '@/types/auth.types';

import { server } from '../mocks/server';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn((namespace) => {
    return (key: string) => {
      if (namespace === 'Main') {
        return key;
      }
      return `${namespace}.${key}`;
    };
  }),
}));

const onSubmitMock = vi.fn();
const mockedUseTranslations = vi.mocked(useTranslations);

describe('Form component', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    onSubmitMock.mockClear();
    mockedUseTranslations.mockClear();
    push.mockClear();
  });
  afterAll(() => server.close());

  const RenderForm = ({
    mode,
    onSubmit,
    errorMessage,
  }: {
    mode: 'signin' | 'signup';
    onSubmit: (data: SignUpFormData | SignInFormData) => Promise<void>;
    errorMessage?: string;
  }) => {
    return (
      <Form
        mode={mode}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
      />
    );
  };
  const renderForm = (mode: 'signin' | 'signup') => {
    return render(
      <MemoryRouterProvider>
        <RenderForm
          mode={mode}
          onSubmit={onSubmitMock}
        />
      </MemoryRouterProvider>
    );
  };

  it('should render signin form correctly', () => {
    const t = useTranslations('Main');
    renderForm('signin');
    expect(mockedUseTranslations).toHaveBeenCalledWith('Main');
    expect(screen.getByTestId('form-title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Enter your email address'))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Enter your password'))
    ).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should render signup form correctly', () => {
    const t = useTranslations('Main');
    renderForm('signup');
    expect(mockedUseTranslations).toHaveBeenCalledWith('Main');
    expect(screen.getByTestId('form-title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Enter your name'))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Enter your email'))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Choose a password'))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t('Password again'))
    ).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should display validation errors for signin', async () => {
    const t = useTranslations('Main');
    renderForm('signin');
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(
      () => {
        expect(screen.getByText(t('Email is required'))).toBeInTheDocument();
        expect(screen.getByText(t('Password is required'))).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should display validation errors for signup', async () => {
    const t = useTranslations('Main');
    renderForm('signup');
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(
      () => {
        expect(screen.getByText(t('Name is required'))).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
    await waitFor(
      () => {
        expect(screen.getByText(t('Email is required'))).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should display validation errors for signup', async () => {
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), {
      target: { value: '123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password again'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      const error = screen.getAllByText(
        (_, el) =>
          el?.textContent === 'Password must contain at least 8 characters'
      );
      expect(error).toHaveLength(4);
    });
  });

  it('should call onSubmit with correct data for signin', async () => {
    renderForm('signin');
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signIn' }));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Qwe!23qwe',
      });
    });
  });

  it('should call onSubmit with correct data for signup', async () => {
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password again'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signUp' }));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Qwe!23qwe',
        name: 'Test',
        confirmPassword: 'Qwe!23qwe',
      });
    });
  });

  it('should switch to signup form when "signUp" button clicked on signin form', async () => {
    renderForm('signin');
    const t = useTranslations('Main');
    fireEvent.click(screen.getByRole('button', { name: t('signUp') }));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/auth/signup');
    });
  });

  it('should switch to signin form when "signIn" button clicked on signup form', async () => {
    renderForm('signup');
    const t = useTranslations('Main');
    fireEvent.click(screen.getByRole('button', { name: t('signIn') }));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/auth/signin');
    });
  });

  it('should display email format error for signin', async () => {
    const t = useTranslations('Main');
    renderForm('signin');
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test_example_com' },
    });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText(t('Invalid email'))).toBeInTheDocument();
    });
  });

  it('should display password min length error for signin', async () => {
    const t = useTranslations('Main');
    renderForm('signin');
    fireEvent.focus(screen.getByPlaceholderText('Enter your email address'));
    fireEvent.focus(screen.getByPlaceholderText('Enter your password'));
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText(t('Email is required'))).toBeInTheDocument();
    });
  });

  it('should display email format error for signin', async () => {
    const t = useTranslations('Main');
    renderForm('signin');
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 't.com' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText(t('Invalid email'))).toBeInTheDocument();
    });
  });

  it('should display email format error for signup', async () => {
    const t = useTranslations('Main');
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test_example_com' },
    });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText(t('Invalid email'))).toBeInTheDocument();
    });
  });

  it('should display password min length error for signup', async () => {
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), {
      target: { value: 'Qwe!23' },
    });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      const error = screen.getAllByText(
        (_, el) =>
          el?.textContent === 'Password must contain at least 8 characters'
      );
      expect(error).toHaveLength(4);
    });
  });

  it('should display password mismatch error', async () => {
    const t = useTranslations('Main');
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText('Choose a password'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password again'), {
      target: { value: 'Qwe!23qwe1' },
    });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText(t(`Passwords don't match`))).toBeInTheDocument();
    });
  });
  it('should reset form after submission', async () => {
    renderForm('signin');
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Qwe!23qwe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'signIn' }));
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalled();
    });
    expect(
      (
        screen.getByPlaceholderText(
          'Enter your email address'
        ) as HTMLInputElement
      ).value
    ).toBe('');
    expect(
      (
        screen.getByPlaceholderText(
          'Enter your email address'
        ) as HTMLInputElement
      ).value
    ).toBe('');
  });
  it('should show error message', async () => {
    render(
      <MemoryRouterProvider>
        <RenderForm
          mode={'signin'}
          onSubmit={onSubmitMock}
          errorMessage={'invalid credentials'}
        />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('invalid credentials')).toBeInTheDocument();
    });
  });
  it('should display validation error', async () => {
    const t = useTranslations('Main');
    render(
      <MemoryRouterProvider>
        <Input
          type={'text'}
          id={'name'}
          placeholder={t('Enter your name')}
          errorMsg={'Name is required'}
        />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });
});
