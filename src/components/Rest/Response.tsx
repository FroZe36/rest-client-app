import { useTranslations } from 'next-intl';
import { FC } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { State } from '@/types/rest.types';

import styles from './rest.module.css';

const {
  response,
  heading,
  container_nested,
  response__container,
  response__maintext,
  span,
  response__precode,
} = styles;

interface ResponseProps {
  data: State;
  translate: ReturnType<typeof useTranslations>;
}

const Response: FC<ResponseProps> = ({ data, translate }) => {
  return (
    <div className={response}>
      <h2 className={`${heading} ${container_nested}`}>
        {translate('response')}
      </h2>
      {data.response ? (
        <div className={response__container}>
          <div className={container_nested}>
            <h3 className={response__maintext}>
              {translate('status')}
              <span
                className={span}
              >{` ${data.response.status} - ${data.status}`}</span>
            </h3>
            <h3 className={response__maintext}>{translate('responseBody')}</h3>
          </div>

          <SyntaxHighlighter
            language='json'
            wrapLongLines={true}
            style={monokai}
            className={`${response__precode} syntax-scrollbar`}
          >
            {JSON.stringify(data.response.data, null, 3)}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className={response__container}>
          <h3 className={response__maintext}>
            {translate('status')}
            <span className={span}>{`${data.error} - ${data.status}`}</span>
          </h3>
        </div>
      )}
    </div>
  );
};
export default Response;
