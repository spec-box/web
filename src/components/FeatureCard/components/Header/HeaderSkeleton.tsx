import { FC } from 'react';
import { Skeleton } from '@gravity-ui/uikit';
import { HeaderLayout } from './HeaderLayout';

export const HeaderSkeleton: FC = () => {
  return (
    <HeaderLayout
      title={<Skeleton style={{ height: 'var(--g-text-header-2-line-height) ' }} />}
      actions={
        <>
          <Skeleton style={{ maxWidth: '150px', height: '28px', borderRadius: '100px' }} />
          <Skeleton style={{ maxWidth: '150px', height: '28px', borderRadius: '100px' }} />
        </>
      }
      sidebar={<Skeleton style={{ height: '82px', width: '145px' }} />}
    />
  );
};
