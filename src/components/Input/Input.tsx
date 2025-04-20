import { FC, InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

const { container, input, error } = styles;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMsg?: string;
}

const Input: FC<InputProps> = ({ errorMsg, ...props }) => {
  return (
    <div className={container}>
      <input
        className={input}
        {...props}
      />
      {errorMsg && <span className={error}>{errorMsg}</span>}
    </div>
  );
};
export default Input;
