import { FC, ReactNode } from 'react';

import { bem } from './HighlightedText.cn';

import './HighlightedText.css';

type HighlightedTextProps = {
  /** исходный текст */
  text: string;
  /** фрагмент, вхождения которого подсвечиваются (без учёта регистра) */
  highlight?: string;
  className?: string;
};

export const HighlightedText: FC<HighlightedTextProps> = ({ text, highlight, className }) => {
  if (!highlight) {
    return <span className={bem(null, [className])}>{text}</span>;
  }

  const needle = highlight.toLowerCase();
  const haystack = text.toLowerCase();
  const parts: ReactNode[] = [];

  let position = 0;
  for (
    let index = haystack.indexOf(needle);
    index !== -1;
    index = haystack.indexOf(needle, position)
  ) {
    if (index > position) {
      parts.push(text.slice(position, index));
    }

    position = index + needle.length;
    parts.push(
      <span key={index} className={bem('Match')}>
        {text.slice(index, position)}
      </span>,
    );
  }

  if (position < text.length) {
    parts.push(text.slice(position));
  }

  return <span className={bem(null, [className])}>{parts}</span>;
};
