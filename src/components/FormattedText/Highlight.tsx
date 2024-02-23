import { type ReactNode, type FC } from 'react';

import { cn } from '@bem-react/classname';

import './Highlight.css';

export interface HighlightProps {
  children: ReactNode;
}

const bem = cn('Highlight');

export const Highlight: FC<HighlightProps> = (props) => {
  const { children } = props;

  return <code className={bem()}>{children}</code>;
};
