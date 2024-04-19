import type { FC } from 'react';

import { FormattedText } from '@/components/FormattedText/FormattedText';
import { Assertion as AssertionData } from '@/types';
import { Badge } from '../Badge';
import { AssertionLayout } from './AssertionLayout';

interface AssertionProps {
  assertion: AssertionData;
}

export const Assertion: FC<AssertionProps> = ({ assertion }) => {
  return (
    <AssertionLayout
      badge={<Badge automationState={assertion.automationState} />}
      title={<FormattedText text={assertion.title} />}
      description={assertion.description}
    />
  );
};
