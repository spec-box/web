import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { TextInput } from '@gravity-ui/uikit';

import './Search.css';
import { bem } from './Search.cn.ts';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

const DEBOUNCE_TIMEOUT_MS = 300;

export const Search: FC<SearchProps> = ({ value, onChange }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setInputValue(value);
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        onChange?.(value);
      }, DEBOUNCE_TIMEOUT_MS);
    },
    [onChange],
  );

  return (
    <TextInput
      className={bem()}
      placeholder="Поиск"
      size="l"
      hasClear
      value={inputValue}
      onChange={handleChange}
      autoFocus
    />
  );
};
