import { FC } from 'react';

import { Magnifier } from '@gravity-ui/icons';
import { Icon, Spin, TextInput } from '@gravity-ui/uikit';

import { bem } from './SearchInput.cn';

import './SearchInput.css';

export interface SearchInputProps {
  value: string;
  onUpdate: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

export const SearchInput: FC<SearchInputProps> = (props) => {
  const { value, onUpdate, placeholder, loading, className } = props;

  return (
    <TextInput
      size="l"
      className={bem(null, [className])}
      value={value}
      onUpdate={onUpdate}
      placeholder={placeholder}
      startContent={
        // контейнер фиксированного размера: иконка поиска и спиннер
        // одинаковой геометрии, при переключении ничего не перескакивает
        <span className={bem('Icon')}>
          {loading ? <Spin size="xs" /> : <Icon data={Magnifier} size={16} />}
        </span>
      }
      hasClear
    />
  );
};
