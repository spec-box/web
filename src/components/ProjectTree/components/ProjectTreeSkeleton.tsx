import { FC } from 'react';
import { Skeleton } from '@gravity-ui/uikit';
import { Indent } from '@/components/ProjectFeatures/components/Indent';

import './ProjectTreeSkeleton.css';
import { bem } from '../ProjectTree.cn';

const Row: FC<{ level: number }> = ({ level }) => {
  return (
    <div className={bem('SkeletonRow')}>
      <Indent level={level} />
      <div className={bem('SkeletonItem')}>
        <Skeleton style={{ height: '30px' }} />
      </div>
    </div>
  );
};

export const ProjectTreeSkeleton: FC = () => {
  return (
    <div className={bem('Skeleton')}>
      <Row level={0} />
      <Row level={1} />
      <Row level={2} />
      <Row level={2} />
      <Row level={1} />
      <Row level={0} />
      <Row level={0} />
    </div>
  );
};
