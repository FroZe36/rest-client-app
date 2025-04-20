import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import CodeSnippet from '../CodeSnippet/CodeSnippet';

import styles from './rest.module.css';

const { container, container_nested, heading } = styles;

interface CodeProps {
  translate: ReturnType<typeof useTranslations>;
}

const Code: FC<CodeProps> = ({ translate }) => {
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  return (
    <>
      <div className={`${container} ${container_nested}`}>
        <h2
          className={heading}
          onClick={() => setShowCodeSnippet((prev) => !prev)}
          style={{ cursor: 'pointer' }}
        >
          {showCodeSnippet ? '▼' : '▶'} {translate('code')}
        </h2>
      </div>
      {showCodeSnippet && <CodeSnippet />}
    </>
  );
};
export default Code;
