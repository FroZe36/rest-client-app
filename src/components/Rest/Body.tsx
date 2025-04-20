import { langs } from '@uiw/codemirror-extensions-langs';
import { monokai as monokaiTheme } from '@uiw/codemirror-theme-monokai';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FC, FocusEventHandler, useState } from 'react';

import styles from './rest.module.css';

const {
  container,
  container_requestbody,
  container_nested,
  heading,
  selectSearch,
} = styles;

const languageOptions = [
  { label: 'JSON', value: 'json', extension: langs.json() },
  { label: 'JavaScript', value: 'javascript', extension: langs.javascript() },
  { label: 'Plain text', value: 'plaintext', extension: null },
];

interface BodyProps {
  body: string;
  bodyBlurHandler: FocusEventHandler<HTMLDivElement>;
  translate: ReturnType<typeof useTranslations>;
}

const Body: FC<BodyProps> = ({ body, bodyBlurHandler, translate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = languageOptions.find(
      (lang) => lang.value === e.target.value
    );
    if (selected) {
      setSelectedLanguage(selected);
    }
  };
  return (
    <>
      <div className={`${container} ${container_requestbody}`}>
        <div className={`${container} ${container_nested}`}>
          <h2 className={heading}>{translate('requestBody')}</h2>
          <select
            className={selectSearch}
            value={selectedLanguage.value}
            onChange={handleLanguageChange}
            data-testid='body-language-select'
          >
            {languageOptions.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
              >
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <CodeMirror
          value={body}
          height='200px'
          theme={monokaiTheme}
          extensions={[
            EditorView.lineWrapping,
            selectedLanguage.extension ? [selectedLanguage.extension] : [],
          ]}
          onBlur={bodyBlurHandler}
        />
      </div>
    </>
  );
};
export default Body;
