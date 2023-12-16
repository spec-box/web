import { useEvent, useStore } from "effector-react/scope";
import { FC, useCallback } from "react";

import { FeatureCard } from "@/components/FeatureCard/FeatureCard";
import { ProjectFeatures } from "@/components/ProjectFeatures/ProjectFeatures";
import { useTitle } from "@/hooks";
import * as model from "@/model/pages/project";
import { Feature, TreeNode } from "@/types";
import { cn } from "@bem-react/classname";

import "./Project.css";
import { ProjectLayout } from "@/components/ProjectLayout/ProjectLayout";

const bem = cn("Project");

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
    return <div>ничего не выбрано</div>;
  } else {
    return (
      <FeatureCard
        className={bem("FeatureCard")}
        feature={feature}
        repositoryUrl={repositoryUrl}
      />
    );
  }
};

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
    [projectCode, loadFeature]
  );

  const navigate = useCallback(
    (project: string, feature: string) => loadFeature({ project, feature }),
    [loadFeature]
  );

  useTitle(structureIsPending ? "Структура проекта" : projectTitle);

  return (
    <ProjectLayout
      contentClassName={bem()}
      project={projectCode}
      navigate={navigate}
    >
      <div className={bem("ListPanel")}>
        <ProjectTree
          isPending={structureIsPending}
          tree={tree}
          onFeatureSelected={onFeatureSelected}
          selectedFeatureCode={featureCode}
        />
      </div>
      <div className={bem("DetailsPanel")}>
        <Details
          repositoryUrl={repositoryUrl}
          feature={feature}
          isPending={featureIsPending}
        />
      </div>
    </ProjectLayout>
  );
};
