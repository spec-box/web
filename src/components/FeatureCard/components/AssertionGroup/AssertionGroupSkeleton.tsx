import { FC } from 'react';
import { Skeleton } from '@gravity-ui/uikit';

import { AssertionSkeleton } from '../Assertion/AssertionSkeleton';
import { AssertionGroupLayout } from './AssertionGroupLayout';

export const AssertionGroupSkeleton: FC = () => {
  return (
    <AssertionGroupLayout
      title={<Skeleton style={{ width: '30%', height: 'var(--g-text-subheader-3-line-height)' }} />}
      assertions={
        <>
          <AssertionSkeleton />
          <AssertionSkeleton />
          <AssertionSkeleton />
        </>
      }
    />
  );
};
