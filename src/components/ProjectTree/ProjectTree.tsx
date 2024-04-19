import { FC } from 'react';
import type { TreeNode } from '@/types';
import { ProjectFeatures } from '@/components/ProjectFeatures/ProjectFeatures';
import { ProjectTreeSkeleton } from './components/ProjectTreeSkeleton';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';

import './ProjectTree.css';
import { bem } from './ProjectTree.cn';

interface ProjectTreeProps {
  isPending: boolean;
  tree: TreeNode[];
  onFeatureSelected: (featureCode: string) => void;
  selectedFeatureCode?: string;
  search?: string;
}

export const ProjectTree: FC<ProjectTreeProps> = (props) => {
  const { isPending, tree, onFeatureSelected, selectedFeatureCode, search } = props;

  if (isPending) {
    return <ProjectTreeSkeleton />;
  }

  if (search && !tree.length) {
    return (
      <PlaceholderMessage
        className={bem('Empty')}
        title="Ничего не найдено"
        description={`Результатов по запросу «${search}» не найдено. Попробуйте сформулировать запрос иначе`}
      />
    );
  }

  if (!search && !tree.length) {
    return (
      <PlaceholderMessage
        className={bem('Empty')}
        title="Ничего не найдено"
        description="Здесь будет список функциональных требований проекта"
      />
    );
  }

  return (
    <ProjectFeatures
      tree={tree}
      selectedFeatureCode={selectedFeatureCode}
      onFeatureSelected={onFeatureSelected}
    />
  );
};
