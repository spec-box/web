import { FC } from 'react';
import { bem } from './SearchMatch.cn.ts';
import type { Highlight } from '@/types.ts';

import './SearchMatch.css';

interface SearchMatchProps {
  highlight?: Highlight;
  content: string;
}

const slice = (content: string, [startIdx, endIdx]: Highlight): string[] => {
  return [content.slice(0, startIdx), content.slice(startIdx, endIdx), content.slice(endIdx)];
};

export const SearchMatch: FC<SearchMatchProps> = ({ highlight = [0, 0], content }) => {
  const [left, middle, right] = slice(content, highlight);

  return (
    <span className={bem()}>
      {left}
      <span className={bem('Match')}>{middle}</span>
      {right}
    </span>
  );
};
