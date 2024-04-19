import { FC } from 'react';
import { Skeleton } from '@gravity-ui/uikit';
import { AssertionLayout } from './AssertionLayout';

const height = 'var(--g-text-body-2-line-height)';

export const AssertionSkeleton: FC = () => {
  return (
    <AssertionLayout
      badge={<Skeleton style={{ width: '16px', height }} />}
      title={<Skeleton style={{ height }} />}
    />
  );
};
