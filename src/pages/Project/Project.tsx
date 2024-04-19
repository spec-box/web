import { useUnit } from 'effector-react/scope';
import { FC, useCallback, useState } from 'react';

import { ProjectTree } from '@/components/ProjectTree/ProjectTree';
import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/project';
import { cn } from '@bem-react/classname';

import './Project.css';
import { ProjectLayout } from '@/components/ProjectLayout/ProjectLayout';
import { Search } from '@/components/Search/Search';
import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { Graph } from '../Graph/Graph';
import React from 'react';
import { Button } from '@gravity-ui/uikit';

const bem = cn('Project');

export const Project: FC = () => {
  const structureIsPending = useUnit(model.$structureIsLoading);
  const {
    project: { code: projectCode, title: projectTitle, repositoryUrl },
    tree,
  } = useUnit(model.$filteredStructure);

  const loadFeature = useUnit(model.loadFeature);
  const feature = useUnit(model.$feature);
  const featureCode = useUnit(model.$featureCode);
  const featureIsPending = useUnit(model.$featureIsPending);
  const search = useUnit(model.$search);
  const changeSearch = useUnit(model.searchChanged);

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
        <Search value={search} onChange={changeSearch} />

        <ProjectTree
          isPending={structureIsPending}
          tree={tree}
          onFeatureSelected={onFeatureSelected}
          selectedFeatureCode={featureCode}
          search={search}
        />
      </div>
      <div className={bem('DetailsPanel')}>
        <FeatureCard
          repositoryUrl={repositoryUrl}
          feature={feature}
          isPending={structureIsPending || featureIsPending}
        />
      </div>
    </ProjectLayout>
  );
};
