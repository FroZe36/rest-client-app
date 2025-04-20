import { useTranslations } from 'next-intl';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';

import { Header } from '@/types/rest.types';

import styles from './rest.module.css';

const {
  container,
  container_nested,
  heading,
  button_border,
  headers__table,
  input,
} = styles;

interface HeadersProps {
  headers: Header[];
  setHeaders: Dispatch<SetStateAction<Header[]>>;
  translate: ReturnType<typeof useTranslations>;
}

const Headers: FC<HeadersProps> = ({ headers, setHeaders, translate }) => {
  const [showHeaders, setShowHeaders] = useState(true);
  const inputTableRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputTableRefs.current[index] = el;
  };
  const addHeader = () => {
    setShowHeaders(true);
    setHeaders([...headers, { key: '', value: '' }]);
    setTimeout(() => {
      inputTableRefs.current[headers.length]?.focus();
    }, 0);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
    inputTableRefs.current = inputTableRefs.current.filter(
      (_, i) => i !== index
    );
  };

  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  return (
    <>
      <div className={`${container} ${container_nested}`}>
        <h2
          className={heading}
          onClick={() => setShowHeaders((prev) => !prev)}
          style={{ cursor: 'pointer' }}
        >
          {showHeaders ? '▼' : '▶'} {translate('headers')}
        </h2>
        <button
          className={`button ${button_border}`}
          type='button'
          onClick={addHeader}
        >
          {translate('addHeader')}
        </button>
      </div>
      {showHeaders && (
        <table className={headers__table}>
          <thead>
            <tr>
              <th>{translate('key')}</th>
              <th>{translate('value')}</th>
              <th>{translate('action')}</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header, index) => (
              <tr
                key={index}
                data-testid='headers'
              >
                <td>
                  <input
                    className={input}
                    type='text'
                    placeholder={translate('headerName')}
                    value={header.key}
                    onChange={(e) =>
                      handleHeaderChange(index, 'key', e.target.value)
                    }
                    ref={setInputRef(index)}
                  />
                </td>
                <td>
                  <input
                    className={input}
                    type='text'
                    placeholder={translate('headerValue')}
                    value={header.value}
                    onChange={(e) =>
                      handleHeaderChange(index, 'value', e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    type='button'
                    className={`button ${button_border}`}
                    onClick={() => removeHeader(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
export default Headers;
