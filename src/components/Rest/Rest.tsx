'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  FC,
  FocusEventHandler,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

import {
  FormDataType,
  HTTP_METHODS,
  Header,
  HistoryItem,
  METHODS_WITH_BODY,
  initialState,
} from '@/types/rest.types';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { applyVariables } from '@/utils/applyVariables';
import { HISTORY_KEY } from '@/utils/constants';
import { filterString } from '@/utils/helpers';

import Body from './Body';
import Code from './Code';
import Headers from './Headers';
import Response from './Response';
import styles from './rest.module.css';
import { useVariables } from '@/context/VariablesContext';

const {
  rest,
  form,
  container,
  container_search,
  selectSearch,
  inputSearch,
  button,
  input,
} = styles;

interface RestProps {
  slugs: string[];
}

const Rest: FC<RestProps> = ({ slugs }) => {
  const t = useTranslations('rest');
  const { variables } = useVariables();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const BASEPATH = `/${locale}${DASHBOARD_PAGES.REST}`;

  const [isPending, startTransition] = useTransition();

  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>(() => {
    const arr: Header[] = [];
    if (searchParams.size)
      searchParams.forEach((value, key) => arr.push({ key, value }));
    return searchParams.size
      ? arr
      : [{ key: 'Content-Type', value: 'application/json' }];
  });

  const [dataResponse, setDataResponse] = useState(initialState);
  const inputSearchRef = useRef<HTMLInputElement | null>(null);

  const updateURL = useCallback(() => {
    const encodedUrl = url
      ? filterString(Buffer.from(url).toString('base64'))
      : '';
    const encodedBody = body
      ? filterString(Buffer.from(body).toString('base64'))
      : '';
    const headersParams = new URLSearchParams();
    headers.forEach((header) => {
      if (header.key && header.value) {
        headersParams.append(header.key, header.value);
      }
    });

    const pathSegments = [BASEPATH, method, encodedUrl, encodedBody].filter(
      Boolean
    );

    const fullUrl = headersParams.toString()
      ? `${pathSegments.join('/')}?${headersParams}`
      : pathSegments.join('/');

    window.history.replaceState(null, '', fullUrl);
  }, [BASEPATH, body, url, method, headers]);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const form = new FormData(e.currentTarget);
        const { method, headers, body, url } = {
          ...Object.fromEntries(form.entries()),
          headers: JSON.parse(form.get('headers') as string) as Header[],
        } as FormDataType;

        const { replaced: parsedUrl, unmatchedVariables: urlUnmatched } =
          applyVariables(url, variables);
        const { replaced: parsedBody, unmatchedVariables: bodyUnmatched } =
          applyVariables(body, variables);

        const parsedHeaders = headers.map(({ key, value }) => {
          const { replaced: parsedKey, unmatchedVariables: keyUnmatched } =
            applyVariables(key, variables);
          const { replaced: parsedValue, unmatchedVariables: valueUnmatched } =
            applyVariables(value, variables);
          return {
            key: parsedKey,
            value: parsedValue,
            unmatched: [...keyUnmatched, ...valueUnmatched],
          };
        });

        const allUnmatched = [
          ...urlUnmatched,
          ...bodyUnmatched,
          ...parsedHeaders.flatMap((header) => header.unmatched),
        ];

        if (allUnmatched.length > 0) {
          toast.error(
            `Не найдены переменные: ${[...new Set(allUnmatched)].join(', ')}`
          );
          return;
        }

        const options: RequestInit = {
          method,
          headers: parsedHeaders.reduce(
            (acc, { key, value }) => {
              if (key && value) acc[key] = value;
              return acc;
            },
            {} as Record<string, string>
          ),
        };

        if (METHODS_WITH_BODY.includes(method) && parsedBody) {
          options.body = parsedBody;
        }

        const response = await fetch(parsedUrl, options);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const historyLocalStorage: HistoryItem[] = JSON.parse(
          localStorage.getItem(HISTORY_KEY) ?? '[]'
        );

        const now = new Date();
        const formattedDate = now.toLocaleString();

        const newHistoryItem: HistoryItem = {
          url: `${window.location.pathname}${window.location.search}`,
          requestURL: window.location.pathname.split('/')[5],
          date: formattedDate,
          method: method,
          body: body,
          headers: headers,
        };

        historyLocalStorage.push(newHistoryItem);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyLocalStorage));

        setDataResponse({
          status: 'success',
          response: {
            status: response.status,
            data,
          },
          error: null,
        });
      } catch (error) {
        setDataResponse({
          status: 'error',
          response: null,
          error: error instanceof Error ? error.message : 'Unknown Error',
        });
      }
    });
  };

  useEffect(() => {
    if (slugs) {
      const [method, url, body] = slugs;
      if (method) {
        setMethod(method);
      }
      if (url) {
        setUrl(Buffer.from(url, 'base64').toString('utf8'));
      }
      if (body) {
        setBody(Buffer.from(body, 'base64').toString('utf8'));
      }
    }
  }, [slugs]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  useEffect(() => {
    if (inputSearchRef.current) {
      const color = HTTP_METHODS.find((m) => m.value === method)?.color ?? '';
      inputSearchRef.current.style.borderColor = color;
    }
  }, [method]);

  const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleBodyBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    const element = event.target.innerText;
    setBody(element ?? '');
  };

  return (
    <section className={rest}>
      <h1 className='maintext maintext_green'>REST Client</h1>
      <form
        className={form}
        onSubmit={handleSubmit}
      >
        <input
          className={input}
          type='hidden'
          name='headers'
          value={JSON.stringify(headers)}
        />
        <input
          className={input}
          type='hidden'
          name='body'
          value={body}
        />
        <div className={container}>
          <div className={`${container} ${container_search}`}>
            <select
              name='method'
              value={method}
              onChange={handleMethodChange}
              className={selectSearch}
              data-testid='method'
            >
              {HTTP_METHODS.map(({ value, color }) => {
                return (
                  <option
                    data-testid='method-options'
                    key={value}
                    value={value}
                    style={{ color: color }}
                  >
                    {value}
                  </option>
                );
              })}
            </select>
            <input
              className={`${inputSearch} ${input}`}
              ref={inputSearchRef}
              onChange={handleUrlChange}
              value={url}
              name='url'
              type='url'
              placeholder='https://jsonplaceholder.typicode.com'
              required
              data-testid='url'
            />
          </div>
          <button
            type='submit'
            disabled={isPending}
            className={`button button_colored ${button}`}
            data-testid='submit'
          >
            {isPending ? t('sending') : t('send')}
          </button>
        </div>
        <Headers
          headers={headers}
          setHeaders={setHeaders}
          translate={t}
        />
        <Code translate={t} />
        {METHODS_WITH_BODY.includes(method) && (
          <Body
            body={body}
            bodyBlurHandler={handleBodyBlur}
            translate={t}
          />
        )}
      </form>
      <Response
        data={dataResponse}
        translate={t}
      />
    </section>
  );
};

export default Rest;
