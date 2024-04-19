import { useEvent, useStore, useUnit } from 'effector-react/scope';
import { FC, useCallback, useMemo } from 'react';

import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { ProjectFeatures } from '@/components/ProjectFeatures/ProjectFeatures';
import { useTitle } from '@/hooks/useTitle';
import * as model from '@/model/pages/project';
import { Feature, TreeCodes, TreeNode } from '@/types';
import { cn } from '@bem-react/classname';

import './Project.css';
import { ProjectLayout } from '@/components/ProjectLayout/ProjectLayout';
import { PlaceholderMessage } from '@/components/PlaceholderMessage/PlaceholderMessage';
import {RadioButton} from '@gravity-ui/uikit';

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
interface TreeChoiceProps{
  treeCodes: TreeCodes;
  onUpdate: (value:string) => void;
  defaultValue: string;
}
const TreesChoice: FC<TreeChoiceProps> = (props)=>{
  const {treeCodes, onUpdate, defaultValue} = props
  const selectOptions = useMemo(()=> treeCodes.trees.map((tree)=> ({value: tree.code, content: tree.title})), [treeCodes])
  if (!defaultValue) return (<>Загрузка</>)

  return (<span>
    Сгруппировать по
    <RadioButton
    className={bem('TreeChoice')}
    options={selectOptions} 
    defaultValue={defaultValue}
    onUpdate={onUpdate}
  />
  </span>)
  
}

export const Project: FC = () => {
  const structureIsPending = useStore(model.$structureIsLoading);
  const {
    project: { code: projectCode, title: projectTitle, repositoryUrl },
    tree,
  } = useStore(model.$structure);

  const loadFeature = useEvent(model.loadFeature);
  const feature = useStore(model.$feature);
  const featureCode = useStore(model.$featureCode);
  const featureIsPending = useStore(model.$featureIsPending);

  const onFeatureSelected = useCallback(
    (feature: string) => loadFeature({ project: projectCode, feature }),
    [projectCode, loadFeature],
  );

  const navigate = useCallback(
    (project: string, feature: string) => loadFeature({ project, feature }),
    [loadFeature],
  );

  useTitle(structureIsPending ? 'Структура проекта' : projectTitle);
  const treeCode = useUnit(model.$treeCode)
  const toggleTree = useUnit(model.toggleTree)
  const onUpdate= (value: string)=> {
    toggleTree(value)}
  const treeCodes = useUnit(model.$treeCodes)
  

  return (
    <ProjectLayout contentClassName={bem()} project={projectCode} navigate={navigate}>
      <div className={bem('Tree')}>
        <TreesChoice onUpdate={onUpdate} treeCodes={treeCodes} defaultValue={treeCode}/>
        <div className={bem('ListPanel')}>
        <ProjectTree
          isPending={structureIsPending}
          tree={tree}
          onFeatureSelected={onFeatureSelected}
          selectedFeatureCode={featureCode}
        />
      </div>
    </div>
      
      <div className={bem('DetailsPanel')}>
        <Details repositoryUrl={repositoryUrl} feature={feature} isPending={structureIsPending || featureIsPending} />
      </div>
    </ProjectLayout>
  );
};
