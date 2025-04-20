import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import Rest from '@/components/Rest/Rest';

import { VariablesProvider } from '@/context/VariablesContext';

vi.mock(import('next/navigation'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    usePathname: vi
      .fn()
      .mockReturnValue('/rest/GET/aHR0cHM6Ly9leGFtcGxlLmNvbQ==/'),
    useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
  };
});

describe('Rest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('') as ReadonlyURLSearchParams
    );
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should render initial state', () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByTestId('method')).toHaveValue('GET');
    expect(screen.getByTestId('url')).toHaveValue('');
    expect(screen.getByText(/null - idle/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('headers')).toHaveLength(1);
  });

  it('should change method from GET to POST', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const user = userEvent.setup();
    const selectMethodElement = screen.getByTestId('method');

    expect(selectMethodElement).toHaveValue('GET');

    await user.selectOptions(selectMethodElement, ['POST']);

    expect(selectMethodElement).toHaveValue('POST');
  });

  it('should change url from "" to https://jsonplaceholder.typicode.com/posts', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const user = userEvent.setup();
    const urlElement = screen.getByTestId('url');

    expect(urlElement).toHaveValue('');

    await user.type(urlElement, 'https://jsonplaceholder.typicode.com/posts');

    expect(urlElement).toHaveValue(
      'https://jsonplaceholder.typicode.com/posts'
    );
  });

  it('should request and get response', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const user = userEvent.setup();
    const urlElement = screen.getByTestId('url');
    const selectMethodElement = screen.getByTestId('method');
    const buttonSubmit = screen.getByTestId('submit');

    expect(selectMethodElement).toHaveValue('GET');
    expect(urlElement).toHaveValue('');
    expect(screen.getByText(/null - idle/i)).toBeInTheDocument();

    await user.type(urlElement, 'https://jsonplaceholder.typicode.com/posts');

    expect(urlElement).toHaveValue(
      'https://jsonplaceholder.typicode.com/posts'
    );

    await user.click(buttonSubmit);

    expect(buttonSubmit).toBeDisabled();

    await waitFor(() => expect(buttonSubmit).toBeEnabled());
    expect(screen.getByText(/200 - success/i)).toBeInTheDocument();
  });

  it('should show body when change method from GET to POST', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const user = userEvent.setup();
    const selectMethodElement = screen.getByTestId('method');

    expect(selectMethodElement).toHaveValue('GET');

    await user.selectOptions(selectMethodElement, ['POST']);

    expect(selectMethodElement).toHaveValue('POST');
    expect(screen.getByText(/body/i)).toBeInTheDocument();
  });

  it('should render Rest fields auto-complete when have url', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('?test=1') as ReadonlyURLSearchParams
    );
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest
              slugs={[
                'POST',
                'aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz',
                'eyJ0aXRsZSI6ImZha2VUaXRsZSIsInVzZXJJZCI6MSwiYm9keSI6ImZha2VNZXNzYWdlIn0',
              ]}
            />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const urlElement = screen.getByTestId('url');
    const selectMethodElement = screen.getByTestId('method');
    const headers = screen.getAllByTestId('headers');

    expect(selectMethodElement).toHaveValue('POST');
    expect(urlElement).toHaveValue(
      'https://jsonplaceholder.typicode.com/posts'
    );
    const nameInput = within(headers[0]).getByDisplayValue('test');
    const valueInput = within(headers[0]).getByDisplayValue('1');
    expect(nameInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
  });

  it('should throw error when invalid url', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );
    const urlElement = screen.getByTestId('url');
    const selectMethodElement = screen.getByTestId('method');
    const buttonSubmit = screen.getByTestId('submit');
    const user = userEvent.setup();

    expect(selectMethodElement).toHaveValue('GET');
    expect(urlElement).toHaveValue('');
    expect(screen.getByText(/null - idle/i)).toBeInTheDocument();

    await user.type(urlElement, 'https://jsonplaceholder.typicode.com/postz');

    expect(urlElement).toHaveValue(
      'https://jsonplaceholder.typicode.com/postz'
    );

    await user.click(buttonSubmit);

    expect(buttonSubmit).toBeDisabled();

    await waitFor(() => expect(buttonSubmit).toBeEnabled());

    expect(
      screen.getByText(/HTTP error! status: 404 - error/i)
    ).toBeInTheDocument();
  });
  it('should add header', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    const addHeaderButton = screen.getByRole('button', {
      name: /rest.addHeader/i,
    });
    let headers = screen.getAllByTestId('headers');
    const nameInput = within(headers[0]).getByDisplayValue('Content-Type');
    const valueInput = within(headers[0]).getByDisplayValue('application/json');
    expect(headers).toHaveLength(1);
    expect(nameInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
    expect(addHeaderButton).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(addHeaderButton);
    await user.click(addHeaderButton);

    headers = screen.getAllByTestId('headers');
    expect(headers).toHaveLength(3);
  });
  it('should change header key and value', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    let headers = screen.getAllByTestId('headers');
    const nameInput = within(headers[0]).getByDisplayValue('Content-Type');
    const valueInput = within(headers[0]).getByDisplayValue('application/json');
    expect(headers).toHaveLength(1);
    expect(nameInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();

    const user = userEvent.setup();

    await user.clear(nameInput);
    await user.type(nameInput, 'Content-types');

    headers = screen.getAllByTestId('headers');
    expect(
      within(headers[0]).getByDisplayValue('Content-types')
    ).toBeInTheDocument();

    await user.clear(valueInput);
    await user.type(valueInput, 'application/jsonsssss');

    headers = screen.getAllByTestId('headers');
    expect(
      within(headers[0]).getByDisplayValue('application/jsonsssss')
    ).toBeInTheDocument();
  });

  it('should remove header when remove', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    let headers = screen.getAllByTestId('headers');
    const nameInput = within(headers[0]).getByDisplayValue('Content-Type');
    const valueInput = within(headers[0]).getByDisplayValue('application/json');
    const deleteButton = within(headers[0]).getByRole('button', { name: 'X' });
    expect(headers).toHaveLength(1);
    expect(nameInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(deleteButton);

    headers = screen.queryAllByTestId('headers');
    expect(headers).toHaveLength(0);
  });

  it('should open container with Headers', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    const title = screen.getByRole('heading', { name: /headers/i });
    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(title);

    expect(table).not.toBeInTheDocument();
  });

  it('should open container with Code', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={[]} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    const title = screen.getByRole('heading', { name: /code/i });
    const user = userEvent.setup();

    await user.click(title);
  });

  it('should change language Body', async () => {
    const locale = 'en';
    render(
      <MemoryRouterProvider>
        <NextIntlClientProvider locale={locale}>
          <VariablesProvider>
            <Rest slugs={['POST']} />
          </VariablesProvider>
        </NextIntlClientProvider>
      </MemoryRouterProvider>
    );

    const selectBodyLanguageElement = screen.getByTestId(
      'body-language-select'
    );
    expect(selectBodyLanguageElement).toHaveValue('json');
    const user = userEvent.setup();
    await user.selectOptions(selectBodyLanguageElement, ['javascript']);
    expect(selectBodyLanguageElement).toHaveValue('javascript');
  });
});
