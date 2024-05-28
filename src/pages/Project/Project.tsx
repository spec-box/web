import { useUnit } from 'effector-react';
import { FC, useCallback } from 'react';

import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { ProjectFeatures } from '@/components/ProjectFeatures/ProjectFeatures';
import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/project';
import { Feature, TreeNode } from '@/types';
import { cn } from '@bem-react/classname';

import './Project.css';
import { ProjectLayout } from '@/components/ProjectLayout/ProjectLayout';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';

const bem = cn('Project');

interface ProjectTreeProps {
  isPending: boolean;
  tree: TreeNode[];
  onFeatureSelected: (featureCode: string) => void;
  selectedFeatureCode?: string;
}

const ProjectTree: FC<ProjectTreeProps> = (props) => {
  const { isPending, tree, onFeatureSelected, selectedFeatureCode } = props;

  // todo: сделать обработку пустого значения

  if (isPending) {
    return <div>загрузка</div>;
  } else {
    return (
      <ProjectFeatures
        tree={tree}
        selectedFeatureCode={selectedFeatureCode}
        onFeatureSelected={onFeatureSelected}
      />
    );
  }
};

interface DetailsProps {
  feature: Feature | null;
  isPending: boolean;
  repositoryUrl?: string;
}

const Details: FC<DetailsProps> = ({ isPending, feature, repositoryUrl }) => {
  if (isPending) {
    return <div>загрузка</div>;
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
        <ProjectTree
          isPending={structureIsPending}
          tree={tree}
          onFeatureSelected={onFeatureSelected}
          selectedFeatureCode={featureCode}
        />
      </div>
      <div className={bem('DetailsPanel')}>
        <Details
          repositoryUrl={repositoryUrl}
          feature={feature}
          isPending={structureIsPending || featureIsPending}
        />
      </div>
    </ProjectLayout>
  );
};
