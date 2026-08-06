import { useUnit } from 'effector-react';
import { FC, useCallback } from 'react';

import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { LinesSkeleton } from '@/components/LinesSkeleton/LinesSkeleton';
import {
  FEATURE_SKELETON_LINES,
  TREE_SKELETON_LINES,
} from '@/components/LinesSkeleton/LinesSkeleton.presets';
import { ProjectFeatures } from '@/components/ProjectFeatures/ProjectFeatures';
import { TreeFilterPanel } from '@/components/TreeFilterPanel/TreeFilterPanel';
import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/project';
import { Feature, TreeNode } from '@/types';
import { cn } from '@bem-react/classname';

import './Project.css';
import { ProjectLayout } from '@/components/ProjectLayout/ProjectLayout';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';

const bem = cn('Project');

interface ProjectTreeProps {
  isLoaded: boolean;
  filterIsActive: boolean;
  tree: TreeNode[];
  onFeatureSelected: (featureCode: string) => void;
  selectedFeatureCode?: string;
}

const ProjectTree: FC<ProjectTreeProps> = (props) => {
  const { isLoaded, filterIsActive, tree, onFeatureSelected, selectedFeatureCode } = props;

  // скелетон — только пока не завершилась первая загрузка после открытия страницы;
  // индикатор последующих перезагрузок показывается в инпуте панели фильтра
  if (!isLoaded) {
    return <LinesSkeleton className={bem('TreeScroll')} lines={TREE_SKELETON_LINES} />;
  }

  if (!tree.length) {
    return (
      <PlaceholderMessage
        className={bem('TreeEmptyState')}
        title="Ничего не найдено"
        description={
          filterIsActive ? 'Попробуйте изменить условия фильтра' : 'В проекте пока нет фичей'
        }
      />
    );
  }

  return (
    <div className={bem('TreeScroll')}>
      <ProjectFeatures
        tree={tree}
        selectedFeatureCode={selectedFeatureCode}
        onFeatureSelected={onFeatureSelected}
      />
    </div>
  );
};

interface DetailsProps {
  feature: Feature | null;
  isPending: boolean;
  repositoryUrl?: string;
}

const Details: FC<DetailsProps> = ({ isPending, feature, repositoryUrl }) => {
  if (isPending) {
    return <LinesSkeleton className={bem('FeatureSkeleton')} lines={FEATURE_SKELETON_LINES} />;
  } else if (!feature) {
    return (
      <PlaceholderMessage
        className={bem('EmptyState')}
        title="Ничего не выбрано"
        description="Выберите элемент из списка для просмотра детальной информации"
      />
    );
  } else {
    return (
      <FeatureCard className={bem('FeatureCard')} feature={feature} repositoryUrl={repositoryUrl} />
    );
  }
};

export const Project: FC = () => {
  const structureIsPending = useUnit(model.$structureIsLoading);
  const structureLoaded = useUnit(model.$structureLoaded);
  const filterIsActive = useUnit(model.$filterIsActive);
  const {
    project: { code: projectCode, title: projectTitle, repositoryUrl },
    tree,
  } = useUnit(model.$structure);

  const loadFeature = useUnit(model.loadFeature);
  const feature = useUnit(model.$feature);
  const featureCode = useUnit(model.$featureCode);
  const featureIsPending = useUnit(model.$featureIsPending);

  const onFeatureSelected = useCallback(
    (feature: string) => loadFeature({ project: projectCode, feature }),
    [projectCode, loadFeature],
  );

  const navigate = useCallback(
    (project: string, feature: string) => loadFeature({ project, feature }),
    [loadFeature],
  );

  useTitle(structureIsPending ? 'Структура проекта' : projectTitle);

  return (
    <ProjectLayout contentClassName={bem()} project={projectCode} navigate={navigate}>
      <div className={bem('ListPanel')}>
        <TreeFilterPanel className={bem('FilterPanel')} />
        <ProjectTree
          isLoaded={structureLoaded}
          filterIsActive={filterIsActive}
          tree={tree}
          onFeatureSelected={onFeatureSelected}
          selectedFeatureCode={featureCode}
        />
      </div>
      <div className={bem('DetailsPanel')}>
        <Details repositoryUrl={repositoryUrl} feature={feature} isPending={featureIsPending} />
      </div>
    </ProjectLayout>
  );
};
