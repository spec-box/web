import { FC } from 'react';
import { bem } from './SearchMatch.cn.ts';

import './SearchMatch.css';

interface SearchMatchProps {
  search: string;
  content: string;
}

const slice = (search: string, content: string): string[] => {
  search = (search ?? '').trim().toLocaleLowerCase();
  const startIdx = content.toLocaleLowerCase().indexOf(search);

  if (startIdx < 0) return ['', '', content];

  const lastIdx = startIdx + search.length;

  return [content.slice(0, startIdx), content.slice(startIdx, lastIdx), content.slice(lastIdx)];
};

export const SearchMatch: FC<SearchMatchProps> = ({ search, content }) => {
  const [left, middle, right] = slice(search, content);

  return (
    <span className={bem()}>
      {left}
      <span className={bem('Match')}>{middle}</span>
      {right}
    </span>
  );
};
