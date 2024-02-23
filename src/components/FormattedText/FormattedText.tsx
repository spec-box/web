import { type FC } from 'react';

import { useTextFormatter } from '@/hooks/useTextFormatter';

import { FeatureLink } from './FeatureLink';
import { Highlight } from './Highlight';

export interface FormattedTextProps {
  text: string;
}

export const FormattedText: FC<FormattedTextProps> = (props) => {
  const { text } = props;

  const format = useTextFormatter({
    highlight: ({ children }) => <Highlight>{children}</Highlight>,
    reference: ({ children, url }) => <FeatureLink feature={url}>{children}</FeatureLink>,
    url: ({ children }) => <Highlight>{children}</Highlight>,
  });

  return format(text);
};
